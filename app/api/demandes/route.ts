import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, escapeHtml } from "@/lib/email";
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

    if (
      !boutiqueId ||
      !typeAppareil ||
      !probleme ||
      !clientNom ||
      !clientTelephone ||
      typeof typeAppareil !== "string" ||
      typeof probleme !== "string" ||
      typeof clientNom !== "string" ||
      typeof clientTelephone !== "string"
    ) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    // Un formulaire public sans authentification : on borne la taille de
    // chaque champ pour éviter qu'un visiteur ne stocke des textes énormes
    // en base (abus de stockage / déni de service applicatif).
    const cTypeAppareil = typeAppareil.trim().slice(0, 80);
    const cMarque = typeof marque === "string" ? marque.trim().slice(0, 80) : "";
    const cModele = typeof modele === "string" ? modele.trim().slice(0, 80) : "";
    const cProbleme = probleme.trim().slice(0, 2000);
    const cClientNom = clientNom.trim().slice(0, 120);
    const cClientTelephone = clientTelephone.trim().slice(0, 30);
    const cClientEmail =
      typeof clientEmail === "string" && clientEmail.trim()
        ? clientEmail.trim().slice(0, 160)
        : null;

    const boutique = await prisma.boutique.findFirst({
      where: { id: boutiqueId, publie: true },
    });
    if (!boutique) {
      return NextResponse.json({ error: "Boutique introuvable." }, { status: 404 });
    }

    const request = await prisma.repairRequest.create({
      data: {
        boutiqueId,
        typeAppareil: cTypeAppareil,
        marque: cMarque || null,
        modele: cModele || null,
        probleme: cProbleme,
        photoUrl: photoUrl || null,
        clientNom: cClientNom,
        clientTelephone: cClientTelephone,
        clientEmail: cClientEmail,
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
            <p><b>${escapeHtml(cClientNom)}</b> (${escapeHtml(cClientTelephone)}) a besoin d'une réparation :</p>
            <p><b>${escapeHtml(cTypeAppareil)}</b> ${cMarque ? `— ${escapeHtml(cMarque)} ${escapeHtml(cModele)}` : ""}</p>
            <p>${escapeHtml(cProbleme)}</p>
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
