// Intégration avec Konnect (https://konnect.network), passerelle de paiement
// tunisienne qui accepte les cartes bancaires locales et internationales.
//
// Pour activer les paiements par carte :
// 1. Créez un compte sur https://konnect.network (mode "Sandbox" pour tester)
// 2. Récupérez votre API Key et votre Wallet ID dans le tableau de bord
// 3. Ajoutez-les dans .env :
//    KONNECT_API_KEY="votre-cle"
//    KONNECT_WALLET_ID="votre-wallet-id"
//    KONNECT_BASE_URL="https://api.sandbox.konnect.network/api/v2" (sandbox)
//    ou "https://api.konnect.network/api/v2" (production)
//
// Sans ces variables, le paiement par carte est simplement désactivé et
// seul le paiement à la livraison reste proposé au client — le site
// continue de fonctionner normalement.

export function isKonnectConfigured(): boolean {
  return Boolean(process.env.KONNECT_API_KEY && process.env.KONNECT_WALLET_ID);
}

type InitPaymentParams = {
  montantDT: number; // montant en dinars tunisiens
  orderId: string;
  orderNumero: string;
  clientNom: string;
  clientTelephone: string;
  successUrl: string;
  failUrl: string;
};

// Initialise un paiement Konnect et renvoie l'URL vers laquelle rediriger le
// client pour qu'il entre ses coordonnées bancaires.
export async function initKonnectPayment(params: InitPaymentParams): Promise<{
  payUrl: string;
  paymentRef: string;
}> {
  const baseUrl =
    process.env.KONNECT_BASE_URL || "https://api.sandbox.konnect.network/api/v2";

  const res = await fetch(`${baseUrl}/payments/init-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.KONNECT_API_KEY!,
    },
    body: JSON.stringify({
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      // Konnect attend le montant en millimes (1 DT = 1000 millimes)
      amount: Math.round(params.montantDT * 1000),
      token: "TND",
      type: "immediate",
      description: `Commande ${params.orderNumero} — MaBoutique Repair`,
      acceptedPaymentMethods: ["bank_card"],
      orderId: params.orderId,
      firstName: params.clientNom,
      phoneNumber: params.clientTelephone,
      successUrl: params.successUrl,
      failUrl: params.failUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Konnect init-payment a échoué: ${text}`);
  }

  const data = await res.json();
  return { payUrl: data.payUrl, paymentRef: data.paymentRef };
}

// Vérifie le statut réel d'un paiement auprès de Konnect (utilisé par le webhook)
export async function getKonnectPaymentStatus(paymentRef: string): Promise<string> {
  const baseUrl =
    process.env.KONNECT_BASE_URL || "https://api.sandbox.konnect.network/api/v2";

  const res = await fetch(`${baseUrl}/payments/${paymentRef}`, {
    headers: { "x-api-key": process.env.KONNECT_API_KEY! },
  });
  if (!res.ok) throw new Error("Impossible de vérifier le paiement Konnect.");
  const data = await res.json();
  return data.payment?.status || "unknown"; // "completed" | "pending" | "failed" ...
}
