"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

type Devis = {
  id: string;
  diagnostic: number;
  piece: number;
  mainOeuvre: number;
  total: number;
  message: string | null;
  statut: string;
};
type RequestData = {
  id: string;
  typeAppareil: string;
  marque: string | null;
  modele: string | null;
  probleme: string;
  statut: string;
  devis: Devis | null;
  boutique: { nom: string; telephone: string | null; whatsapp: string | null };
};

const statusLabel: Record<string, string> = {
  nouvelle: "En attente de devis",
  devis_envoye: "Devis reçu — en attente de votre réponse",
  acceptee: "Devis accepté",
  refusee: "Devis refusé",
  terminee: "Réparation terminée",
};

export default function SuiviPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/suivi/${id}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function respond(reponse: "accepte" | "refuse") {
    setResponding(true);
    await fetch(`/api/suivi/${id}/reponse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reponse }),
    });
    await load();
    setResponding(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-sm text-inkSoft">Chargement...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6">
        <p className="text-sm text-inkSoft">Demande introuvable.</p>
      </main>
    );
  }

  const whatsappUrl = data.boutique.whatsapp
    ? `https://wa.me/${data.boutique.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <main className="min-h-screen bg-paper px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>

        <div className="bg-white border border-line rounded-card p-6 mb-6">
          <p className="text-xs text-inkSoft mb-1">Boutique</p>
          <h1 className="font-display text-lg text-navy mb-4">{data.boutique.nom}</h1>

          <div className="bg-paper rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-navy mb-1">
              {data.typeAppareil} {data.marque && `— ${data.marque} ${data.modele || ""}`}
            </p>
            <p className="text-sm text-inkSoft">{data.probleme}</p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-blue">
            <span className="w-2 h-2 rounded-full bg-blue"></span>
            {statusLabel[data.statut]}
          </div>
        </div>

        {data.devis && (
          <div className="bg-white border border-line rounded-card p-6 mb-6">
            <h2 className="font-display text-base text-navy mb-4">Devis proposé</h2>
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex justify-between"><span className="text-inkSoft">Diagnostic</span><span className="font-mono">{data.devis.diagnostic.toFixed(0)} DT</span></div>
              <div className="flex justify-between"><span className="text-inkSoft">Pièce</span><span className="font-mono">{data.devis.piece.toFixed(0)} DT</span></div>
              <div className="flex justify-between"><span className="text-inkSoft">Main-d'œuvre</span><span className="font-mono">{data.devis.mainOeuvre.toFixed(0)} DT</span></div>
              <div className="flex justify-between font-bold pt-2 mt-2 border-t border-line">
                <span>Total</span><span className="font-mono">{data.devis.total.toFixed(0)} DT</span>
              </div>
            </div>
            {data.devis.message && (
              <p className="text-sm text-inkSoft bg-paper rounded-lg p-3 mb-4">{data.devis.message}</p>
            )}

            {data.devis.statut === "envoye" ? (
              <div className="flex gap-3">
                <button
                  onClick={() => respond("accepte")}
                  disabled={responding}
                  className="flex-1 bg-green text-white font-bold py-3 rounded-lg disabled:opacity-60"
                >
                  ✓ Accepter
                </button>
                <button
                  onClick={() => respond("refuse")}
                  disabled={responding}
                  className="flex-1 border border-line text-navy font-semibold py-3 rounded-lg disabled:opacity-60"
                >
                  ✕ Refuser
                </button>
              </div>
            ) : (
              <p className={`text-sm font-semibold ${data.devis.statut === "accepte" ? "text-green" : "text-red"}`}>
                {data.devis.statut === "accepte" ? "✓ Vous avez accepté ce devis" : "✕ Vous avez refusé ce devis"}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {data.boutique.telephone && (
            <a href={`tel:${data.boutique.telephone}`} className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              📞 Appeler
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" className="bg-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              💬 WhatsApp
            </a>
          )}
        </div>

        <p className="text-center text-xs text-inkSoft mt-6">
          <Link href="/recherche" className="text-blue">← Retour à la recherche</Link>
        </p>
      </div>
    </main>
  );
}
