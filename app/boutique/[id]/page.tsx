import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ReviewSection from "./ReviewSection";

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
    include: { services: true, products: true, reviews: true },
  });

  if (!boutique) notFound();

  const avgNote =
    boutique.reviews.length > 0
      ? boutique.reviews.reduce((s, r) => s + r.note, 0) / boutique.reviews.length
      : null;

  const mapsUrl =
    boutique.latitude && boutique.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${boutique.latitude},${boutique.longitude}`
      : null;

  const whatsappUrl = boutique.whatsapp
    ? `https://wa.me/${boutique.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/recherche" className="text-sm font-semibold text-blue">
            ← Retour à la recherche
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-line rounded-card p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h1 className="font-display text-2xl text-navy mb-1">{boutique.nom}</h1>
              <p className="text-inkSoft text-sm">
                📍 {boutique.adresse || boutique.ville || "Tunisie"}
              </p>
              {avgNote !== null && (
                <p className="text-sm mt-1">
                  <span className="text-orange">{"★".repeat(Math.round(avgNote))}</span>
                  <span className="text-line">{"★".repeat(5 - Math.round(avgNote))}</span>{" "}
                  <span className="text-inkSoft">
                    {avgNote.toFixed(1)} / 5 ({boutique.reviews.length} avis)
                  </span>
                </p>
              )}
            </div>
            {boutique.plan !== "free" && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange text-navy">
                ⭐ {boutique.plan === "premium" ? "Premium" : "Pro"}
              </span>
            )}
          </div>

          {boutique.description && (
            <p className="text-sm text-inkSoft mb-6">{boutique.description}</p>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href={`/boutique/${boutique.id}/demande`}
              className="bg-orange text-navy text-sm font-bold px-5 py-2.5 rounded-lg"
            >
              🔧 Demander une réparation
            </Link>
            {boutique.telephone && (
              <a
                href={`tel:${boutique.telephone}`}
                className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                📞 Appeler
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                className="bg-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                💬 WhatsApp
              </a>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                className="border border-line text-navy text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                📍 Itinéraire
              </a>
            )}
          </div>

          {boutique.horaires && (
            <p className="text-sm text-inkSoft mb-1">🕐 {boutique.horaires}</p>
          )}
          <div className="flex gap-4 text-sm">
            {boutique.facebook && (
              <a href={boutique.facebook} target="_blank" className="text-blue">
                Facebook
              </a>
            )}
            {boutique.instagram && (
              <a href={boutique.instagram} target="_blank" className="text-blue">
                Instagram
              </a>
            )}
          </div>
        </div>

        {boutique.services.length > 0 && (
          <div className="bg-white border border-line rounded-card p-8 mb-6">
            <h2 className="font-display text-base text-navy mb-4">Services proposés</h2>
            <div className="flex flex-wrap gap-2">
              {boutique.services.map((s) => (
                <span
                  key={s.id}
                  className="text-sm bg-paper border border-line px-3 py-1.5 rounded-full text-navy"
                >
                  🔧 {s.nom}
                </span>
              ))}
            </div>
          </div>
        )}

        {boutique.products.length > 0 && (
          <div className="bg-white border border-line rounded-card p-8 mb-6">
            <h2 className="font-display text-base text-navy mb-4">Produits disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {boutique.products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-line rounded-lg px-4 py-3 text-sm"
                >
                  <div>
                    <div className="font-semibold text-navy">{p.nom}</div>
                    <div className="text-xs text-inkSoft">{p.categorie}</div>
                  </div>
                  <span className="font-mono text-navy">{p.prix.toFixed(0)} DT</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReviewSection
          boutiqueId={boutique.id}
          initialReviews={boutique.reviews.map((r) => ({
            id: r.id,
            nom: r.nom,
            note: r.note,
            commentaire: r.commentaire,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </section>
    </main>
  );
}
