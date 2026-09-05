import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import StatCard from "@/components/StatCard";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default async function DashboardPage() {
  const session = getSession()!;
  const boutiqueId = session.boutiqueId;

  const boutique = await prisma.boutique.findUnique({ where: { id: boutiqueId } });

  const [enCours, enAttente, termineesTotal, repairs] = await Promise.all([
    prisma.repair.count({ where: { boutiqueId, statut: "en_cours" } }),
    prisma.repair.count({ where: { boutiqueId, statut: "en_attente" } }),
    prisma.repair.count({ where: { boutiqueId, statut: "termine" } }),
    prisma.repair.findMany({
      where: { boutiqueId },
      include: { device: { include: { client: true } } },
      orderBy: { dateDepot: "desc" },
      take: 6,
    }),
  ]);

  const ca = await prisma.repair.aggregate({
    where: { boutiqueId, statut: "termine" },
    _sum: { prix: true },
  });

  const statusLabel: Record<string, string> = {
    en_attente: "En attente",
    en_cours: "En cours",
    termine: "Terminé",
  };
  const statusClass: Record<string, string> = {
    en_attente: "bg-red text-white",
    en_cours: "bg-orange text-white",
    termine: "bg-green text-white",
  };

  return (
    <div>
      <h1 className="font-display text-xl text-navy mb-6">Tableau de bord</h1>

      {boutique && !boutique.publie && (
        <a
          href="/dashboard/profil"
          className="block bg-orange/10 border border-orange/30 text-navy rounded-card px-5 py-4 mb-6 text-sm"
        >
          <span className="font-semibold">
            🏪 Votre boutique n'est pas encore visible dans l'annuaire.
          </span>{" "}
          Complétez votre profil (ville, téléphone, position GPS) pour
          apparaître dans les résultats de recherche des clients. →
        </a>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Réparations en cours" value={enCours} color="blue" />
        <StatCard label="En attente" value={enAttente} color="orange" />
        <StatCard label="Terminées" value={termineesTotal} color="green" />
        <StatCard
          label="Chiffre d'affaires"
          value={`${(ca._sum.prix || 0).toFixed(0)} DT`}
          color="red"
        />
      </div>

      <AnalyticsCharts />

      <div className="bg-white border border-line rounded-card p-6">
        <h2 className="font-display text-base text-navy mb-4">
          Dernières réparations
        </h2>
        {repairs.length === 0 ? (
          <p className="text-sm text-inkSoft">
            Aucune réparation pour le moment. Ajoutez votre premier client
            puis une réparation depuis les menus à gauche.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-inkSoft uppercase border-b border-line">
                <th className="py-2">Client</th>
                <th className="py-2">Appareil</th>
                <th className="py-2">Problème</th>
                <th className="py-2">Statut</th>
                <th className="py-2">Prix</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="py-3">{r.device.client.nom}</td>
                  <td className="py-3">
                    {r.device.marque} {r.device.modele}
                  </td>
                  <td className="py-3">{r.probleme}</td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass[r.statut]}`}
                    >
                      {statusLabel[r.statut]}
                    </span>
                  </td>
                  <td className="py-3 font-mono">{r.prix.toFixed(0)} DT</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
