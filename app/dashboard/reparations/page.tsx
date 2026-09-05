"use client";

import { useEffect, useState } from "react";
import { exportToCsv } from "@/lib/csv-export";

type Device = {
  id: string;
  marque: string;
  modele: string;
  client: { nom: string; telephone: string };
};
type Repair = {
  id: string;
  probleme: string;
  statut: string;
  prix: number;
  garantieMois: number;
  technicien: string | null;
  device: Device;
};

const statusLabel: Record<string, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  termine: "Terminé",
};
const statusClass: Record<string, string> = {
  en_attente: "bg-red text-white",
  en_cours: "bg-orange text-white",
  termine: "bg-green text-white",
};

export default function ReparationsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    deviceId: "",
    probleme: "",
    prix: "",
    coutPieces: "",
    garantieMois: "3",
    technicien: "",
  });
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const [repRes, devRes] = await Promise.all([
      fetch("/api/repairs"),
      fetch("/api/devices"),
    ]);
    setRepairs(await repRes.json());
    setDevices(await devRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/repairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setForm({
      deviceId: "",
      probleme: "",
      prix: "",
      coutPieces: "",
      garantieMois: "3",
      technicien: "",
    });
    setShowForm(false);
    load();
  }

  async function updateStatus(id: string, statut: string) {
    await fetch(`/api/repairs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl text-navy">Réparations</h1>
        <div className="flex gap-2">
          <button
            onClick={() =>
              exportToCsv(
                "reparations.csv",
                repairs.map((r) => ({
                  Client: r.device.client.nom,
                  Appareil: `${r.device.marque} ${r.device.modele}`,
                  Problème: r.probleme,
                  Statut: statusLabel[r.statut],
                  Prix: r.prix,
                  Garantie_mois: r.garantieMois,
                }))
              )
            }
            disabled={repairs.length === 0}
            className="border border-line text-navy text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            ⬇ Exporter CSV
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            disabled={devices.length === 0}
            className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            + Nouvelle réparation
          </button>
        </div>
      </div>

      {devices.length === 0 && !loading && (
        <p className="text-sm text-inkSoft mb-4">
          Ajoutez d'abord un appareil avant de créer une réparation.
        </p>
      )}

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
          <select
            required
            value={form.deviceId}
            onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper md:col-span-3"
          >
            <option value="">Appareil *</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.client.nom} — {d.marque} {d.modele}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Problème * (ex: Écran cassé)"
            value={form.probleme}
            onChange={(e) => setForm({ ...form, probleme: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper md:col-span-3"
          />
          <input
            type="number"
            placeholder="Prix (DT)"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            type="number"
            placeholder="Coût pièces (DT)"
            value={form.coutPieces}
            onChange={(e) => setForm({ ...form, coutPieces: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            type="number"
            placeholder="Garantie (mois)"
            value={form.garantieMois}
            onChange={(e) => setForm({ ...form, garantieMois: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <input
            placeholder="Technicien (optionnel)"
            value={form.technicien}
            onChange={(e) => setForm({ ...form, technicien: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper md:col-span-3"
          />
          <button
            type="submit"
            className="md:col-span-3 bg-navy text-white font-semibold py-2.5 rounded-lg"
          >
            Créer la réparation
          </button>
        </form>
      )}

      <div className="bg-white border border-line rounded-card overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-inkSoft">Chargement...</p>
        ) : repairs.length === 0 ? (
          <p className="p-6 text-sm text-inkSoft">Aucune réparation enregistrée.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-inkSoft uppercase border-b border-line bg-paper">
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Appareil</th>
                <th className="py-3 px-5">Problème</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5">Prix</th>
                <th className="py-3 px-5">Garantie</th>
                <th className="py-3 px-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="py-3 px-5 font-semibold text-navy">
                    {r.device.client.nom}
                  </td>
                  <td className="py-3 px-5">
                    {r.device.marque} {r.device.modele}
                  </td>
                  <td className="py-3 px-5">{r.probleme}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass[r.statut]}`}
                    >
                      {statusLabel[r.statut]}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono">{r.prix.toFixed(0)} DT</td>
                  <td className="py-3 px-5">{r.garantieMois} mois</td>
                  <td className="py-3 px-5">
                    {r.statut !== "termine" ? (
                      <select
                        value={r.statut}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className="border border-line rounded-lg px-2 py-1 text-xs bg-paper"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                      </select>
                    ) : (
                      <a
                        href={`https://wa.me/${r.device.client.telephone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Bonjour ${r.device.client.nom}, votre ${r.device.marque} ${r.device.modele} est prêt ! Vous pouvez venir le récupérer. Garantie : ${r.garantieMois} mois.`
                        )}`}
                        target="_blank"
                        className="text-xs font-semibold text-green"
                      >
                        💬 Prévenir sur WhatsApp
                      </a>
                    )}
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
