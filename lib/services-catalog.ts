// Catalogue des services proposés par les ateliers de réparation.
// Utilisé pour le formulaire "Profil de ma boutique" et pour le filtre de recherche.
export const SERVICES_CATALOGUE = [
  "Réparation Smartphones",
  "Réparation iPhone",
  "Réparation Samsung",
  "Software",
  "Hardware",
  "Micro-soudure",
  "Réparation carte mère",
  "Changement écran",
  "Batterie",
  "Connecteur de charge",
  "Déblocage / diagnostic",
  "PC & Laptop",
  "Tablettes",
  "Consoles",
  "Autres",
];

// Catégories de produits vendus en boutique.
export const PRODUCT_CATEGORIES = [
  "Chargeurs",
  "Câbles",
  "Écrans",
  "Batteries",
  "Coques",
  "Protections",
  "Accessoires",
  "Pièces détachées",
];

// Nombre minimum de services pour qu'un profil free reste visible,
// et règles de mise en avant selon le plan.
export const PLAN_RANK: Record<string, number> = {
  premium: 3,
  pro: 2,
  free: 1,
};
