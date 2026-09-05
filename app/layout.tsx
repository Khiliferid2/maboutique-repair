import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "MaBoutique Repair — Trouvez un réparateur près de chez vous en Tunisie",
  description:
    "La plateforme n°1 en Tunisie pour trouver un réparateur de smartphones, PC, tablettes et consoles près de chez vous, et pour gérer votre atelier de réparation : clients, appareils, IMEI, réparations, garanties, stock et factures.",
  keywords: [
    "réparation smartphone Tunisie",
    "réparateur iPhone",
    "atelier réparation électronique",
    "gestion atelier réparation",
    "pièces détachées téléphone Tunisie",
  ],
  openGraph: {
    title: "MaBoutique Repair — Réparation électronique en Tunisie",
    description:
      "Trouvez un réparateur près de chez vous, ou gérez votre atelier de réparation avec MaBoutique Repair.",
    type: "website",
    locale: "fr_TN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
