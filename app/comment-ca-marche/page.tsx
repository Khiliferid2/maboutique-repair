import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Comment ça marche — MaBoutique Repair",
  description:
    "Découvrez comment trouver un réparateur près de chez vous, ou comment inscrire votre atelier de réparation sur MaBoutique Repair.",
};

export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link href="/" className="text-sm font-semibold text-blue">
            ← Accueil
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="font-display text-2xl md:text-3xl text-navy mb-2 text-center">
          Comment ça marche ?
        </h1>
        <p className="text-inkSoft text-center mb-14 max-w-lg mx-auto">
          MaBoutique Repair connecte les clients qui ont un appareil en panne
          avec les meilleurs ateliers de réparation près de chez eux.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Côté client */}
          <div>
            <h2 className="font-display text-lg text-navy mb-6 flex items-center gap-2">
              📱 Vous avez un appareil en panne ?
            </h2>
            <div className="space-y-5">
              {[
                ["1", "Recherchez", "Indiquez votre position ou choisissez un service (écran cassé, batterie, carte mère...)."],
                ["2", "Comparez", "Consultez les profils, avis clients et distances des ateliers disponibles."],
                ["3", "Contactez", "Appelez, envoyez un message WhatsApp ou obtenez l'itinéraire en un clic."],
                ["4", "Faites réparer", "Déposez votre appareil, profitez de la garantie proposée par l'atelier."],
              ].map(([n, title, desc]) => (
                <div key={n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm mb-1">{title}</h3>
                    <p className="text-sm text-inkSoft">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/recherche"
              className="inline-block mt-6 bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Trouver un réparateur
            </Link>
          </div>

          {/* Côté atelier */}
          <div>
            <h2 className="font-display text-lg text-navy mb-6 flex items-center gap-2">
              🔧 Vous gérez un atelier de réparation ?
            </h2>
            <div className="space-y-5">
              {[
                ["1", "Créez votre boutique", "Inscription gratuite en 2 minutes, aucune carte bancaire requise."],
                ["2", "Complétez votre profil", "Services, produits, localisation GPS, horaires — pour apparaître dans les recherches."],
                ["3", "Recevez des clients", "Les clients vous trouvent, vous contactent et viennent directement à l'atelier."],
                ["4", "Gérez tout en un endroit", "Clients, réparations, garanties, stock, factures et commandes en ligne."],
              ].map(([n, title, desc]) => (
                <div key={n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange text-navy flex items-center justify-center font-bold text-sm shrink-0">
                    {n}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-sm mb-1">{title}</h3>
                    <p className="text-sm text-inkSoft">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/devenir-partenaire"
              className="inline-block mt-6 bg-orange text-navy text-sm font-bold px-5 py-2.5 rounded-lg"
            >
              Inscrire mon atelier
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
