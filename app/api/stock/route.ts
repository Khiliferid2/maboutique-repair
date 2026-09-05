import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const items = await prisma.stockItem.findMany({
    where: { boutiqueId: session.boutiqueId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { nom, quantite, seuilAlerte, prixAchat } = await req.json();
  if (!nom) {
    return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  }

  const item = await prisma.stockItem.create({
    data: {
      boutiqueId: session.boutiqueId,
      nom,
      quantite: quantite ? parseInt(quantite) : 0,
      seuilAlerte: seuilAlerte ? parseInt(seuilAlerte) : 3,
      prixAchat: prixAchat ? parseFloat(prixAchat) : 0,
    },
  });
  return NextResponse.json(item);
}
