import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const devices = await prisma.device.findMany({
    where: { boutiqueId: session.boutiqueId },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(devices);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { clientId, marque, modele, imei } = await req.json();
  if (!clientId || !marque || !modele) {
    return NextResponse.json(
      { error: "Client, marque et modèle requis." },
      { status: 400 }
    );
  }

  // Vérifie que le client appartient bien à la boutique courante
  const client = await prisma.client.findFirst({
    where: { id: clientId, boutiqueId: session.boutiqueId },
  });
  if (!client) {
    return NextResponse.json({ error: "Client introuvable." }, { status: 404 });
  }

  const device = await prisma.device.create({
    data: {
      boutiqueId: session.boutiqueId,
      clientId,
      marque,
      modele,
      imei: imei || null,
    },
  });
  return NextResponse.json(device);
}
