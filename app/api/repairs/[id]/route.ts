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
  if (!["en_attente", "en_cours", "termine"].includes(statut)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const repair = await prisma.repair.findFirst({
    where: { id: params.id, boutiqueId: session.boutiqueId },
  });
  if (!repair) {
    return NextResponse.json(
      { error: "Réparation introuvable." },
      { status: 404 }
    );
  }

  const updated = await prisma.repair.update({
    where: { id: repair.id },
    data: {
      statut,
      dateTerminee: statut === "termine" ? new Date() : null,
    },
  });

  // Génère automatiquement une facture à la clôture de la réparation
  if (statut === "termine") {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { repairId: repair.id },
    });
    if (!existingInvoice) {
      const count = await prisma.invoice.count({
        where: { boutiqueId: session.boutiqueId },
      });
      const numero = `FAC-${String(count + 1).padStart(4, "0")}`;
      await prisma.invoice.create({
        data: {
          boutiqueId: session.boutiqueId,
          repairId: repair.id,
          numero,
          montant: repair.prix,
        },
      });
    }
  }

  return NextResponse.json(updated);
}
