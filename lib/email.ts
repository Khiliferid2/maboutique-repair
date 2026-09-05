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
