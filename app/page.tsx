import Link from "next/link";
import Logo from "@/components/Logo";
import CircuitBackground from "@/components/CircuitBackground";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-line">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            <div className="leading-tight">
              MaBoutique
              <small className="block text-[10px] tracking-widest text-blue">
                REPAIR
              </small>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-3 items-center flex-wrap text-xs sm:text-sm">
            <Link
              href="/catalogue"
              className="px-2 sm:px-4 py-2 font-semibold text-navy whitespace-nowrap"
            >
              🛒 Boutique en ligne
            </Link>
            <Link
              href="/recherche"
              className="px-2 sm:px-4 py-2 font-semibold text-navy whitespace-nowrap"
            >
              🔍 Trouver un réparateur
            </Link>
            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 rounded-full border border-line font-semibold text-navy whitespace-nowrap"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-3 sm:px-4 py-2 rounded-full bg-blue text-white font-semibold whitespace-nowrap"
            >
              S'inscrire
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl my-8 px-8 py-16 md:px-12 bg-gradient-to-br from-navy via-navy2 to-blue text-white">
          <CircuitBackground />
          <div className="relative max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl leading-tight mb-5">
              Réparez, gérez et développez votre activité avec{" "}
              <span className="text-orange">MaBoutique Repair</span>
            </h1>
            <p className="text-white/75 mb-8">
              Le logiciel n°1 en Tunisie pour la gestion des ateliers de
              réparation smartphones et électronique : clients, appareils,
              IMEI, réparations, garanties, stock et factures.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-orange text-navy font-bold"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl border border-white/40 font-semibold"
              >
                J'ai déjà un compte
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-5">
              Vous êtes un client ?{" "}
              <Link href="/recherche" className="text-orange font-semibold underline">
                Trouver un réparateur près de chez vous →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-navy mb-8">
          Tout l'atelier, un seul outil
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            ["📱", "Clients & appareils", "Historique complet, IMEI enregistré."],
            ["🔧", "Réparations & garantie", "Suivi de statut en temps réel."],
            ["📦", "Stock & pièces", "Alertes de rupture automatiques."],
            ["🧾", "Factures", "Générées automatiquement."],
            ["📊", "Tableau de bord", "Chiffre d'affaires en un coup d'œil."],
            ["🏪", "Multi-boutiques", "Plusieurs points de vente, un compte."],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="bg-white border border-line rounded-card p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-navy text-orange flex items-center justify-center text-lg mb-4">
                {icon}
              </div>
              <h3 className="font-display text-base text-navy mb-1">
                {title}
              </h3>
              <p className="text-sm text-inkSoft">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl bg-navy text-white px-10 py-14 text-center relative overflow-hidden">
          <CircuitBackground />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl mb-3">
              Prêt à organiser votre atelier ?
            </h2>
            <p className="text-white/70 mb-7">
              Créez votre boutique en 2 minutes. Aucune carte bancaire requise.
            </p>
            <Link
              href="/register"
              className="inline-block px-7 py-3 rounded-xl bg-orange text-navy font-bold"
            >
              Créer ma boutique
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-navy text-white/80 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">Plateforme</h4>
              <div className="space-y-2">
                <Link href="/comment-ca-marche" className="block hover:text-white">Comment ça marche</Link>
                <Link href="/faq" className="block hover:text-white">FAQ</Link>
                <Link href="/devenir-partenaire" className="block hover:text-white">Devenir partenaire</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Clients</h4>
              <div className="space-y-2">
                <Link href="/recherche" className="block hover:text-white">Trouver un réparateur</Link>
                <Link href="/catalogue" className="block hover:text-white">Boutique en ligne</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Villes populaires</h4>
              <div className="space-y-2">
                <Link href="/recherche/tunis" className="block hover:text-white">Réparateur à Tunis</Link>
                <Link href="/recherche/sfax" className="block hover:text-white">Réparateur à Sfax</Link>
                <Link href="/recherche/sousse" className="block hover:text-white">Réparateur à Sousse</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Ateliers</h4>
              <div className="space-y-2">
                <Link href="/register" className="block hover:text-white">Créer ma boutique</Link>
                <Link href="/login" className="block hover:text-white">Connexion</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm">
            « Réparez aujourd'hui, grandissez demain ! » — 📍 Tunisie
          </div>
        </div>
      </footer>
    </main>
  );
}
