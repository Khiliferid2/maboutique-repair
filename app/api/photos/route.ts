import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { url } = await req.json();
  if (!url?.trim()) return NextResponse.json({ error: "URL de photo requise." }, { status: 400 });
  const photo = await prisma.photo.create({ data: { boutiqueId: session.boutiqueId, url: url.trim() } });
  return NextResponse.json(photo);
}

export async function DELETE(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Photo introuvable." }, { status: 400 });
  const photo = await prisma.photo.findFirst({ where: { id, boutiqueId: session.boutiqueId } });
  if (!photo) return NextResponse.json({ error: "Photo introuvable." }, { status: 404 });
  await prisma.photo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
