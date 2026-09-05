import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession();
  if (!session) redirect("/login");

  const boutique = await prisma.boutique.findUnique({
    where: { id: session.boutiqueId },
  });
  if (!boutique) redirect("/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar boutiqueNom={boutique.nom} />
      <div className="flex-1">
        <header className="bg-white border-b border-line px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-inkSoft">
            Bienvenue, <span className="font-semibold text-navy">{session.nom}</span>
          </div>
          <div className="text-xs bg-paper border border-line px-3 py-1.5 rounded-full text-navy font-semibold">
            Plan {boutique.plan}
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
