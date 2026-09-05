import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { distanceKm } from "@/lib/geo";
import { PLAN_RANK } from "@/lib/services-catalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service")?.trim() || "";
  const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
  const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;

  const boutiques = await prisma.boutique.findMany({
    where: {
      publie: true,
      ...(service
        ? { services: { some: { nom: { contains: service } } } }
        : {}),
    },
    include: { services: true, photos: true, reviews: true },
  });

  const results = boutiques.map((b) => {
    const dist =
      lat != null && lng != null && b.latitude != null && b.longitude != null
        ? distanceKm(lat, lng, b.latitude, b.longitude)
        : null;
    const avgNote =
      b.reviews.length > 0
        ? b.reviews.reduce((s, r) => s + r.note, 0) / b.reviews.length
        : null;
    return {
      id: b.id,
      nom: b.nom,
      ville: b.ville,
      adresse: b.adresse,
      telephone: b.telephone,
      whatsapp: b.whatsapp,
      logoUrl: b.logoUrl,
      plan: b.plan,
      horaires: b.horaires,
      services: b.services.map((s) => s.nom),
      distanceKm: dist,
      planRank: PLAN_RANK[b.plan] ?? 1,
      avgNote,
      avisCount: b.reviews.length,
    };
  });

  // Tri : d'abord les plans les plus élevés (premium > pro > free),
  // puis par distance croissante si on a une position, sinon par nom.
  results.sort((a, b) => {
    if (b.planRank !== a.planRank) return b.planRank - a.planRank;
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return a.nom.localeCompare(b.nom);
  });

  return NextResponse.json(results);
}
