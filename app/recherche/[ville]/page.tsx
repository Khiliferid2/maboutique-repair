import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Logo from "@/components/Logo";

const VILLES = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana",
  "Gafsa", "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul",
  "Tataouine", "Béja", "Jendouba", "Mahdia", "Sidi Bouzid", "Tozeur",
  "Siliana", "Zaghouan", "Le Kef", "Kébili", "Manouba", "Ezzahra", "La Marsa",
];

function slugify(v: string) {
  return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

export async function generateStaticParams() {
  return VILLES.map((v) => ({ ville: slugify(v) }));
}

function findVilleFromSlug(slug: string): string | null {
  return VILLES.find((v) => slugify(v) === slug.toLowerCase()) || null;
}

export async function generateMetadata({
  params,
}: {
  params: { ville: string };
}): Promise<Metadata> {
  const ville = findVilleFromSlug(params.ville);
  if (!ville) return { title: "Réparateur — MaBoutique Repair" };
  return {
    title: `Réparateur smartphone & PC à ${ville} — MaBoutique Repair`,
    description: `Trouvez un réparateur de smartphones, PC, tablettes et consoles à ${ville}. Comparez les ateliers, avis clients, et contactez-les directement.`,
  };
}

export default async function VillePage({ params }: { params: { ville: string } }) {
  const ville = findVilleFromSlug(params.ville) || params.ville;

  const boutiques = await prisma.boutique.findMany({
    where: { publie: true, ville: { contains: ville } },
    include: { services: true, reviews: true },
  });

  const results = boutiques
    .map((b) => ({
      ...b,
      avgNote:
        b.reviews.length > 0
          ? b.reviews.reduce((s, r) => s + r.note, 0) / b.reviews.length
          : null,
    }))
    .sort((a, b) => (b.plan === "premium" ? 1 : 0) - (a.plan === "premium" ? 1 : 0));

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link href="/recherche" className="text-sm font-semibold text-blue">
            Recherche avancée →
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-display text-2xl text-navy mb-2">
          Réparateur smartphone & PC à {ville}
        </h1>
        <p className="text-inkSoft mb-8">
          {results.length > 0
            ? `${results.length} atelier(s) de réparation disponible(s) à ${ville}.`
            : `Aucun atelier inscrit à ${ville} pour le moment.`}
        </p>

        {results.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-8 text-center">
            <p className="text-sm text-inkSoft mb-4">
              Élargissez votre recherche à toute la Tunisie, ou revenez bientôt.
            </p>
            <Link href="/recherche" className="text-blue font-semibold text-sm">
              Voir tous les réparateurs →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => (
              <Link
                key={r.id}
                href={`/boutique/${r.id}`}
                className="block bg-white border border-line rounded-card p-5 hover:border-blue hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-base text-navy">{r.nom}</h2>
                  {r.plan !== "free" && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange text-navy">
                      ⭐ {r.plan === "premium" ? "Premium" : "Pro"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-inkSoft mb-2">
                  📍 {r.adresse || r.ville}
                  {r.avgNote != null && (
                    <> · <span className="text-orange">★</span> {r.avgNote.toFixed(1)}</>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {r.services.slice(0, 5).map((s) => (
                    <span key={s.id} className="text-[11px] bg-paper border border-line px-2 py-1 rounded-full text-inkSoft">
                      {s.nom}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-line">
          <p className="text-xs text-inkSoft mb-2">Autres villes :</p>
          <div className="flex flex-wrap gap-2">
            {VILLES.filter((v) => v !== ville).slice(0, 12).map((v) => (
              <Link
                key={v}
                href={`/recherche/${slugify(v)}`}
                className="text-xs bg-white border border-line px-3 py-1.5 rounded-full text-navy hover:border-blue"
              >
                {v}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
