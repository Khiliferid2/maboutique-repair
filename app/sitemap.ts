import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const VILLES = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana",
  "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul",
  "Tataouine", "Béja", "Jendouba", "Mahdia", "Sidi Bouzid", "Tozeur",
  "Siliana", "Zaghouan", "Le Kef", "Kébili", "Manouba", "Ezzahra", "La Marsa",
];
function slugify(v: string) {
  return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "https://maboutique-repair.vercel.app";

  const boutiques = await prisma.boutique.findMany({
    where: { publie: true },
    select: { id: true, createdAt: true },
  });

  const boutiquePages: MetadataRoute.Sitemap = boutiques.map((b) => ({
    url: `${base}/boutique/${b.id}`,
    lastModified: b.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const villePages: MetadataRoute.Sitemap = VILLES.map((v) => ({
    url: `${base}/recherche/${slugify(v)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/recherche`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/catalogue`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/comment-ca-marche`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/devenir-partenaire`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/register`, changeFrequency: "monthly", priority: 0.5 },
    ...villePages,
    ...boutiquePages,
  ];
}
