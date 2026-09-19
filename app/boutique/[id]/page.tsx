import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ShopProfileBody from "./ShopProfileBody";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://maboutique-repair.vercel.app");

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const boutique = await prisma.boutique.findFirst({
    where: { id: params.id, publie: true },
  });
  if (!boutique) return { title: "Boutique introuvable — MaBoutique Repair" };
  return {
    title: `${boutique.nom} — Réparation à ${boutique.ville || "Tunisie"} | MaBoutique Repair`,
    description:
      boutique.description ||
      `${boutique.nom} : atelier de réparation smartphones et électronique à ${boutique.ville || "Tunisie"}. Contact, services et produits disponibles.`,
  };
}

export default async function BoutiquePublicPage({
  params,
}: {
  params: { id: string };
}) {
  const boutique = await prisma.boutique.findFirst({
    where: { id: params.id, publie: true },
    include: { services: true, products: true, reviews: true, photos: true, videos: true },
  });

  if (!boutique) notFound();

  const avgNote =
    boutique.reviews.length > 0
      ? boutique.reviews.reduce((s: number, r: (typeof boutique.reviews)[number]) => s + r.note, 0) / boutique.reviews.length
      : null;

  const mapsUrl =
    boutique.latitude && boutique.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${boutique.latitude},${boutique.longitude}`
      : null;

  const whatsappUrl = boutique.whatsapp
    ? `https://wa.me/${boutique.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <ShopProfileBody
      boutique={{
        id: boutique.id,
        nom: boutique.nom,
        description: boutique.description,
        adresse: boutique.adresse,
        delegation: boutique.delegation,
        gouvernorat: boutique.gouvernorat,
        ville: boutique.ville,
        verified: boutique.verified,
        plan: boutique.plan,
        telephone: boutique.telephone,
        horaires: boutique.horaires,
        facebook: boutique.facebook,
        instagram: boutique.instagram,
        services: boutique.services.map((s: (typeof boutique.services)[number]) => ({ id: s.id, nom: s.nom })),
        photos: boutique.photos.map((p: (typeof boutique.photos)[number]) => ({ id: p.id, url: p.url })),
        videos: boutique.videos.map((v: (typeof boutique.videos)[number]) => ({
          id: v.id,
          url: v.url,
          titre: v.titre,
          description: v.description,
        })),
        products: boutique.products.map((p: (typeof boutique.products)[number]) => ({
          id: p.id,
          nom: p.nom,
          categorie: p.categorie,
          photoUrl: p.photoUrl,
          prix: p.prix,
        })),
        reviews: boutique.reviews.map((r: (typeof boutique.reviews)[number]) => ({
          id: r.id,
          nom: r.nom,
          note: r.note,
          commentaire: r.commentaire,
          createdAt: r.createdAt.toISOString(),
        })),
      }}
      avgNote={avgNote}
      mapsUrl={mapsUrl}
      whatsappUrl={whatsappUrl}
      siteUrl={SITE_URL}
    />
  );
}
