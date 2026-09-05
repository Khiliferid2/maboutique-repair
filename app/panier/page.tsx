"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useCart } from "@/lib/cart-context";

export default function PanierPage() {
  const { items, removeItem, updateQuantite, totalMontant } = useCart();

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/catalogue" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link href="/catalogue" className="text-sm font-semibold text-blue">
            ← Continuer mes achats
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl text-navy mb-6">Mon panier</h1>

        {items.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-8 text-center">
            <p className="text-inkSoft mb-4">Votre panier est vide.</p>
            <Link
              href="/catalogue"
              className="inline-block bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Voir les produits
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-inkSoft mb-4">
              Boutique : <b className="text-navy">{items[0].boutiqueNom}</b>
            </p>
            <div className="bg-white border border-line rounded-card divide-y divide-line mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 bg-paper rounded-lg flex items-center justify-center text-xl shrink-0">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-navy text-sm">{item.nom}</div>
                    <div className="text-xs text-inkSoft font-mono">{item.prix.toFixed(0)} DT / unité</div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantite}
                    onChange={(e) => updateQuantite(item.productId, parseInt(e.target.value) || 1)}
                    className="w-16 border border-line rounded-lg px-2 py-1.5 text-sm text-center"
                  />
                  <span className="font-mono font-semibold text-navy w-20 text-right">
                    {(item.prix * item.quantite).toFixed(0)} DT
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red text-xs font-semibold"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white border border-line rounded-card p-5 flex items-center justify-between mb-6">
              <span className="font-display text-navy">Total</span>
              <span className="font-mono font-bold text-xl text-navy">
                {totalMontant.toFixed(0)} DT
              </span>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-orange text-navy font-bold py-3.5 rounded-lg"
            >
              Passer la commande
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
