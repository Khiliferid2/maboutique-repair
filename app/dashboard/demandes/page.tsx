"use client";

import { useEffect, useState } from "react";

type Devis = { id: string; total: number; statut: string };
type Demande = {
  id: string;
  typeAppareil: string;
  marque: string | null;
  modele: string | null;
  probleme: string;
  photoUrl: string | null;
  clientNom: string;
  clientTelephone: string;
  statut: string;
  createdAt: string;
  devis: Devis | null;
};

const statusLabel: Record<string, string> = {
  nouvelle: "Nouvelle",
  devis_envoye: "Devis envoyé",
  acceptee: "Acceptée",
  refusee: "Refusée",
  terminee: "Terminée",
};
const statusClass: Record<string, string> = {
  nouvelle: "bg-orange text-navy",
  devis_envoye: "bg-blue text-white",
  acceptee: "bg-green text-white",
  refusee: "bg-red text-white",
  terminee: "bg-line text-inkSoft",
};

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ diagnostic: "", piece: "", mainOeuvre: "", message: "" });
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/boutique/demandes");
    setDemandes(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openDevisForm(d: Demande) {
    setOpenId(openId === d.id ? null : d.id);
    setForm({ diagnostic: "", piece: "", mainOeuvre: "", message: "" });
  }

  async function sendDevis(requestId: string) {
    setSending(true);
    await fetch(`/api/boutique/demandes/${requestId}/devis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    setOpenId(null);
    load();
  }

  const total =
    (parseFloat(form.diagnostic) || 0) + (parseFloat(form.piece) || 0) + (parseFloat(form.mainOeuvre) || 0);

  return (
    <div>
      <h1 className="font-display text-xl text-navy mb-1">Demandes de réparation</h1>
      <p className="text-sm text-inkSoft mb-6">
        Demandes envoyées par des clients depuis votre profil public.
      </p>

      {loading ? (
        <p className="text-sm text-inkSoft">Chargement...</p>
      ) : demandes.length === 0 ? (
        <div className="bg-white border border-line rounded-card p-6">
          <p className="text-sm text-inkSoft">Aucune demande pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((d) => (
            <div key={d.id} className="bg-white border border-line rounded-card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-navy">
                      {d.typeAppareil} {d.marque && `— ${d.marque} ${d.modele || ""}`}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass[d.statut]}`}>
                      {statusLabel[d.statut]}
                    </span>
                  </div>
                  <p className="text-sm text-inkSoft">{d.probleme}</p>
                  <p className="text-xs text-inkSoft mt-1">
                    {d.clientNom} · {d.clientTelephone}
                  </p>
                </div>
                {d.statut === "nouvelle" || d.statut === "devis_envoye" ? (
                  <button
                    onClick={() => openDevisForm(d)}
                    className="bg-blue text-white text-xs font-semibold px-3 py-2 rounded-lg"
                  >
                    {d.devis ? "Modifier le devis" : "Envoyer un devis"}
                  </button>
                ) : d.devis ? (
                  <span className="text-sm font-mono font-bold text-navy">{d.devis.total.toFixed(0)} DT</span>
                ) : null}
              </div>

              {openId === d.id && (
                <div className="border-t border-line pt-4 mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Diagnostic (DT)"
                    value={form.diagnostic}
                    onChange={(e) => setForm({ ...form, diagnostic: e.target.value })}
                    className="border border-line rounded-lg px-3 py-2 text-sm bg-paper"
                  />
                  <input
                    type="number"
                    placeholder="Pièce (DT)"
                    value={form.piece}
                    onChange={(e) => setForm({ ...form, piece: e.target.value })}
                    className="border border-line rounded-lg px-3 py-2 text-sm bg-paper"
                  />
                  <input
                    type="number"
                    placeholder="Main-d'œuvre (DT)"
                    value={form.mainOeuvre}
                    onChange={(e) => setForm({ ...form, mainOeuvre: e.target.value })}
                    className="border border-line rounded-lg px-3 py-2 text-sm bg-paper"
                  />
                  <textarea
                    placeholder="Message pour le client (optionnel)"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="border border-line rounded-lg px-3 py-2 text-sm bg-paper md:col-span-3"
                    rows={2}
                  />
                  <div className="md:col-span-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy">
                      Total : <span className="font-mono">{total.toFixed(0)} DT</span>
                    </span>
                    <button
                      onClick={() => sendDevis(d.id)}
                      disabled={sending}
                      className="bg-orange text-navy font-bold text-sm px-5 py-2 rounded-lg disabled:opacity-60"
                    >
                      {sending ? "Envoi..." : "Envoyer le devis"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
