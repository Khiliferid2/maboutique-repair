import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const services = await prisma.service.findMany({
    where: { boutiqueId: session.boutiqueId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { nom } = await req.json();
  if (!nom) {
    return NextResponse.json({ error: "Nom du service requis." }, { status: 400 });
  }

  try {
    const service = await prisma.service.create({
      data: { boutiqueId: session.boutiqueId, nom },
    });
    return NextResponse.json(service);
  } catch {
    // Contrainte unique (boutiqueId, nom) déjà existante
    return NextResponse.json(
      { error: "Ce service est déjà ajouté." },
      { status: 409 }
    );
  }
}
