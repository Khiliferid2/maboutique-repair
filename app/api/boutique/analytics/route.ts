import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const boutiqueId = session.boutiqueId;

  // Revenu quotidien des 14 derniers jours (réparations terminées)
  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const repairsTerminees = await prisma.repair.findMany({
    where: {
      boutiqueId,
      statut: "termine",
      dateTerminee: { gte: since },
    },
    select: { prix: true, dateTerminee: true },
  });

  const dayMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dayMap.set(key, 0);
  }
  for (const r of repairsTerminees) {
    if (!r.dateTerminee) continue;
    const key = r.dateTerminee.toISOString().slice(0, 10);
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) || 0) + r.prix);
    }
  }
  const revenueTrend = Array.from(dayMap.entries()).map(([date, montant]) => ({
    date: date.slice(5), // MM-DD
    montant,
  }));

  // Répartition des réparations par statut (toutes, pas seulement 14j)
  const [enAttente, enCours, termine] = await Promise.all([
    prisma.repair.count({ where: { boutiqueId, statut: "en_attente" } }),
    prisma.repair.count({ where: { boutiqueId, statut: "en_cours" } }),
    prisma.repair.count({ where: { boutiqueId, statut: "termine" } }),
  ]);

  return NextResponse.json({
    revenueTrend,
    statusBreakdown: [
      { name: "En attente", value: enAttente, color: "#EA5455" },
      { name: "En cours", value: enCours, color: "#FF9F43" },
      { name: "Terminées", value: termine, color: "#28C76F" },
    ],
  });
}
