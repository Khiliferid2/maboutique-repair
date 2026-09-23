import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// IMPORTANT : aucune valeur par défaut n'est utilisée ici. Un secret JWT
// prévisible permettrait à n'importe qui de forger un cookie de session
// (en choisissant lui-même boutiqueId, email...) et de prendre le contrôle
// de n'importe quel compte. En production, l'absence de JWT_SECRET doit
// donc empêcher le démarrage plutôt que de retomber silencieusement sur
// une valeur connue de tous ceux qui lisent ce dépôt.
function requireSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET manquant ou trop court. Définissez une variable d'environnement " +
        "JWT_SECRET (chaîne aléatoire d'au moins 32 caractères) avant de démarrer en production."
    );
  }

  // Uniquement toléré en développement local, avec avertissement explicite.
  console.warn(
    "[auth] JWT_SECRET absent ou faible — utilisation d'un secret de développement. " +
      "Ne jamais déployer ainsi en production."
  );
  return "dev-only-insecure-secret-do-not-deploy";
}

const SECRET = requireSecret();
const COOKIE_NAME = "mbr_session";

export type SessionPayload = {
  userId: string;
  boutiqueId: string;
  nom: string;
  email: string;
};

// Crée un token de session signé et le pose dans un cookie httpOnly
export function createSessionCookie(payload: SessionPayload) {
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

// Lit et vérifie la session courante (utilisable dans Server Components / API routes)
export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

// Vérifie si l'utilisateur connecté est le super-admin de la plateforme
// (celui qui peut voir/gérer TOUTES les boutiques). Contrôlé par l'email
// défini dans la variable d'environnement SUPER_ADMIN_EMAIL.
export function isSuperAdmin(session: SessionPayload | null): boolean {
  if (!session) return false;
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  if (!adminEmail) return false;
  return session.email.toLowerCase() === adminEmail.toLowerCase();
}

export { COOKIE_NAME };
