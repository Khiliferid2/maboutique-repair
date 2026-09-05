import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { boutiqueId: session.boutiqueId },
    include: { devices: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { nom, telephone, email } = await req.json();
    if (!nom || !telephone) {
      return NextResponse.json(
        { error: "Nom et téléphone requis." },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        boutiqueId: session.boutiqueId,
        nom,
        telephone,
        email: email || null,
      },
    });
    return NextResponse.json(client);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}
