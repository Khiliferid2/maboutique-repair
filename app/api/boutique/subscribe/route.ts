import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { initKonnectPayment, isKonnectConfigured } from "@/lib/payment";
import { PLAN_PRICES } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { plan } = await req.json(); // "pro" | "premium"
  if (plan !== "pro" && plan !== "premium") {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }

  if (!isKonnectConfigured()) {
    return NextResponse.json(
      {
        error:
          "Le paiement en ligne n'est pas encore configuré. Contactez le support pour activer votre abonnement.",
      },
      { status: 503 }
    );
  }

  const boutique = await prisma.boutique.findUnique({ where: { id: session.boutiqueId } });
  if (!boutique) {
    return NextResponse.json({ error: "Boutique introuvable." }, { status: 404 });
  }

  const montant = PLAN_PRICES[plan];

  const payment = await prisma.subscriptionPayment.create({
    data: { boutiqueId: boutique.id, plan, montant },
  });

  const origin = req.nextUrl.origin;
  const { payUrl, paymentRef } = await initKonnectPayment({
    montantDT: montant,
    orderId: `sub_${payment.id}`,
    orderNumero: `ABO-${payment.id.slice(0, 6)}`,
    clientNom: boutique.nom,
    clientTelephone: boutique.telephone || "",
    successUrl: `${origin}/dashboard/abonnement?paiement=succes`,
    failUrl: `${origin}/dashboard/abonnement?paiement=echec`,
  });

  await prisma.subscriptionPayment.update({
    where: { id: payment.id },
    data: { paiementRef },
  });

  return NextResponse.json({ payUrl });
}
