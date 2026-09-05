import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boutiqueId = searchParams.get("boutiqueId");
  if (!boutiqueId) {
    return NextResponse.json({ error: "boutiqueId requis." }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { boutiqueId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(`review:${ip}`)) {
      return NextResponse.json(
        { error: "Trop d'avis envoyés. Réessayez plus tard." },
        { status: 429 }
      );
    }

    const { boutiqueId, nom, note, commentaire } = await req.json();

    if (!boutiqueId || !nom || !note) {
      return NextResponse.json(
        { error: "Nom et note requis." },
        { status: 400 }
      );
    }
    const noteInt = parseInt(note);
    if (noteInt < 1 || noteInt > 5) {
      return NextResponse.json(
        { error: "La note doit être entre 1 et 5." },
        { status: 400 }
      );
    }

    const boutique = await prisma.boutique.findFirst({
      where: { id: boutiqueId, publie: true },
    });
    if (!boutique) {
      return NextResponse.json({ error: "Boutique introuvable." }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        boutiqueId,
        nom,
        note: noteInt,
        commentaire: commentaire || null,
      },
    });
    return NextResponse.json(review);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
