import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, isSuperAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!isSuperAdmin(session)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { plan, publie } = await req.json();
  const data: Record<string, unknown> = {};

  if (plan) {
    if (!["free", "pro", "premium"].includes(plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }
    data.plan = plan;
  }
  if (typeof publie === "boolean") {
    data.publie = publie;
  }

  const boutique = await prisma.boutique.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(boutique);
}
