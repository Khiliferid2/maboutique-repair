import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const boutique = await prisma.boutique.findUnique({
    where: { id: session.boutiqueId },
    include: { services: true, products: true, photos: true },
  });
  return NextResponse.json(boutique);
}

// Champs autorisés à la mise à jour depuis le formulaire "Profil de ma boutique"
const EDITABLE_FIELDS = [
  "nom",
  "description",
  "ville",
  "adresse",
  "telephone",
  "whatsapp",
  "facebook",
  "instagram",
  "horaires",
  "latitude",
  "longitude",
  "logoUrl",
] as const;

export async function PATCH(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      if (field === "latitude" || field === "longitude") {
        data[field] =
          body[field] === "" || body[field] === null
            ? null
            : parseFloat(body[field]);
      } else {
        data[field] = body[field] || null;
      }
    }
  }

  // Un profil est considéré "publié" (visible dans la recherche) dès qu'il a
  // un nom, une ville, un téléphone et au moins une position GPS.
  const updated = await prisma.boutique.update({
    where: { id: session.boutiqueId },
    data,
  });

  const complet = Boolean(
    updated.nom && updated.ville && updated.telephone && updated.latitude && updated.longitude
  );
  if (complet !== updated.publie) {
    await prisma.boutique.update({
      where: { id: session.boutiqueId },
      data: { publie: complet },
    });
  }

  const fresh = await prisma.boutique.findUnique({
    where: { id: session.boutiqueId },
    include: { services: true, products: true },
  });

  return NextResponse.json(fresh);
}
