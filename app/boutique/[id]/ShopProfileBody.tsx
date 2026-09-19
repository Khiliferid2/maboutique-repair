"use client";

import Link from "next/link";
import ReviewSection from "./ReviewSection";
import QrCodeButton from "@/components/QrCodeButton";
import { useLanguage } from "@/lib/language-context";

type Boutique = {
  id: string;
  nom: string;
  description: string | null;
  adresse: string | null;
  delegation: string | null;
  gouvernorat: string | null;
  ville: string | null;
  verified: boolean;
  plan: string;
  telephone: string | null;
  horaires: string | null;
  facebook: string | null;
  instagram: string | null;
  services: { id: string; nom: string }[];
  photos: { id: string; url: string }[];
  videos: { id: string; url: string; titre: string | null; description: string | null }[];
  products: { id: string; nom: string; categorie: string | null; photoUrl: string | null; prix: number }[];
  reviews: { id: string; nom: string; note: number; commentaire: string | null; createdAt: string }[];
};

export default function ShopProfileBody({
  boutique,
  avgNote,
  mapsUrl,
  whatsappUrl,
  siteUrl,
}: {
  boutique: Boutique;
  avgNote: number | null;
  mapsUrl: string | null;
  whatsappUrl: string | null;
  siteUrl: string;
}) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/recherche" className="text-sm font-semibold text-blue">
            ← {t("search.title")}
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-line rounded-card p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="font-display text-2xl text-navy">{boutique.nom}</h1>
                {boutique.verified && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green text-white">
                    ✅ {t("shop.verified")}
                  </span>
                )}
              </div>
              <p className="text-inkSoft text-sm">
                📍 {boutique.adresse ||
                  (boutique.delegation ? `${boutique.delegation}, ${boutique.gouvernorat}` : boutique.gouvernorat) ||
                  boutique.ville ||
                  "Tunisie"}
              </p>
              {avgNote !== null && (
                <p className="text-sm mt-1">
                  <span className="text-orange">{"★".repeat(Math.round(avgNote))}</span>
                  <span className="text-line">{"★".repeat(5 - Math.round(avgNote))}</span>{" "}
                  <span className="text-inkSoft">
                    {avgNote.toFixed(1)} / 5 ({boutique.reviews.length} {t("shop.reviews").toLowerCase()})
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
              🔧 {t("shop.services")}
            </Link>
            {boutique.telephone && (
              <a
                href={`tel:${boutique.telephone}`}
                className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                📞 {t("shop.call")}
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                className="bg-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                💬 {t("shop.whatsapp")}
              </a>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                className="border border-line text-navy text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                📍 {t("shop.directions")}
              </a>
            )}
            <QrCodeButton
              url={`${siteUrl}/boutique/${boutique.id}`}
              label={t("shop.share")}
            />
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
            <h2 className="font-display text-base text-navy mb-4">{t("shop.services")}</h2>
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

        {boutique.photos.length > 0 && (
          <div className="bg-white border border-line rounded-card p-8 mb-6">
            <h2 className="font-display text-base text-navy mb-4">📸 {t("shop.photos")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {boutique.photos.map((photo) => (
                <img key={photo.id} src={photo.url} alt={`Photo de ${boutique.nom}`} className="w-full aspect-square object-cover rounded-lg border border-line" loading="lazy" />
              ))}
            </div>
          </div>
        )}

        {boutique.videos.length > 0 && (
          <div className="bg-white border border-line rounded-card p-8 mb-6">
            <h2 className="font-display text-base text-navy mb-4">🎥 {t("shop.videos")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {boutique.videos.map((video) => (
                <div key={video.id} className="border border-line rounded-lg overflow-hidden">
                  <video src={video.url} controls preload="metadata" className="w-full aspect-video bg-black" />
                  <div className="p-3">
                    <p className="font-semibold text-navy text-sm">{video.titre || t("shop.videos")}</p>
                    {video.description && <p className="text-xs text-inkSoft mt-1">{video.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {boutique.products.length > 0 && (
          <div className="bg-white border border-line rounded-card p-8 mb-6">
            <h2 className="font-display text-base text-navy mb-4">{t("shop.products")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {boutique.products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-line rounded-lg px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    {p.photoUrl ? (
                      <img src={p.photoUrl} alt={p.nom} className="w-14 h-14 rounded-lg object-cover border border-line" loading="lazy" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-paper border border-line flex items-center justify-center">📦</div>
                    )}
                    <div>
                      <div className="font-semibold text-navy">{p.nom}</div>
                      <div className="text-xs text-inkSoft">{p.categorie}</div>
                    </div>
                  </div>
                  <span className="font-mono text-navy">{p.prix.toFixed(0)} DT</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReviewSection boutiqueId={boutique.id} initialReviews={boutique.reviews} />
      </section>
    </main>
  );
}
