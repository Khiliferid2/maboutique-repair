import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { boutiqueId: session.boutiqueId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { nom, prix, categorie, photoUrl, stock } = await req.json();
  if (!nom) {
    return NextResponse.json({ error: "Nom du produit requis." }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      boutiqueId: session.boutiqueId,
      nom,
      prix: prix ? parseFloat(prix) : 0,
      categorie: categorie || null,
      photoUrl: photoUrl || null,
      stock: stock !== undefined ? parseInt(stock) : 0,
    },
  });
  return NextResponse.json(product);
}
