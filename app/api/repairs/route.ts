import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const repairs = await prisma.repair.findMany({
    where: { boutiqueId: session.boutiqueId },
    include: { device: { include: { client: true } } },
    orderBy: { dateDepot: "desc" },
  });
  return NextResponse.json(repairs);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { deviceId, probleme, prix, coutPieces, garantieMois, technicien } =
    await req.json();

  if (!deviceId || !probleme) {
    return NextResponse.json(
      { error: "Appareil et problème requis." },
      { status: 400 }
    );
  }

  const device = await prisma.device.findFirst({
    where: { id: deviceId, boutiqueId: session.boutiqueId },
  });
  if (!device) {
    return NextResponse.json({ error: "Appareil introuvable." }, { status: 404 });
  }

  const repair = await prisma.repair.create({
    data: {
      boutiqueId: session.boutiqueId,
      deviceId,
      probleme,
      prix: prix ? parseFloat(prix) : 0,
      coutPieces: coutPieces ? parseFloat(coutPieces) : 0,
      garantieMois: garantieMois ? parseInt(garantieMois) : 3,
      technicien: technicien || null,
      statut: "en_attente",
    },
  });
  return NextResponse.json(repair);
}
