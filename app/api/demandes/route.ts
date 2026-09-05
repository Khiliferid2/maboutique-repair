import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(`demande:${ip}`)) {
      return NextResponse.json(
        { error: "Trop de demandes envoyées. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const {
      boutiqueId,
      typeAppareil,
      marque,
      modele,
      probleme,
      photoUrl,
      clientNom,
      clientTelephone,
      clientEmail,
    } = await req.json();

    if (!boutiqueId || !typeAppareil || !probleme || !clientNom || !clientTelephone) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const boutique = await prisma.boutique.findFirst({
      where: { id: boutiqueId, publie: true },
    });
    if (!boutique) {
      return NextResponse.json({ error: "Boutique introuvable." }, { status: 404 });
    }

    const request = await prisma.repairRequest.create({
      data: {
        boutiqueId,
        typeAppareil,
        marque: marque || null,
        modele: modele || null,
        probleme,
        photoUrl: photoUrl || null,
        clientNom,
        clientTelephone,
        clientEmail: clientEmail || null,
      },
    });

    // Notifie le propriétaire de la boutique (best-effort)
    const owner = await prisma.user.findFirst({ where: { boutiqueId } });
    if (owner) {
      sendEmail({
        to: owner.email,
        subject: `Nouvelle demande de réparation — ${boutique.nom}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px;">
            <h2 style="color:#0F1F45;">🔧 Nouvelle demande de réparation</h2>
            <p><b>${clientNom}</b> (${clientTelephone}) a besoin d'une réparation :</p>
            <p><b>${typeAppareil}</b> ${marque ? `— ${marque} ${modele || ""}` : ""}</p>
            <p>${probleme}</p>
            <p>Connectez-vous à votre tableau de bord pour envoyer un devis.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ id: request.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}
