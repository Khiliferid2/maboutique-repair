import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const request = await prisma.repairRequest.findUnique({
    where: { id: params.id },
    include: {
      devis: true,
      boutique: {
        select: { nom: true, telephone: true, whatsapp: true },
      },
    },
  });

  if (!request) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  return NextResponse.json(request);
}
