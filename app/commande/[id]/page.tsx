import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Logo from "@/components/Logo";

const statusLabel: Record<string, string> = {
  nouvelle: "Nouvelle",
  preparee: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export default async function CommandeConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { paiement?: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, boutique: { select: { nom: true, telephone: true, whatsapp: true } } },
  });

  if (!order) notFound();

  const paiementRate = searchParams.paiement;

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>

        <div className="bg-white border border-line rounded-card p-8 text-center">
          {order.modePaiement === "carte" && paiementRate === "echec" ? (
            <>
              <div className="text-4xl mb-3">⚠️</div>
              <h1 className="font-display text-xl text-navy mb-2">
                Paiement non abouti
              </h1>
              <p className="text-sm text-inkSoft mb-6">
                Votre commande {order.numero} est enregistrée mais le paiement
                n'a pas été confirmé. Contactez la boutique si le problème
                persiste.
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">✅</div>
              <h1 className="font-display text-xl text-navy mb-2">
                Commande confirmée
              </h1>
              <p className="text-sm text-inkSoft mb-6">
                Merci ! Votre commande <b className="text-navy">{order.numero}</b>{" "}
                a bien été enregistrée auprès de{" "}
                <b className="text-navy">{order.boutique.nom}</b>.
              </p>
            </>
          )}

          <div className="text-left border border-line rounded-lg p-4 mb-6">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm py-1.5">
                <span>
                  {it.nom} <span className="text-inkSoft">× {it.quantite}</span>
                </span>
                <span className="font-mono">{(it.prix * it.quantite).toFixed(0)} DT</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold pt-2 mt-2 border-t border-line">
              <span>Total</span>
              <span className="font-mono">{order.montantTotal.toFixed(0)} DT</span>
            </div>
          </div>

          <p className="text-xs text-inkSoft mb-6">
            Mode de paiement :{" "}
            {order.modePaiement === "carte" ? "Carte bancaire" : "À la livraison"} ·
            Statut : {statusLabel[order.statut]}
          </p>

          <div className="flex gap-3 justify-center">
            {order.boutique.whatsapp && (
              <a
                href={`https://wa.me/${order.boutique.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                className="bg-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                💬 Contacter la boutique
              </a>
            )}
            <Link
              href="/catalogue"
              className="border border-line text-navy text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
