import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { statut } = await req.json();
  if (!["nouvelle", "preparee", "expediee", "livree", "annulee"].includes(statut)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: params.id, boutiqueId: session.boutiqueId },
  });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { statut },
  });
  return NextResponse.json(updated);
}
