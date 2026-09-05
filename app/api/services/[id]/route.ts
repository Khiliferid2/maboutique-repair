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

  const service = await prisma.service.findFirst({
    where: { id: params.id, boutiqueId: session.boutiqueId },
  });
  if (!service) {
    return NextResponse.json({ error: "Service introuvable." }, { status: 404 });
  }

  await prisma.service.delete({ where: { id: service.id } });
  return NextResponse.json({ ok: true });
}
