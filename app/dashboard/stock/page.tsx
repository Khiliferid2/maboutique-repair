"use client";

import { useEffect, useState } from "react";

type StockItem = {
  id: string;
  nom: string;
  quantite: number;
  seuilAlerte: number;
  prixAchat: number;
};

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    quantite: "",
    seuilAlerte: "3",
    prixAchat: "",
  });
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/stock");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setForm({ nom: "", quantite: "", seuilAlerte: "3", prixAchat: "" });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl text-navy">Stock & pièces</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + Nouvelle pièce
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-line rounded-card p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {error && (
            <div className="md:col-span-4 text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
          <input
            required
            placeholder="Nom de la pièce *"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            type="number"
            placeholder="Quantité"
            value={form.quantite}
            onChange={(e) => setForm({ ...form, quantite: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            type="number"
            placeholder="Seuil d'alerte"
            value={form.seuilAlerte}
            onChange={(e) => setForm({ ...form, seuilAlerte: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            type="number"
            placeholder="Prix d'achat (DT)"
            value={form.prixAchat}
            onChange={(e) => setForm({ ...form, prixAchat: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <button
            type="submit"
            className="md:col-span-4 bg-navy text-white font-semibold py-2.5 rounded-lg"
          >
            Enregistrer la pièce
          </button>
        </form>
      )}

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-inkSoft">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-inkSoft">Aucune pièce en stock.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-inkSoft uppercase border-b border-line bg-paper">
                <th className="py-3 px-5">Pièce</th>
                <th className="py-3 px-5">Quantité</th>
                <th className="py-3 px-5">Seuil d'alerte</th>
                <th className="py-3 px-5">Prix d'achat</th>
                <th className="py-3 px-5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const low = it.quantite <= it.seuilAlerte;
                return (
                  <tr key={it.id} className="border-b border-line last:border-0">
                    <td className="py-3 px-5 font-semibold text-navy">{it.nom}</td>
                    <td className="py-3 px-5 font-mono">{it.quantite}</td>
                    <td className="py-3 px-5 font-mono text-inkSoft">
                      {it.seuilAlerte}
                    </td>
                    <td className="py-3 px-5 font-mono">
                      {it.prixAchat.toFixed(0)} DT
                    </td>
                    <td className="py-3 px-5">
                      {low ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red text-white">
                          Rupture proche
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green text-white">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
