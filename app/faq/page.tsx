import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Questions fréquentes (FAQ) — MaBoutique Repair",
  description:
    "Réponses aux questions les plus fréquentes sur MaBoutique Repair : recherche d'un réparateur, garantie, inscription d'un atelier, tarifs, paiement.",
};

const clientFaq = [
  { q: "MaBoutique Repair est-il gratuit pour les clients ?", a: "Oui, la recherche d'un réparateur, la consultation des profils et le contact avec les ateliers sont 100% gratuits pour les clients." },
  { q: "Comment savoir si un atelier est fiable ?", a: "Consultez les avis clients laissés sur chaque profil, ainsi que le badge « Pro » ou « Premium » attribué aux ateliers les plus actifs." },
  { q: "La garantie est-elle assurée par MaBoutique Repair ?", a: "Non, la garantie est proposée directement par l'atelier de réparation. La durée est indiquée sur chaque réparation ou à demander à l'atelier." },
  { q: "Puis-je acheter des pièces sans passer par un atelier physique ?", a: "Oui, via /catalogue vous pouvez commander des pièces (chargeurs, écrans, batteries...) directement en ligne, avec paiement à la livraison ou par carte." },
];

const proFaq = [
  { q: "Combien coûte l'inscription de mon atelier ?", a: "L'inscription et le plan Free sont gratuits à vie. Les plans Pro et Premium sont payants et offrent une meilleure visibilité dans les résultats de recherche." },
  { q: "Comment mes clients me trouvent-ils ?", a: "Une fois votre profil complété (ville, téléphone, position GPS), votre atelier apparaît automatiquement dans les résultats de /recherche, classé par pertinence et distance." },
  { q: "Puis-je vendre mes pièces détachées en ligne ?", a: "Oui, ajoutez vos produits avec leur stock depuis votre tableau de bord — ils apparaissent alors dans le catalogue public et sont commandables en ligne." },
  { q: "Comment reçois-je le paiement des commandes en ligne ?", a: "Le paiement à la livraison va directement au client final. Pour le paiement par carte, contactez-nous pour configurer votre compte de réception (Konnect)." },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link href="/" className="text-sm font-semibold text-blue">
            ← Accueil
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="font-display text-2xl text-navy mb-2 text-center">
          Questions fréquentes
        </h1>
        <p className="text-inkSoft text-center mb-10">
          Tout ce qu'il faut savoir avant de commencer.
        </p>

        <h2 className="font-display text-base text-navy mb-4">Pour les clients</h2>
        <div className="mb-10">
          <FaqAccordion items={clientFaq} />
        </div>

        <h2 className="font-display text-base text-navy mb-4">Pour les ateliers</h2>
        <FaqAccordion items={proFaq} />

        <div className="text-center mt-10">
          <p className="text-sm text-inkSoft mb-3">Une autre question ?</p>
          <Link
            href="/devenir-partenaire"
            className="inline-block bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </main>
  );
}
