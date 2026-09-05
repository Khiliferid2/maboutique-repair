"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

type Boutique = {
  id: string;
  nom: string;
  ville: string | null;
  telephone: string | null;
  plan: string;
  publie: boolean;
  createdAt: string;
  users: { email: string; nom: string }[];
  _count: { repairs: number; clients: number; services: number };
};

const planColors: Record<string, string> = {
  free: "bg-line text-inkSoft",
  pro: "bg-blue text-white",
  premium: "bg-orange text-navy",
};

export default function AdminPage() {
  const [boutiques, setBoutiques] = useState<Boutique[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/boutiques");
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Accès refusé.");
      setLoading(false);
      return;
    }
    setBoutiques(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updatePlan(id: string, plan: string) {
    await fetch(`/api/admin/boutiques/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    load();
  }

  async function togglePublie(id: string, publie: boolean) {
    await fetch(`/api/admin/boutiques/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publie: !publie }),
    });
    load();
  }

  if (error) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="flex justify-center mb-6">
            <Logo size={48} />
          </div>
          <h1 className="font-display text-lg text-navy mb-2">Accès refusé</h1>
          <p className="text-sm text-inkSoft">
            Cette page est réservée au super-admin de la plateforme. Vérifiez
            que <code className="bg-white border border-line px-1 rounded">SUPER_ADMIN_EMAIL</code>{" "}
            correspond bien à votre email de connexion.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Logo size={32} />
          <div className="font-display font-bold text-navy">
            MaBoutique Repair <span className="text-inkSoft font-normal text-sm">— Super Admin</span>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-display text-xl text-navy mb-1">
          Toutes les boutiques de la plateforme
        </h1>
        <p className="text-sm text-inkSoft mb-6">
          {boutiques ? `${boutiques.length} boutique(s) inscrite(s).` : ""}
        </p>

        {boutiques && boutiques.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-line rounded-card p-5">
              <div className="font-display text-2xl font-bold text-navy">{boutiques.length}</div>
              <div className="text-xs text-inkSoft mt-1">Boutiques inscrites</div>
            </div>
            <div className="bg-white border border-line rounded-card p-5">
              <div className="font-display text-2xl font-bold text-navy">
                {boutiques.filter((b) => b.publie).length}
              </div>
              <div className="text-xs text-inkSoft mt-1">Visibles dans la recherche</div>
            </div>
            <div className="bg-white border border-line rounded-card p-5">
              <div className="font-display text-2xl font-bold text-navy">
                {boutiques.filter((b) => b.plan !== "free").length}
              </div>
              <div className="text-xs text-inkSoft mt-1">Abonnées Pro / Premium</div>
            </div>
            <div className="bg-white border border-line rounded-card p-5">
              <div className="font-display text-2xl font-bold text-navy">
                {boutiques.reduce((s, b) => s + b._count.repairs, 0)}
              </div>
              <div className="text-xs text-inkSoft mt-1">Réparations totales</div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-inkSoft">Chargement...</p>
        ) : (
          <div className="bg-white border border-line rounded-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-inkSoft uppercase border-b border-line bg-paper">
                  <th className="py-3 px-4">Boutique</th>
                  <th className="py-3 px-4">Contact admin</th>
                  <th className="py-3 px-4">Ville</th>
                  <th className="py-3 px-4">Clients</th>
                  <th className="py-3 px-4">Réparations</th>
                  <th className="py-3 px-4">Visible</th>
                  <th className="py-3 px-4">Plan</th>
                </tr>
              </thead>
              <tbody>
                {boutiques?.map((b) => (
                  <tr key={b.id} className="border-b border-line last:border-0">
                    <td className="py-3 px-4 font-semibold text-navy">{b.nom}</td>
                    <td className="py-3 px-4 text-inkSoft">
                      {b.users[0]?.email || "—"}
                    </td>
                    <td className="py-3 px-4">{b.ville || "—"}</td>
                    <td className="py-3 px-4 font-mono">{b._count.clients}</td>
                    <td className="py-3 px-4 font-mono">{b._count.repairs}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePublie(b.id, b.publie)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          b.publie ? "bg-green text-white" : "bg-red text-white"
                        }`}
                      >
                        {b.publie ? "Visible" : "Masquée"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.plan}
                        onChange={(e) => updatePlan(b.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border-0 ${planColors[b.plan]}`}
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Premium</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {boutiques?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 px-4 text-center text-inkSoft">
                      Aucune boutique inscrite pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
