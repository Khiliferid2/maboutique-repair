import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { reponse } = await req.json(); // "accepte" | "refuse"
  if (!["accepte", "refuse"].includes(reponse)) {
    return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
  }

  const request = await prisma.repairRequest.findUnique({
    where: { id: params.id },
    include: { devis: true },
  });
  if (!request || !request.devis) {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }

  await prisma.devis.update({
    where: { id: request.devis.id },
    data: { statut: reponse },
  });

  await prisma.repairRequest.update({
    where: { id: request.id },
    data: { statut: reponse === "accepte" ? "acceptee" : "refusee" },
  });

  return NextResponse.json({ ok: true });
}
