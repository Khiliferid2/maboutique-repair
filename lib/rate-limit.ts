// Limiteur de tentatives simple, en mémoire, pour ralentir les attaques par
// force brute sur la connexion. Sur Vercel (serverless), la mémoire n'est
// pas partagée entre toutes les instances — c'est donc une protection
// "best-effort" et non une garantie absolue. Pour une protection stricte à
// grande échelle, remplacez ceci par Upstash Redis (compatible Vercel Edge).

const attempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000; // fenêtre de 10 minutes
const MAX_ATTEMPTS = 8;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return true;
  }
  return false;
}

// Réinitialise le compteur (appelé après une connexion réussie)
export function resetRateLimit(key: string): void {
  attempts.delete(key);
}
