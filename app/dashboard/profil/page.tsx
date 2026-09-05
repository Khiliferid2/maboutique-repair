"use client";

import { useEffect, useState } from "react";
import { SERVICES_CATALOGUE, PRODUCT_CATEGORIES } from "@/lib/services-catalog";

type Service = { id: string; nom: string };
type Product = {
  id: string;
  nom: string;
  prix: number;
  categorie: string | null;
  stock: number;
};
type Boutique = {
  id: string;
  nom: string;
  description: string | null;
  ville: string | null;
  adresse: string | null;
  telephone: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  horaires: string | null;
  latitude: number | null;
  longitude: number | null;
  publie: boolean;
  plan: string;
  services: Service[];
  products: Product[];
};

export default function ProfilPage() {
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState({ nom: "", prix: "", categorie: PRODUCT_CATEGORIES[0], stock: "10" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/boutique");
    const data = await res.json();
    setBoutique(data);
    setForm({
      nom: data.nom || "",
      description: data.description || "",
      ville: data.ville || "",
      adresse: data.adresse || "",
      telephone: data.telephone || "",
      whatsapp: data.whatsapp || "",
      facebook: data.facebook || "",
      instagram: data.instagram || "",
      horaires: data.horaires || "",
      latitude: data.latitude != null ? String(data.latitude) : "",
      longitude: data.longitude != null ? String(data.longitude) : "",
    });
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/boutique", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setBoutique(data);
    setSaving(false);
    setMessage(
      data.publie
        ? "Profil enregistré — votre boutique est visible dans la recherche ✅"
        : "Profil enregistré — complétez ville, téléphone et position GPS pour apparaître dans la recherche."
    );
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        latitude: String(pos.coords.latitude),
        longitude: String(pos.coords.longitude),
      }));
    });
  }

  async function toggleService(nom: string) {
    if (!boutique) return;
    const existing = boutique.services.find((s) => s.nom === nom);
    if (existing) {
      await fetch(`/api/services/${existing.id}`, { method: "DELETE" });
    } else {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom }),
      });
    }
    load();
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newProduct.nom) return;
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ nom: "", prix: "", categorie: PRODUCT_CATEGORIES[0], stock: "10" });
    load();
  }

  async function removeProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  if (loading || !boutique) {
    return <p className="text-sm text-inkSoft">Chargement...</p>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-xl text-navy mb-1">
          Profil de ma boutique
        </h1>
        <p className="text-sm text-inkSoft">
          Ce profil est affiché aux clients qui cherchent un réparateur dans
          l'annuaire MaBoutique Repair.
        </p>
        <div
          className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
            boutique.publie
              ? "bg-green/10 text-green"
              : "bg-orange/10 text-orange"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              boutique.publie ? "bg-green" : "bg-orange"
            }`}
          ></span>
          {boutique.publie
            ? "Visible dans la recherche"
            : "Profil incomplet — non visible pour le moment"}
        </div>
      </div>

      {/* --- Infos générales --- */}
      <form
        onSubmit={saveProfile}
        className="bg-white border border-line rounded-card p-6 space-y-4"
      >
        <h2 className="font-display text-base text-navy">Informations générales</h2>
        {message && (
          <p className="text-sm text-blue bg-blue/10 border border-blue/30 rounded-lg px-4 py-2">
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Nom de la boutique</label>
            <input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Ville</label>
            <input
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
              placeholder="Ex: Ben Arous"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy mb-1">Description courte</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Ex: Spécialiste réparation iPhone et Samsung depuis 2018..."
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy mb-1">Adresse</label>
          <input
            value={form.adresse}
            onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Téléphone</label>
            <input
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">WhatsApp</label>
            <input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+216 ..."
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Horaires</label>
            <input
              value={form.horaires}
              onChange={(e) => setForm({ ...form, horaires: e.target.value })}
              placeholder="Lun-Sam 9h-18h"
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Facebook</label>
            <input
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Instagram</label>
            <input
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
        </div>

        {/* Localisation GPS */}
        <div>
          <label className="block text-xs font-semibold text-navy mb-1">
            Position GPS (pour apparaître dans "près de moi")
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              placeholder="Latitude"
              className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper font-mono"
            />
            <input
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              placeholder="Longitude"
              className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper font-mono"
            />
            <button
              type="button"
              onClick={useMyLocation}
              className="border border-line rounded-lg px-4 py-2.5 text-sm font-semibold text-navy bg-paper"
            >
              📍 Utiliser ma position actuelle
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue text-white font-semibold px-6 py-2.5 rounded-lg disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer le profil"}
        </button>
      </form>

      {/* --- Services --- */}
      <div className="bg-white border border-line rounded-card p-6">
        <h2 className="font-display text-base text-navy mb-1">Services proposés</h2>
        <p className="text-sm text-inkSoft mb-4">
          Sélectionnez tout ce que votre atelier propose — cela sert aussi de
          filtre pour les clients qui vous cherchent.
        </p>
        <div className="flex flex-wrap gap-2">
          {SERVICES_CATALOGUE.map((s) => {
            const active = boutique.services.some((x) => x.nom === s);
            return (
              <button
                key={s}
                onClick={() => toggleService(s)}
                className={`text-sm px-4 py-2 rounded-full border transition ${
                  active
                    ? "bg-blue text-white border-blue"
                    : "bg-paper text-inkSoft border-line hover:border-blue"
                }`}
              >
                {active ? "✓ " : ""}
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Produits --- */}
      <div className="bg-white border border-line rounded-card p-6">
        <h2 className="font-display text-base text-navy mb-1">Produits en vente</h2>
        <p className="text-sm text-inkSoft mb-4">
          Chargeurs, câbles, écrans, batteries, coques, accessoires...
        </p>

        <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          <input
            placeholder="Nom du produit"
            value={newProduct.nom}
            onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper md:col-span-2"
          />
          <input
            type="number"
            placeholder="Prix (DT)"
            value={newProduct.prix}
            onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          />
          <select
            value={newProduct.categorie}
            onChange={(e) => setNewProduct({ ...newProduct, categorie: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Stock (quantité en vente)"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-4 bg-navy text-white font-semibold py-2.5 rounded-lg"
          >
            + Ajouter le produit
          </button>
        </form>

        {boutique.products.length === 0 ? (
          <p className="text-sm text-inkSoft">Aucun produit ajouté.</p>
        ) : (
          <div className="space-y-2">
            {boutique.products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-line rounded-lg px-4 py-2.5 text-sm"
              >
                <div>
                  <span className="font-semibold text-navy">{p.nom}</span>
                  <span className="text-inkSoft"> · {p.categorie}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-inkSoft">Stock: {p.stock}</span>
                  <span className="font-mono">{p.prix.toFixed(0)} DT</span>
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="text-red text-xs font-semibold"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
