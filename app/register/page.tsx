"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    boutiqueNom: "",
    ville: "",
    telephone: "",
    adminNom: "",
    email: "",
    password: "",
  });

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 font-display font-bold text-navy mb-8 justify-center">
          <Logo size={36} />
          MaBoutique Repair
        </div>

        <div className="bg-white border border-line rounded-card p-8 shadow-sm">
          <h1 className="font-display text-xl text-navy mb-1">
            Créez votre boutique
          </h1>
          <p className="text-sm text-inkSoft mb-6">
            2 minutes suffisent, aucune carte bancaire requise.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Nom de la boutique *
              </label>
              <input
                required
                value={form.boutiqueNom}
                onChange={(e) => update("boutiqueNom", e.target.value)}
                placeholder="Ex: Atelier Sami Repair"
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Ville
                </label>
                <input
                  value={form.ville}
                  onChange={(e) => update("ville", e.target.value)}
                  placeholder="Tunis"
                  className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Téléphone
                </label>
                <input
                  value={form.telephone}
                  onChange={(e) => update("telephone", e.target.value)}
                  placeholder="+216 ..."
                  className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Votre nom *
              </label>
              <input
                required
                value={form.adminNom}
                onChange={(e) => update("adminNom", e.target.value)}
                placeholder="Ex: Farid Khili"
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Email *
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Mot de passe *
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="8 caractères minimum"
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange text-navy font-bold py-3 rounded-lg disabled:opacity-60"
            >
              {loading ? "Création en cours..." : "Créer ma boutique"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-inkSoft mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-blue font-semibold">
            Connectez-vous
          </Link>
        </p>
      </div>
    </main>
  );
}
