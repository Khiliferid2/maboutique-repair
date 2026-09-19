"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { SkeletonProductCard } from "@/components/Skeleton";
import { useCart } from "@/lib/cart-context";
import { PRODUCT_CATEGORIES } from "@/lib/services-catalog";
import { useLanguage } from "@/lib/language-context";

type Product = {
  id: string;
  nom: string;
  prix: number;
  categorie: string | null;
  photoUrl: string | null;
  stock: number;
  boutique: { id: string; nom: string; ville: string | null; plan: string };
};

type BoutiqueOption = { id: string; nom: string; ville: string | null };

export default function CataloguePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [boutiques, setBoutiques] = useState<BoutiqueOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [categorie, setCategorie] = useState("");
  const [boutiqueId, setBoutiqueId] = useState("");
  const [notice, setNotice] = useState("");
  const { addItem, totalItems } = useCart();

  async function load(overrideBoutiqueId?: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categorie) params.set("categorie", categorie);
    const bId = overrideBoutiqueId !== undefined ? overrideBoutiqueId : boutiqueId;
    if (bId) params.set("boutiqueId", bId);
    const res = await fetch(`/api/catalogue?${params.toString()}`);
    setProducts(await res.json());
    setLoading(false);
  }

  function filterByBoutique(id: string) {
    setBoutiqueId(id);
    load(id);
  }

  async function loadBoutiques() {
    const res = await fetch("/api/catalogue/boutiques");
    setBoutiques(await res.json());
  }

  useEffect(() => {
    load();
    loadBoutiques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAdd(p: Product) {
    const result = addItem({
      productId: p.id,
      nom: p.nom,
      prix: p.prix,
      photoUrl: p.photoUrl,
      boutiqueId: p.boutique.id,
      boutiqueNom: p.boutique.nom,
    });
    if (result === "different-boutique") {
      setNotice(
        "Votre panier contient déjà des articles d'une autre boutique. Videz-le d'abord depuis /panier pour commander ici."
      );
    } else {
      setNotice(`${p.nom} ajouté au panier ✓`);
    }
    setTimeout(() => setNotice(""), 3000);
  }

  const hasFilters = q || categorie || boutiqueId;

  function resetFilters() {
    setQ("");
    setCategorie("");
    setBoutiqueId("");
    setTimeout(load, 0);
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link
            href="/panier"
            className="relative bg-navy text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            🛒 {t("catalogue.cart")}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange text-navy text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl text-navy mb-2">
          {t("catalogue.title")}
        </h1>
        <p className="text-inkSoft mb-6">{t("catalogue.subtitle")}</p>

        {notice && (
          <div className="mb-4 text-sm bg-blue/10 border border-blue/30 text-blue rounded-lg px-4 py-2">
            {notice}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder={t("catalogue.searchPlaceholder")}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-1 min-w-[200px]"
          />
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white"
          >
            <option value="">{t("catalogue.allCategories")}</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={boutiqueId}
            onChange={(e) => setBoutiqueId(e.target.value)}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white"
          >
            <option value="">{t("catalogue.allShops")}</option>
            {boutiques.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nom}{b.ville ? ` — ${b.ville}` : ""}
              </option>
            ))}
          </select>
          <button
            onClick={() => load()}
            className="bg-blue text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            🔍 {t("catalogue.filter")}
          </button>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-inkSoft px-3 py-2.5"
            >
              ✕ {t("catalogue.reset")}
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
            <SkeletonProductCard />
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-inkSoft">{t("catalogue.noResults")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, idx) => (
              <div
                key={p.id}
                style={{ animationDelay: `${idx * 30}ms` }}
                className="animate-in bg-white border border-line rounded-card p-4 hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="aspect-square bg-paper rounded-lg mb-3 overflow-hidden flex items-center justify-center text-3xl">
                  {p.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.photoUrl}
                      alt={p.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "📦"
                  )}
                </div>
                <h3 className="font-semibold text-navy text-sm mb-1">{p.nom}</h3>
                <button
                  onClick={() => filterByBoutique(p.boutique.id)}
                  className="text-xs text-inkSoft mb-2 hover:text-blue hover:underline block text-left"
                >
                  {p.boutique.nom} · {p.boutique.ville || "Tunisie"}
                </button>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-navy">{p.prix.toFixed(0)} DT</span>
                  <button
                    onClick={() => handleAdd(p)}
                    className="bg-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    + {t("catalogue.add")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
