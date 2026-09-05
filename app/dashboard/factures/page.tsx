import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function FacturesPage() {
  const session = getSession()!;

  const invoices = await prisma.invoice.findMany({
    where: { boutiqueId: session.boutiqueId },
    include: {
      repair: { include: { device: { include: { client: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-xl text-navy mb-2">Factures</h1>
      <p className="text-sm text-inkSoft mb-6">
        Une facture est générée automatiquement dès qu'une réparation passe
        au statut « Terminé ».
      </p>

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {invoices.length === 0 ? (
          <p className="p-6 text-sm text-inkSoft">
            Aucune facture pour le moment. Terminez une réparation pour en
            générer une automatiquement.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-inkSoft uppercase border-b border-line bg-paper">
                <th className="py-3 px-5">N° Facture</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Appareil</th>
                <th className="py-3 px-5">Montant</th>
                <th className="py-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-line last:border-0">
                  <td className="py-3 px-5 font-mono font-semibold text-navy">
                    {inv.numero}
                  </td>
                  <td className="py-3 px-5">{inv.repair.device.client.nom}</td>
                  <td className="py-3 px-5">
                    {inv.repair.device.marque} {inv.repair.device.modele}
                  </td>
                  <td className="py-3 px-5 font-mono">
                    {inv.montant.toFixed(0)} DT
                  </td>
                  <td className="py-3 px-5 text-inkSoft">
                    {new Date(inv.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
