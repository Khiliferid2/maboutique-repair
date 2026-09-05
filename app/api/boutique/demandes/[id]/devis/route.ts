import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const request = await prisma.repairRequest.findFirst({
    where: { id: params.id, boutiqueId: session.boutiqueId },
    include: { boutique: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  const { diagnostic, piece, mainOeuvre, message } = await req.json();
  const d = diagnostic ? parseFloat(diagnostic) : 0;
  const p = piece ? parseFloat(piece) : 0;
  const m = mainOeuvre ? parseFloat(mainOeuvre) : 0;
  const total = d + p + m;

  const devis = await prisma.devis.upsert({
    where: { requestId: request.id },
    update: { diagnostic: d, piece: p, mainOeuvre: m, total, message: message || null, statut: "envoye" },
    create: {
      requestId: request.id,
      diagnostic: d,
      piece: p,
      mainOeuvre: m,
      total,
      message: message || null,
    },
  });

  await prisma.repairRequest.update({
    where: { id: request.id },
    data: { statut: "devis_envoye" },
  });

  // Notifie le client par email s'il en a fourni un (best-effort)
  if (request.clientEmail) {
    sendEmail({
      to: request.clientEmail,
      subject: `Devis pour votre réparation — ${request.boutique.nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px;">
          <h2 style="color:#0F1F45;">💰 Votre devis est prêt</h2>
          <p>${request.boutique.nom} vous propose un devis de <b>${total.toFixed(0)} DT</b> pour votre réparation.</p>
          <p>Consultez et répondez au devis via le lien de suivi qui vous a été envoyé.</p>
        </div>
      `,
    });
  }

  return NextResponse.json(devis);
}
