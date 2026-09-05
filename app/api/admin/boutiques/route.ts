import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isSuperAdmin } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const boutiques = await prisma.boutique.findMany({
    include: {
      _count: {
        select: { repairs: true, clients: true, services: true },
      },
      users: { select: { email: true, nom: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(boutiques);
}
