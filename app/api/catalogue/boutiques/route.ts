import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Liste des boutiques ayant au moins un produit en stock, pour alimenter
// le filtre "Boutique" du catalogue.
export async function GET() {
  const boutiques = await prisma.boutique.findMany({
    where: {
      publie: true,
      products: { some: { stock: { gt: 0 } } },
    },
    select: { id: true, nom: true, ville: true },
    orderBy: { nom: "asc" },
  });

  return NextResponse.json(boutiques);
}
