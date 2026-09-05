import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import CircuitBackground from "@/components/CircuitBackground";

export const metadata: Metadata = {
  title: "Devenir partenaire — Inscrivez votre atelier | MaBoutique Repair",
  description:
    "Rejoignez gratuitement MaBoutique Repair et faites découvrir votre atelier de réparation à des milliers de clients en Tunisie.",
};

export default function DevenirPartenairePage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link href="/login" className="text-sm font-semibold text-blue">
            Déjà partenaire ? Connexion
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-br from-navy via-navy2 to-blue text-white px-8 py-16 md:px-14 my-8 text-center relative overflow-hidden">
          <CircuitBackground />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
              🎁 Inscription gratuite — aucune carte bancaire requise
            </div>
            <h1 className="font-display text-3xl md:text-4xl mb-4">
              Faites connaître votre atelier à des milliers de clients
            </h1>
            <p className="text-white/75 max-w-xl mx-auto mb-8">
              MaBoutique Repair met votre atelier en avant auprès des clients
              qui cherchent un réparateur près de chez eux, et vous donne les
              outils pour tout gérer : clients, réparations, stock, factures.
            </p>
            <Link
              href="/register"
              className="inline-block bg-orange text-navy font-bold px-7 py-3.5 rounded-xl"
            >
              Créer ma boutique gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi rejoindre */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="font-display text-xl text-navy text-center mb-10">
          Pourquoi rejoindre MaBoutique Repair ?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["📍", "Plus de visibilité", "Votre atelier apparaît dans les recherches des clients situés près de chez vous, 24h/24."],
            ["🛠️", "Gestion tout-en-un", "Clients, appareils, réparations, garanties, stock, factures — un seul outil pour tout."],
            ["🛒", "Vendez vos pièces en ligne", "Chargeurs, écrans, batteries... vos produits deviennent commandables directement en ligne."],
            ["⭐", "Bâtissez votre réputation", "Les avis clients affichés sur votre profil renforcent la confiance des nouveaux clients."],
            ["📊", "Statistiques claires", "Suivez votre chiffre d'affaires, vos réparations en cours et vos commandes en temps réel."],
            ["💬", "Contact facilité", "Boutons Appel, WhatsApp et Itinéraire directement sur votre profil public."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white border border-line rounded-card p-6">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold text-navy text-sm mb-1">{title}</h3>
              <p className="text-sm text-inkSoft">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans rapides */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white border border-line rounded-card p-8 text-center">
          <h2 className="font-display text-lg text-navy mb-2">
            Commencez gratuitement, évoluez quand vous voulez
          </h2>
          <p className="text-sm text-inkSoft mb-6">
            Le plan Free suffit pour être visible. Passez Pro ou Premium plus tard pour plus de mise en avant.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/register" className="bg-orange text-navy font-bold px-6 py-3 rounded-lg">
              Créer ma boutique
            </Link>
            <Link href="/faq" className="border border-line text-navy font-semibold px-6 py-3 rounded-lg">
              Voir les questions fréquentes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
