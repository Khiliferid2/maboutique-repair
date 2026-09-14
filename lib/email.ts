// Envoi d'emails via Resend (https://resend.com) — gratuit jusqu'à 3000
// emails/mois, très simple à configurer pour un projet comme celui-ci.
//
// Pour activer les notifications par email :
// 1. Créez un compte sur https://resend.com
// 2. Vérifiez votre domaine (ou utilisez leur domaine de test pour commencer)
// 3. Récupérez votre clé API et ajoutez-la dans .env :
//    RESEND_API_KEY="re_xxxxxxxx"
//    EMAIL_FROM="MaBoutique Repair <notifications@votredomaine.tn>"
//
// Sans ces variables, les notifications sont simplement désactivées — le
// site continue de fonctionner normalement (les commandes restent visibles
// dans /dashboard/commandes).

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      }),
    });
  } catch (err) {
    // Un email raté ne doit jamais faire échouer la commande elle-même
    console.error("Envoi email échoué:", err);
  }
}

export function newOrderEmailHtml(params: {
  boutiqueNom: string;
  numero: string;
  clientNom: string;
  clientTelephone: string;
  montantTotal: number;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0F1F45;">🛒 Nouvelle commande — ${params.numero}</h2>
      <p>Bonjour,</p>
      <p>Vous avez reçu une nouvelle commande sur <b>${params.boutiqueNom}</b> :</p>
      <ul>
        <li>Client : ${params.clientNom} (${params.clientTelephone})</li>
        <li>Montant : ${params.montantTotal.toFixed(0)} DT</li>
      </ul>
      <p>Connectez-vous à votre tableau de bord pour la traiter.</p>
      <p style="color: #6B7280; font-size: 12px;">MaBoutique Repair</p>
    </div>
  `;
}

// --- Notification "réparation prête" ---
//
// L'envoi automatique de WhatsApp nécessite une API WhatsApp Business
// (payante, ex: Twilio, Meta Cloud API) qui n'est pas configurée par
// défaut. En attendant, on couvre deux canaux :
//  1. Email automatique au client (si son email est connu et Resend est
//     configuré) via sendEmail + repairReadyEmailHtml ci-dessous.
//  2. Un lien WhatsApp "clic-pour-envoyer" (wa.me) pré-rempli, que le
//     réparateur peut envoyer en un clic depuis le tableau de bord.

export function repairReadyEmailHtml(params: {
  boutiqueNom: string;
  clientNom: string;
  appareil: string;
  prix: number;
  boutiqueTelephone?: string | null;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0F1F45;">✅ Votre appareil est prêt !</h2>
      <p>Bonjour ${params.clientNom},</p>
      <p>Bonne nouvelle : votre <b>${params.appareil}</b> a été réparé chez <b>${params.boutiqueNom}</b> et est prêt à être récupéré.</p>
      <p>Montant à régler : <b>${params.prix.toFixed(0)} DT</b></p>
      ${
        params.boutiqueTelephone
          ? `<p>Pour toute question, contactez-nous au ${params.boutiqueTelephone}.</p>`
          : ""
      }
      <p style="color: #6B7280; font-size: 12px;">MaBoutique Repair</p>
    </div>
  `;
}

export function repairReadyWhatsAppLink(params: {
  clientTelephone: string;
  clientNom: string;
  boutiqueNom: string;
  appareil: string;
  prix: number;
}): string {
  const message =
    `Bonjour ${params.clientNom}, votre ${params.appareil} est prêt ` +
    `chez ${params.boutiqueNom} ! Montant à régler : ${params.prix.toFixed(0)} DT. ` +
    `Vous pouvez venir le récupérer dès que possible. Merci 🙏`;

  // wa.me attend un numéro international sans "+", "00" ni espaces.
  const phone = params.clientTelephone.replace(/[^0-9]/g, "").replace(/^00/, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
