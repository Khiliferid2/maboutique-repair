"use client";

import { useEffect, useState } from "react";
import { SERVICES_CATALOGUE, PRODUCT_CATEGORIES } from "@/lib/services-catalog";
import { GOUVERNORATS, TUNISIA_LOCATIONS } from "@/lib/tunisia-locations";

type Service = { id: string; nom: string };
type Product = {
  id: string;
  nom: string;
  prix: number;
  categorie: string | null;
  stock: number;
  photoUrl: string | null;
};
type Photo = { id: string; url: string };
type Video = { id: string; url: string; titre: string | null; description: string | null };
type Boutique = {
  id: string;
  nom: string;
  description: string | null;
  ville: string | null;
  gouvernorat: string | null;
  delegation: string | null;
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
  photos: Photo[];
  videos: Video[];
};

export default function ProfilPage() {
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState({ nom: "", prix: "", categorie: PRODUCT_CATEGORIES[0], stock: "10", photoUrl: "" });
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoForm, setVideoForm] = useState({ url: "", titre: "", description: "" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/boutique");
    const data = await res.json();
    setBoutique(data);
    setForm({
      nom: data.nom || "",
      description: data.description || "",
      ville: data.ville || "",
      gouvernorat: data.gouvernorat || "",
      delegation: data.delegation || "",
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
    setNewProduct({ nom: "", prix: "", categorie: PRODUCT_CATEGORIES[0], stock: "10", photoUrl: "" });
    load();
  }

  async function removeProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  async function uploadMedia(file: File, resourceType: "image" | "video") {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setMessage("Configurez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET sur Vercel pour activer l’upload direct.");
      return null;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok || !json.secure_url) throw new Error("Upload impossible");
      return json.secure_url as string;
    } catch {
      setMessage("Échec de l’upload. Vérifiez la configuration Cloudinary.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function addPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!mediaUrl.trim()) return;
    await fetch("/api/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: mediaUrl }) });
    setMediaUrl("");
    load();
  }

  async function handlePhotoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadMedia(file, "image");
    if (url) {
      await fetch("/api/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      load();
    }
    e.target.value = "";
  }

  async function removePhoto(id: string) {
    await fetch(`/api/photos?id=${id}`, { method: "DELETE" });
    load();
  }

  async function addVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!videoForm.url.trim()) return;
    await fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(videoForm) });
    setVideoForm({ url: "", titre: "", description: "" });
    load();
  }

  async function handleVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setMessage("La vidéo doit faire moins de 50 Mo.");
      return;
    }
    const url = await uploadMedia(file, "video");
    if (url) {
      await fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, titre: file.name.replace(/\.[^.]+$/, "") }) });
      load();
    }
    e.target.value = "";
  }

  async function removeVideo(id: string) {
    await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
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
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Gouvernorat</label>
            <select
              value={form.gouvernorat || ""}
              onChange={(e) =>
                setForm({ ...form, gouvernorat: e.target.value, delegation: "" })
              }
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            >
              <option value="">— Sélectionner —</option>
              {GOUVERNORATS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Délégation</label>
            <select
              value={form.delegation || ""}
              onChange={(e) => setForm({ ...form, delegation: e.target.value })}
              disabled={!form.gouvernorat}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper disabled:opacity-50"
            >
              <option value="">— Sélectionner —</option>
              {(TUNISIA_LOCATIONS[form.gouvernorat] || []).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
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
          <input
            placeholder="URL photo du produit (optionnel)"
            value={newProduct.photoUrl}
            onChange={(e) => setNewProduct({ ...newProduct, photoUrl: e.target.value })}
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

      {/* --- Photos --- */}
      <div className="bg-white border border-line rounded-card p-6">
        <h2 className="font-display text-base text-navy mb-1">📸 Photos de la boutique</h2>
        <p className="text-sm text-inkSoft mb-4">Ajoutez directement vos photos. L’upload utilise Cloudinary quand il est configuré, avec une URL publique comme solution de secours.</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <label className="border border-blue text-blue font-semibold px-5 py-2.5 rounded-lg cursor-pointer text-center">
            {uploading ? "Upload..." : "📤 Choisir une photo"}
            <input type="file" accept="image/*" onChange={handlePhotoFile} className="hidden" disabled={uploading} />
          </label>
          <form onSubmit={addPhoto} className="flex flex-1 gap-3">
            <input required value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Ou URL : https://.../photo.jpg" className="flex-1 border border-line rounded-lg px-4 py-2.5 text-sm bg-paper" />
            <button className="bg-blue text-white font-semibold px-5 py-2.5 rounded-lg">+ URL</button>
          </form>
        </div>
        {boutique.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {boutique.photos.map((photo) => (
              <div key={photo.id} className="relative group border border-line rounded-lg overflow-hidden bg-paper">
                <img src={photo.url} alt="Photo boutique" className="w-full h-32 object-cover" />
                <button onClick={() => removePhoto(photo.id)} className="absolute top-2 right-2 bg-white/90 text-red text-xs font-semibold px-2 py-1 rounded">Supprimer</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Vidéos --- */}
      <div className="bg-white border border-line rounded-card p-6">
        <h2 className="font-display text-base text-navy mb-1">🎥 Vidéos courtes de vos services</h2>
        <p className="text-sm text-inkSoft mb-4">Montrez votre savoir-faire : réparation écran, microsoudure, diagnostic, etc. Vous pouvez importer une vidéo courte ou fournir son URL.</p>
        <form onSubmit={addVideo} className="space-y-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="border border-navy text-navy font-semibold px-5 py-2.5 rounded-lg cursor-pointer text-center">
              {uploading ? "Upload..." : "🎥 Choisir une vidéo"}
              <input type="file" accept="video/*" onChange={handleVideoFile} className="hidden" disabled={uploading} />
            </label>
            <input required value={videoForm.url} onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })} placeholder="Ou URL : https://.../video.mp4" className="flex-1 border border-line rounded-lg px-4 py-2.5 text-sm bg-paper" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={videoForm.titre} onChange={(e) => setVideoForm({ ...videoForm, titre: e.target.value })} placeholder="Titre de la vidéo" className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper" />
            <input value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="Description courte" className="border border-line rounded-lg px-4 py-2.5 text-sm bg-paper" />
          </div>
          <button className="bg-navy text-white font-semibold px-5 py-2.5 rounded-lg">+ Ajouter la vidéo URL</button>
        </form>
        {boutique.videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boutique.videos.map((video) => (
              <div key={video.id} className="border border-line rounded-lg overflow-hidden">
                <video src={video.url} controls preload="metadata" className="w-full aspect-video bg-black" />
                <div className="p-3 flex items-start justify-between gap-3">
                  <div><p className="font-semibold text-navy text-sm">{video.titre || "Vidéo de service"}</p><p className="text-xs text-inkSoft">{video.description}</p></div>
                  <button onClick={() => removeVideo(video.id)} className="text-red text-xs font-semibold shrink-0">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
