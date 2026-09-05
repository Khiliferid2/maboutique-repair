import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getKonnectPaymentStatus } from "@/lib/payment";

export async function POST() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const pending = await prisma.subscriptionPayment.findFirst({
    where: { boutiqueId: session.boutiqueId, statut: "en_attente" },
    orderBy: { createdAt: "desc" },
  });
  if (!pending || !pending.paiementRef) {
    return NextResponse.json({ plan: null });
  }

  const status = await getKonnectPaymentStatus(pending.paiementRef);
  const paye = status === "completed";

  await prisma.subscriptionPayment.update({
    where: { id: pending.id },
    data: { statut: paye ? "paye" : "echoue" },
  });

  if (paye) {
    const boutique = await prisma.boutique.update({
      where: { id: session.boutiqueId },
      data: { plan: pending.plan },
    });
    return NextResponse.json({ plan: boutique.plan });
  }

  return NextResponse.json({ plan: null });
}
