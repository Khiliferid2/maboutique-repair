import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const categorie = searchParams.get("categorie")?.trim() || "";
  const boutiqueId = searchParams.get("boutiqueId")?.trim() || "";

  const products = await prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      boutique: { publie: true },
      ...(q ? { nom: { contains: q } } : {}),
      ...(categorie ? { categorie } : {}),
      ...(boutiqueId ? { boutiqueId } : {}),
    },
    include: {
      boutique: {
        select: { id: true, nom: true, ville: true, plan: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
