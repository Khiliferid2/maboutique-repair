import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getKonnectPaymentStatus } from "@/lib/payment";

// Konnect appelle cette URL (webhook) après chaque tentative de paiement.
// On revérifie toujours le statut auprès de Konnect plutôt que de faire
// confiance aux paramètres reçus, pour éviter toute fraude côté client.
export async function POST(req: NextRequest) {
  try {
    const { payment_ref } = await req.json();
    if (!payment_ref) {
      return NextResponse.json({ error: "payment_ref manquant." }, { status: 400 });
    }

    const status = await getKonnectPaymentStatus(payment_ref);
    const paye = status === "completed";

    // Cas 1 : paiement d'une commande (marketplace)
    const order = await prisma.order.findFirst({ where: { paiementRef: payment_ref } });
    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paiementStatut: paye ? "paye" : "echoue" },
      });
      return NextResponse.json({ ok: true, type: "order" });
    }

    // Cas 2 : paiement d'un abonnement (Pro / Premium) — met à jour le plan automatiquement
    const subscription = await prisma.subscriptionPayment.findFirst({
      where: { paiementRef: payment_ref },
    });
    if (subscription) {
      await prisma.subscriptionPayment.update({
        where: { id: subscription.id },
        data: { statut: paye ? "paye" : "echoue" },
      });
      if (paye) {
        await prisma.boutique.update({
          where: { id: subscription.boutiqueId },
          data: { plan: subscription.plan },
        });
      }
      return NextResponse.json({ ok: true, type: "subscription" });
    }

    return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur webhook." }, { status: 500 });
  }
}
