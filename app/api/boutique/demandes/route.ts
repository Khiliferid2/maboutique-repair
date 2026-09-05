import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const demandes = await prisma.repairRequest.findMany({
    where: { boutiqueId: session.boutiqueId },
    include: { devis: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(demandes);
}
