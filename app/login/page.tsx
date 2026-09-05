"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 font-display font-bold text-navy mb-8 justify-center">
          <Logo size={36} />
          MaBoutique Repair
        </div>

        <div className="bg-white border border-line rounded-card p-8 shadow-sm">
          <h1 className="font-display text-xl text-navy mb-1">Connexion</h1>
          <p className="text-sm text-inkSoft mb-6">
            Accédez au tableau de bord de votre atelier.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Mot de passe
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue text-white font-bold py-3 rounded-lg disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-inkSoft mt-6">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-blue font-semibold">
            Créez votre boutique
          </Link>
        </p>
      </div>
    </main>
  );
}
