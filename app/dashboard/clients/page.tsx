"use client";

import { useEffect, useState } from "react";
import { exportToCsv } from "@/lib/csv-export";

type Client = {
  id: string;
  nom: string;
  telephone: string;
  email: string | null;
  devices: { id: string }[];
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", telephone: "", email: "" });
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/clients");
    setClients(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setForm({ nom: "", telephone: "", email: "" });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl text-navy">Clients</h1>
        <div className="flex gap-2">
          <button
            onClick={() =>
              exportToCsv(
                "clients.csv",
                clients.map((c) => ({
                  Nom: c.nom,
                  Téléphone: c.telephone,
                  Email: c.email || "",
                  Appareils: c.devices.length,
                }))
              )
            }
            disabled={clients.length === 0}
            className="border border-line text-navy text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            ⬇ Exporter CSV
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            + Nouveau client
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-line rounded-card p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {error && (
            <div className="md:col-span-3 text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
              {error}
            </div>
          )}
          <input
            required
            placeholder="Nom du client *"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            required
            placeholder="Téléphone *"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            placeholder="Email (optionnel)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-navy text-white font-semibold py-2.5 rounded-lg"
          >
            Enregistrer le client
          </button>
        </form>
      )}

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-inkSoft">Chargement...</p>
        ) : clients.length === 0 ? (
          <p className="p-6 text-sm text-inkSoft">
            Aucun client pour le moment. Ajoutez le premier client de votre atelier.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-inkSoft uppercase border-b border-line bg-paper">
                <th className="py-3 px-5">Nom</th>
                <th className="py-3 px-5">Téléphone</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Appareils</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="py-3 px-5 font-semibold text-navy">{c.nom}</td>
                  <td className="py-3 px-5 font-mono">{c.telephone}</td>
                  <td className="py-3 px-5 text-inkSoft">{c.email || "—"}</td>
                  <td className="py-3 px-5">{c.devices.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
