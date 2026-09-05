"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, boutiqueId, totalMontant, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    clientNom: "",
    clientTelephone: "",
    clientAdresse: "",
    clientVille: "",
    modePaiement: "livraison",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || !boutiqueId) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        boutiqueId,
        items: items.map((i) => ({ productId: i.productId, quantite: i.quantite })),
        ...form,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    clearCart();
    if (data.payUrl) {
      window.location.href = data.payUrl; // redirection vers Konnect
    } else {
      router.push(`/commande/${data.orderId}`);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-inkSoft mb-4">Votre panier est vide.</p>
          <Link href="/catalogue" className="text-blue font-semibold text-sm">
            Voir les produits
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 font-display font-bold text-navy mb-8 justify-center">
          <Logo size={36} />
          Finaliser la commande
        </div>

        <div className="bg-white border border-line rounded-card p-6 mb-6">
          <h2 className="font-display text-sm text-navy mb-3">Récapitulatif</h2>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm py-1">
              <span>{i.nom} × {i.quantite}</span>
              <span className="font-mono">{(i.prix * i.quantite).toFixed(0)} DT</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 mt-2 border-t border-line text-sm">
            <span>Total</span>
            <span className="font-mono">{totalMontant.toFixed(0)} DT</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-card p-6 space-y-4">
          {error && (
            <p className="text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Nom complet *</label>
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
            <label className="block text-xs font-semibold text-navy mb-1">Adresse de livraison *</label>
            <input
              required
              value={form.clientAdresse}
              onChange={(e) => setForm({ ...form, clientAdresse: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Ville</label>
            <input
              value={form.clientVille}
              onChange={(e) => setForm({ ...form, clientVille: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 text-sm bg-paper"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-2">Mode de paiement</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, modePaiement: "livraison" })}
                className={`text-sm font-semibold py-2.5 rounded-lg border ${
                  form.modePaiement === "livraison"
                    ? "bg-navy text-white border-navy"
                    : "border-line text-navy"
                }`}
              >
                💵 À la livraison
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, modePaiement: "carte" })}
                className={`text-sm font-semibold py-2.5 rounded-lg border ${
                  form.modePaiement === "carte"
                    ? "bg-navy text-white border-navy"
                    : "border-line text-navy"
                }`}
              >
                💳 Carte bancaire
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange text-navy font-bold py-3.5 rounded-lg disabled:opacity-60"
          >
            {loading ? "Traitement..." : `Confirmer — ${totalMontant.toFixed(0)} DT`}
          </button>
        </form>
      </div>
    </main>
  );
}
