"use client";

import { useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main className="min-h-screen bg-paper flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="flex justify-center mb-6">
              <Logo size={56} />
            </div>
            <h1 className="font-display text-xl text-navy mb-2">
              Une erreur est survenue
            </h1>
            <p className="text-sm text-inkSoft mb-6">
              Quelque chose s'est mal passé. Réessayez, ou revenez à l'accueil.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                Réessayer
              </button>
              <Link
                href="/"
                className="border border-line text-navy text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                Accueil
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
