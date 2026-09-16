import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Aucune valeur par défaut ici volontairement : un repli silencieux sur un
// secret connu (ex: "dev-secret-change-me") permettrait à n'importe qui de
// forger un cookie de session valide si la variable d'environnement est
// oubliée en production. On préfère planter au démarrage.
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error(
    "JWT_SECRET manquant. Définissez-le dans .env (local) ou dans les " +
      "variables d'environnement du projet (production) avant de démarrer."
  );
}
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

export { COOKIE_NAME, SECRET };
