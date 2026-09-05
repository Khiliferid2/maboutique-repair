"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const TYPES = ["Smartphone", "PC / Laptop", "Console", "Tablette", "Smartwatch", "Autre"];

export default function DemandeReparationPage() {
  const params = useParams();
  const router = useRouter();
  const boutiqueId = params.id as string;

  const [form, setForm] = useState({
    typeAppareil: "Smartphone",
    marque: "",
    modele: "",
    probleme: "",
    photoUrl: "",
    clientNom: "",
    clientTelephone: "",
    clientEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boutiqueId, ...form }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    router.push(`/suivi/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 font-display font-bold text-navy mb-2 justify-center">
          <Logo size={36} />
        </div>
        <h1 className="font-display text-xl text-navy text-center mb-1">
          Demander une réparation
        </h1>
        <p className="text-sm text-inkSoft text-center mb-8">
          Décrivez votre problème, la boutique vous enverra un devis.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-card p-6 space-y-4">
          {error && (
            <p className="text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy mb-2">Type d'appareil *</label>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, typeAppareil: t })}
                  className={`text-xs font-semibold py-2.5 rounded-lg border ${
                    form.typeAppareil === t
                      ? "bg-navy text-white border-navy"
                      : "border-line text-navy"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Marque</label>
              <input
                value={form.marque}
                onChange={(e) => setForm({ ...form, marque: e.target.value })}
                placeholder="iPhone, Samsung..."
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Modèle</label>
              <input
                value={form.modele}
                onChange={(e) => setForm({ ...form, modele: e.target.value })}
                placeholder="11, A15..."
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Décrivez le problème *</label>
            <textarea
              required
              value={form.probleme}
              onChange={(e) => setForm({ ...form, probleme: e.target.value })}
              rows={3}
              placeholder="Ex: écran cassé, ne s'allume plus, batterie se décharge vite..."
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Photo (lien URL, optionnel)
            </label>
            <input
              value={form.photoUrl}
              onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Votre nom *</label>
            <input
              required
              value={form.clientNom}
              onChange={(e) => setForm({ ...form, clientNom: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Téléphone *</label>
            <input
              required
              value={form.clientTelephone}
              onChange={(e) => setForm({ ...form, clientTelephone: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">
              Email (pour suivre votre devis, optionnel)
            </label>
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange text-navy font-bold py-3.5 rounded-lg disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Envoyer ma demande"}
          </button>
        </form>

        <p className="text-center text-sm text-inkSoft mt-6">
          <Link href={`/boutique/${boutiqueId}`} className="text-blue font-semibold">
            ← Retour au profil de la boutique
          </Link>
        </p>
      </div>
    </main>
  );
}
