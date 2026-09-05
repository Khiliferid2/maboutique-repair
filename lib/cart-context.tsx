"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  nom: string;
  prix: number;
  photoUrl: string | null;
  boutiqueId: string;
  boutiqueNom: string;
  quantite: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantite">, quantite?: number) => "ok" | "different-boutique";
  removeItem: (productId: string) => void;
  updateQuantite: (productId: string, quantite: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalMontant: number;
  boutiqueId: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "mbr_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Charge le panier sauvegardé au premier rendu
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // panier vide par défaut si erreur de lecture
    }
    setLoaded(true);
  }, []);

  // Sauvegarde à chaque changement (après le chargement initial)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // stockage indisponible — le panier reste en mémoire pour la session
    }
  }, [items, loaded]);

  function addItem(item: Omit<CartItem, "quantite">, quantite = 1): "ok" | "different-boutique" {
    if (items.length > 0 && items[0].boutiqueId !== item.boutiqueId) {
      return "different-boutique";
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantite: i.quantite + quantite }
            : i
        );
      }
      return [...prev, { ...item, quantite }];
    });
    return "ok";
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantite(productId: string, quantite: number) {
    if (quantite <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantite } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantite, 0);
  const totalMontant = items.reduce((sum, i) => sum + i.prix * i.quantite, 0);
  const boutiqueId = items[0]?.boutiqueId || null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantite,
        clearCart,
        totalItems,
        totalMontant,
        boutiqueId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
