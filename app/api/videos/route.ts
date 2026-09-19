import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { url, titre, description } = await req.json();
  if (!url?.trim()) return NextResponse.json({ error: "URL de vidéo requise." }, { status: 400 });
  const video = await prisma.video.create({
    data: { boutiqueId: session.boutiqueId, url: url.trim(), titre: titre?.trim() || null, description: description?.trim() || null },
  });
  return NextResponse.json(video);
}

export async function DELETE(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Vidéo introuvable." }, { status: 400 });
  const video = await prisma.video.findFirst({ where: { id, boutiqueId: session.boutiqueId } });
  if (!video) return NextResponse.json({ error: "Vidéo introuvable." }, { status: 404 });
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
