"use client";

import { useEffect, useState } from "react";

type Client = { id: string; nom: string };
type Device = {
  id: string;
  marque: string;
  modele: string;
  imei: string | null;
  client: Client;
};

export default function AppareilsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    marque: "",
    modele: "",
    imei: "",
  });
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const [devRes, cliRes] = await Promise.all([
      fetch("/api/devices"),
      fetch("/api/clients"),
    ]);
    setDevices(await devRes.json());
    setClients(await cliRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setForm({ clientId: "", marque: "", modele: "", imei: "" });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl text-navy">Appareils</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          disabled={clients.length === 0}
          className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          + Nouvel appareil
        </button>
      </div>

      {clients.length === 0 && !loading && (
        <p className="text-sm text-inkSoft mb-4">
          Ajoutez d'abord un client dans l'onglet Clients avant d'enregistrer un appareil.
        </p>
      )}

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
          <select
            required
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          >
            <option value="">Client *</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Marque * (ex: iPhone)"
            value={form.marque}
            onChange={(e) => setForm({ ...form, marque: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            required
            placeholder="Modèle * (ex: 11)"
            value={form.modele}
            onChange={(e) => setForm({ ...form, modele: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            placeholder="IMEI (optionnel)"
            value={form.imei}
            onChange={(e) => setForm({ ...form, imei: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper font-mono"
          />
          <button
            type="submit"
            className="md:col-span-4 bg-navy text-white font-semibold py-2.5 rounded-lg"
          >
            Enregistrer l'appareil
          </button>
        </form>
      )}

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-inkSoft">Chargement...</p>
        ) : devices.length === 0 ? (
          <p className="p-6 text-sm text-inkSoft">Aucun appareil enregistré.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-inkSoft uppercase border-b border-line bg-paper">
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Appareil</th>
                <th className="py-3 px-5">IMEI</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-b border-line last:border-0">
                  <td className="py-3 px-5 font-semibold text-navy">{d.client.nom}</td>
                  <td className="py-3 px-5">
                    {d.marque} {d.modele}
                  </td>
                  <td className="py-3 px-5 font-mono text-inkSoft">
                    {d.imei || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
