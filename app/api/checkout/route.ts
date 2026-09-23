import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { initKonnectPayment, isKonnectConfigured } from "@/lib/payment";
import { sendEmail, newOrderEmailHtml } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(`checkout:${ip}`)) {
      return NextResponse.json(
        { error: "Trop de commandes envoyées. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      boutiqueId,
      items, // [{ productId, quantite }]
      clientNom,
      clientTelephone,
      clientAdresse,
      clientVille,
      modePaiement, // "carte" | "livraison"
    } = body;

    if (
      !boutiqueId ||
      !items?.length ||
      !clientNom ||
      !clientTelephone ||
      !clientAdresse ||
      typeof clientNom !== "string" ||
      typeof clientTelephone !== "string" ||
      typeof clientAdresse !== "string"
    ) {
      return NextResponse.json(
        { error: "Informations de commande incomplètes." },
        { status: 400 }
      );
    }

    // Formulaire public sans authentification : on borne la taille de chaque
    // champ texte pour éviter un abus de stockage (textes énormes en base).
    const cClientNom = clientNom.trim().slice(0, 120);
    const cClientTelephone = clientTelephone.trim().slice(0, 30);
    const cClientAdresse = clientAdresse.trim().slice(0, 300);
    const cClientVille =
      typeof clientVille === "string" && clientVille.trim()
        ? clientVille.trim().slice(0, 80)
        : null;

    // Recharge les produits depuis la base pour valider prix et stock réels
    // (on ne fait jamais confiance aux prix envoyés par le client)
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, boutiqueId },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Un ou plusieurs produits sont introuvables." },
        { status: 404 }
      );
    }

    let montantTotal = 0;
    const orderItemsData: {
      productId: string;
      nom: string;
      prix: number;
      quantite: number;
    }[] = [];

    for (const item of items as { productId: string; quantite: number }[]) {
      const product = products.find((p: (typeof products)[number]) => p.id === item.productId)!;
      const quantite = Number(item.quantite);
      if (!Number.isFinite(quantite) || !Number.isInteger(quantite) || quantite < 1) {
        return NextResponse.json({ error: "Quantité invalide." }, { status: 400 });
      }
      if (product.stock < quantite) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${product.nom}".` },
          { status: 409 }
        );
      }
      montantTotal += product.prix * quantite;
      orderItemsData.push({
        productId: product.id,
        nom: product.nom,
        prix: product.prix,
        quantite,
      });
    }

    const count = await prisma.order.count({ where: { boutiqueId } });
    const numero = `CMD-${String(count + 1).padStart(4, "0")}`;

    // Crée la commande + décrémente le stock, dans une même transaction.
    // Le stock initial a été vérifié plus haut, mais deux clients peuvent
    // commander en même temps : sans re-vérification atomique ici, le
    // stock pourrait passer sous zéro (survente). On rend donc la
    // décrémentation elle-même conditionnelle (updateMany avec stock >=
    // quantité) et on annule toute la commande si un seul produit a été
    // vendu entre-temps par une autre commande concurrente.
    let order;
    try {
      order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const item of orderItemsData) {
          const result = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantite } },
            data: { stock: { decrement: item.quantite } },
          });
          if (result.count === 0) {
            throw new Error("STOCK_INSUFFISANT");
          }
        }

        return tx.order.create({
          data: {
            boutiqueId,
            numero,
            clientNom: cClientNom,
            clientTelephone: cClientTelephone,
            clientAdresse: cClientAdresse,
            clientVille: cClientVille,
            modePaiement,
            montantTotal,
            items: { create: orderItemsData },
          },
        });
      });
    } catch (err) {
      if (err instanceof Error && err.message === "STOCK_INSUFFISANT") {
        return NextResponse.json(
          { error: "Le stock a changé entre-temps, merci de vérifier votre panier et réessayer." },
          { status: 409 }
        );
      }
      throw err;
    }

    // Notifie le propriétaire de la boutique par email (best-effort, ne bloque jamais la commande)
    const owner = await prisma.user.findFirst({ where: { boutiqueId } });
    const boutique = await prisma.boutique.findUnique({ where: { id: boutiqueId } });
    if (owner && boutique) {
      sendEmail({
        to: owner.email,
        subject: `Nouvelle commande ${numero} — ${boutique.nom}`,
        html: newOrderEmailHtml({
          boutiqueNom: boutique.nom,
          numero,
          clientNom: cClientNom,
          clientTelephone: cClientTelephone,
          montantTotal,
        }),
      });
    }

    // Paiement par carte via Konnect
    if (modePaiement === "carte") {
      if (!isKonnectConfigured()) {
        return NextResponse.json(
          {
            error:
              "Le paiement par carte n'est pas encore configuré sur cette boutique. Choisissez « paiement à la livraison ».",
          },
          { status: 503 }
        );
      }

      const origin = req.nextUrl.origin;
      const { payUrl, paymentRef } = await initKonnectPayment({
        montantDT: montantTotal,
        orderId: order.id,
        orderNumero: numero,
        clientNom: cClientNom,
        clientTelephone: cClientTelephone,
        successUrl: `${origin}/commande/${order.id}?paiement=succes`,
        failUrl: `${origin}/commande/${order.id}?paiement=echec`,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { paiementRef: paymentRef },
      });

      return NextResponse.json({ orderId: order.id, payUrl });
    }

    // Paiement à la livraison : pas de redirection, commande confirmée directement
    return NextResponse.json({ orderId: order.id, payUrl: null });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la commande. Réessayez." },
      { status: 500 }
    );
  }
}
