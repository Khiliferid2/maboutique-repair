"use client";

import { useEffect, useState } from "react";
import { exportToCsv } from "@/lib/csv-export";

type OrderItem = { id: string; nom: string; prix: number; quantite: number };
type Order = {
  id: string;
  numero: string;
  clientNom: string;
  clientTelephone: string;
  clientAdresse: string;
  clientVille: string | null;
  modePaiement: string;
  paiementStatut: string;
  statut: string;
  montantTotal: number;
  createdAt: string;
  items: OrderItem[];
};

const statusOptions = ["nouvelle", "preparee", "expediee", "livree", "annulee"];
const statusLabel: Record<string, string> = {
  nouvelle: "Nouvelle",
  preparee: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};
const statusClass: Record<string, string> = {
  nouvelle: "bg-orange text-navy",
  preparee: "bg-blue text-white",
  expediee: "bg-cyan text-white",
  livree: "bg-green text-white",
  annulee: "bg-red text-white",
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/boutique/orders");
    setOrders(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, statut: string) {
    await fetch(`/api/boutique/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl text-navy mb-1">Commandes en ligne</h1>
          <p className="text-sm text-inkSoft">
            Commandes passées par les clients depuis le catalogue MaBoutique Repair.
          </p>
        </div>
        <button
          onClick={() =>
            exportToCsv(
              "commandes.csv",
              orders.map((o) => ({
                Numero: o.numero,
                Client: o.clientNom,
                Téléphone: o.clientTelephone,
                Adresse: o.clientAdresse,
                Paiement: o.modePaiement,
                Statut: statusLabel[o.statut],
                Total: o.montantTotal,
              }))
            )
          }
          disabled={orders.length === 0}
          className="border border-line text-navy text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          ⬇ Exporter CSV
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-inkSoft">Chargement...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-line rounded-card p-6">
          <p className="text-sm text-inkSoft">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-line rounded-card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy">{o.numero}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass[o.statut]}`}>
                      {statusLabel[o.statut]}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        o.paiementStatut === "paye"
                          ? "bg-green/10 text-green"
                          : "bg-line text-inkSoft"
                      }`}
                    >
                      {o.modePaiement === "carte"
                        ? o.paiementStatut === "paye"
                          ? "Payée (carte)"
                          : "Carte — en attente"
                        : "Paiement à la livraison"}
                    </span>
                  </div>
                  <p className="text-sm text-inkSoft mt-1">
                    {o.clientNom} · {o.clientTelephone} · {o.clientAdresse}
                    {o.clientVille ? `, ${o.clientVille}` : ""}
                  </p>
                </div>
                <select
                  value={o.statut}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border border-line rounded-lg px-3 py-2 text-sm bg-paper"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-line pt-3 space-y-1">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-sm">
                    <span>{it.nom} × {it.quantite}</span>
                    <span className="font-mono">{(it.prix * it.quantite).toFixed(0)} DT</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-sm pt-1">
                  <span>Total</span>
                  <span className="font-mono">{o.montantTotal.toFixed(0)} DT</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
