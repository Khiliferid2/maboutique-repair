"use client";

import { useState } from "react";

type Review = {
  id: string;
  nom: string;
  note: number;
  commentaire: string | null;
  createdAt: string;
};

export default function ReviewSection({
  boutiqueId,
  initialReviews,
}: {
  boutiqueId: string;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", note: "5", commentaire: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boutiqueId, ...form }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      setLoading(false);
      return;
    }
    setReviews([data, ...reviews]);
    setForm({ nom: "", note: "5", commentaire: "" });
    setShowForm(false);
    setLoading(false);
  }

  return (
    <div className="bg-white border border-line rounded-card p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base text-navy">
          Avis clients ({reviews.length})
        </h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm font-semibold text-blue"
        >
          + Laisser un avis
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-line rounded-lg p-4 mb-5 space-y-3">
          {error && <p className="text-sm text-red">{error}</p>}
          <input
            required
            placeholder="Votre nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper"
          />
          <select
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n}/5)</option>
            ))}
          </select>
          <textarea
            placeholder="Votre commentaire (optionnel)"
            value={form.commentaire}
            onChange={(e) => setForm({ ...form, commentaire: e.target.value })}
            rows={3}
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Publier l'avis"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-inkSoft">Aucun avis pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-navy text-sm">{r.nom}</span>
                <span className="text-orange text-xs">{"★".repeat(r.note)}</span>
              </div>
              {r.commentaire && <p className="text-sm text-inkSoft">{r.commentaire}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
