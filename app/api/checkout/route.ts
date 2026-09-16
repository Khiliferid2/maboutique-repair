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

    if (!boutiqueId || !items?.length || !clientNom || !clientTelephone || !clientAdresse) {
      return NextResponse.json(
        { error: "Informations de commande incomplètes." },
        { status: 400 }
      );
    }

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
      if (item.quantite < 1) {
        return NextResponse.json({ error: "Quantité invalide." }, { status: 400 });
      }
      if (product.stock < item.quantite) {
        return NextResponse.json(
          { error: `Stock insuffisant pour "${product.nom}".` },
          { status: 409 }
        );
      }
      montantTotal += product.prix * item.quantite;
      orderItemsData.push({
        productId: product.id,
        nom: product.nom,
        prix: product.prix,
        quantite: item.quantite,
      });
    }

    // Crée la commande + décrémente le stock, dans une même transaction.
    // Le numéro est aussi calculé à l'intérieur : le lire hors transaction
    // permettait à deux commandes simultanées de la même boutique de
    // calculer le même numéro et de se percuter sur la contrainte unique.
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const count = await tx.order.count({ where: { boutiqueId } });
      const numero = `CMD-${String(count + 1).padStart(4, "0")}`;

      const created = await tx.order.create({
        data: {
          boutiqueId,
          numero,
          clientNom,
          clientTelephone,
          clientAdresse,
          clientVille: clientVille || null,
          modePaiement,
          montantTotal,
          items: { create: orderItemsData },
        },
      });

      for (const item of orderItemsData) {
        // Décrémentation conditionnelle : n'aboutit que si le stock est
        // encore suffisant au moment de l'écriture, ce qui évite un stock
        // négatif si deux commandes visent la même dernière pièce en même
        // temps (la vérification faite plus haut, avant la transaction,
        // ne suffit pas seule à l'empêcher).
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantite } },
          data: { stock: { decrement: item.quantite } },
        });
        if (result.count === 0) {
          throw new Error(`STOCK_INSUFFISANT:${item.nom}`);
        }
      }

      return created;
    });

    // Notifie le propriétaire de la boutique par email (best-effort, ne bloque jamais la commande)
    const owner = await prisma.user.findFirst({ where: { boutiqueId } });
    const boutique = await prisma.boutique.findUnique({ where: { id: boutiqueId } });
    if (owner && boutique) {
      sendEmail({
        to: owner.email,
        subject: `Nouvelle commande ${order.numero} — ${boutique.nom}`,
        html: newOrderEmailHtml({
          boutiqueNom: boutique.nom,
          numero: order.numero,
          clientNom,
          clientTelephone,
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
        orderNumero: order.numero,
        clientNom,
        clientTelephone,
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
    if (err instanceof Error && err.message.startsWith("STOCK_INSUFFISANT:")) {
      const nom = err.message.split(":")[1];
      return NextResponse.json(
        { error: `Stock insuffisant pour "${nom}". Un autre client vient de le commander.` },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la commande. Réessayez." },
      { status: 500 }
    );
  }
}
