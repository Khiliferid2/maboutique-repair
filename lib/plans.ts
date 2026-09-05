export const PLAN_PRICES: Record<"pro" | "premium", number> = {
  pro: 29,
  premium: 59,
};

export const PLAN_FEATURES: Record<string, string[]> = {
  free: ["Profil visible", "Clients & appareils", "Réparations & stock limité", "Tableau de bord"],
  pro: [
    "Tout Free",
    "Clients & stock illimités",
    "Facturation & devis",
    "Statistiques (graphiques)",
    "Catalogue en ligne",
    "Meilleur classement dans la recherche",
  ],
  premium: [
    "Tout Pro",
    "Priorité maximale dans la recherche",
    "Badge Premium sur le profil",
    "Mise en avant sur la page d'accueil",
    "Support prioritaire",
  ],
};
