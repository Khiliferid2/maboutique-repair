import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const boutique = await prisma.boutique.findFirst({
    where: { id: params.id, publie: true },
    include: { services: true, products: true, photos: true },
  });

  if (!boutique) {
    return NextResponse.json({ error: "Boutique introuvable." }, { status: 404 });
  }

  return NextResponse.json(boutique);
}
