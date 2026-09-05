import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const product = await prisma.product.findFirst({
    where: { id: params.id, boutiqueId: session.boutiqueId },
  });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  await prisma.product.delete({ where: { id: product.id } });
  return NextResponse.json({ ok: true });
}
