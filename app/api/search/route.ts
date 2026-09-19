import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { distanceKm } from "@/lib/geo";
import { PLAN_RANK } from "@/lib/services-catalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service")?.trim() || "";
  const gouvernorat = searchParams.get("gouvernorat")?.trim() || "";
  const delegation = searchParams.get("delegation")?.trim() || "";
  const marque = searchParams.get("marque")?.trim() || "";
  const minNote = searchParams.get("minNote") ? parseFloat(searchParams.get("minNote")!) : null;
  // Recherche en texte libre, ex: "Réparation écran iPhone" — on découpe en
  // mots-clés et on cherche des correspondances sur le nom de la boutique
  // ou le nom de ses services.
  const q = searchParams.get("q")?.trim() || "";
  const qWords = q.split(/\s+/).filter(Boolean);

  const lat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
  const lng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;

  const boutiques = await prisma.boutique.findMany({
    where: {
      publie: true,
      ...(service
        ? { services: { some: { nom: { contains: service } } } }
        : {}),
      ...(marque
        ? { services: { some: { nom: { contains: marque } } } }
        : {}),
      ...(gouvernorat ? { gouvernorat } : {}),
      ...(delegation ? { delegation } : {}),
      ...(qWords.length > 0
        ? {
            OR: qWords.flatMap((word) => [
              { nom: { contains: word } },
              { services: { some: { nom: { contains: word } } } },
            ]),
          }
        : {}),
    },
    include: { services: true, photos: true, reviews: true },
  });

  const results = boutiques.map((b: (typeof boutiques)[number]) => {
    const dist =
      lat != null && lng != null && b.latitude != null && b.longitude != null
        ? distanceKm(lat, lng, b.latitude, b.longitude)
        : null;
    const avgNote =
      b.reviews.length > 0
        ? b.reviews.reduce((s: number, r: (typeof b.reviews)[number]) => s + r.note, 0) / b.reviews.length
        : null;
    return {
      id: b.id,
      nom: b.nom,
      ville: b.ville,
      gouvernorat: b.gouvernorat,
      delegation: b.delegation,
      adresse: b.adresse,
      telephone: b.telephone,
      whatsapp: b.whatsapp,
      logoUrl: b.logoUrl,
      plan: b.plan,
      verified: b.verified,
      horaires: b.horaires,
      services: b.services.map((s: (typeof b.services)[number]) => s.nom),
      distanceKm: dist,
      planRank: PLAN_RANK[b.plan] ?? 1,
      avgNote,
      avisCount: b.reviews.length,
    };
  });

  // Filtre par note minimale (fait ici car avgNote est calculé après la requête DB)
  const filtered = minNote != null ? results.filter((r: (typeof results)[number]) => (r.avgNote ?? 0) >= minNote) : results;

  // Tri : d'abord les plans les plus élevés (premium > pro > free),
  // puis par distance croissante si on a une position, sinon par nom.
  filtered.sort((a: (typeof filtered)[number], b: (typeof filtered)[number]) => {
    if (b.planRank !== a.planRank) return b.planRank - a.planRank;
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return a.nom.localeCompare(b.nom);
  });

  return NextResponse.json(filtered);
}
