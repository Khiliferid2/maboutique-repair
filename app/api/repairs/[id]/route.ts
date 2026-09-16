import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, repairReadyEmailHtml, repairReadyWhatsAppLink } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSession();
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { statut } = await req.json();
  if (!["en_attente", "en_cours", "termine"].includes(statut)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const repair = await prisma.repair.findFirst({
    where: { id: params.id, boutiqueId: session.boutiqueId },
    include: {
      device: { include: { client: true } },
      boutique: true,
    },
  });
  if (!repair) {
    return NextResponse.json(
      { error: "Réparation introuvable." },
      { status: 404 }
    );
  }

  const updated = await prisma.repair.update({
    where: { id: repair.id },
    data: {
      statut,
      dateTerminee: statut === "termine" ? new Date() : null,
    },
  });

  // Génère automatiquement une facture à la clôture de la réparation
  let whatsappLink: string | null = null;
  if (statut === "termine") {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { repairId: repair.id },
    });
    if (!existingInvoice) {
      // count() + create() dans la même transaction : évite que deux
      // clôtures de réparations simultanées, dans la même boutique,
      // calculent le même numéro de facture.
      await prisma.$transaction(async (tx) => {
        const count = await tx.invoice.count({
          where: { boutiqueId: session.boutiqueId },
        });
        const numero = `FAC-${String(count + 1).padStart(4, "0")}`;
        await tx.invoice.create({
          data: {
            boutiqueId: session.boutiqueId,
            repairId: repair.id,
            numero,
            montant: repair.prix,
          },
        });
      });
    }

    // Notifie le client : email automatique (si adresse connue) +
    // lien WhatsApp pré-rempli pour un envoi en un clic depuis le dashboard.
    const appareil = `${repair.device.marque} ${repair.device.modele}`;
    if (repair.device.client.email) {
      await sendEmail({
        to: repair.device.client.email,
        subject: "Votre appareil est prêt ✅",
        html: repairReadyEmailHtml({
          boutiqueNom: repair.boutique.nom,
          clientNom: repair.device.client.nom,
          appareil,
          prix: repair.prix,
          boutiqueTelephone: repair.boutique.telephone,
        }),
      });
    }
    if (repair.device.client.telephone) {
      whatsappLink = repairReadyWhatsAppLink({
        clientTelephone: repair.device.client.telephone,
        clientNom: repair.device.client.nom,
        boutiqueNom: repair.boutique.nom,
        appareil,
        prix: repair.prix,
      });
    }
  }

  return NextResponse.json({ ...updated, whatsappLink });
}
