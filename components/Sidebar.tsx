"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const links = [
  { href: "/dashboard", label: "Tableau de bord", icon: "📊" },
  { href: "/dashboard/profil", label: "Profil de ma boutique", icon: "🏪" },
  { href: "/dashboard/demandes", label: "Demandes & devis", icon: "🔧" },
  { href: "/dashboard/commandes", label: "Commandes en ligne", icon: "🛒" },
  { href: "/dashboard/abonnement", label: "Mon abonnement", icon: "💳" },
  { href: "/dashboard/clients", label: "Clients", icon: "👤" },
  { href: "/dashboard/appareils", label: "Appareils", icon: "📱" },
  { href: "/dashboard/reparations", label: "Réparations", icon: "🔧" },
  { href: "/dashboard/stock", label: "Stock", icon: "📦" },
  { href: "/dashboard/factures", label: "Factures", icon: "🧾" },
];

export default function Sidebar({ boutiqueNom }: { boutiqueNom: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-line min-h-screen flex flex-col">
      <div className="p-5 border-b border-line">
        <div className="flex items-center gap-2 font-display font-bold text-navy">
          <Logo size={32} />
          <div className="leading-tight text-sm">
            MaBoutique
            <small className="block text-[9px] tracking-widest text-blue">
              REPAIR
            </small>
          </div>
        </div>
        <p className="text-xs text-inkSoft mt-2 truncate">{boutiqueNom}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((l) => {
          const active =
            l.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-blue text-white"
                  : "text-inkSoft hover:bg-paper hover:text-navy"
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-line">
        <button
          onClick={logout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red hover:bg-red/10"
        >
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}
