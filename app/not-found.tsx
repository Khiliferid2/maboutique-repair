import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo size={56} />
        </div>
        <h1 className="font-display text-2xl text-navy mb-2">404</h1>
        <p className="text-sm text-inkSoft mb-6">
          Cette page n'existe pas ou n'est plus disponible.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/recherche"
            className="border border-line text-navy text-sm font-semibold px-5 py-2.5 rounded-lg"
          >
            Trouver un réparateur
          </Link>
        </div>
      </div>
    </main>
  );
}
