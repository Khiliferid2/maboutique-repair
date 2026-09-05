/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // S'applique à toutes les routes du site
        source: "/:path*",
        headers: [
          // Empêche le site d'être affiché dans une <iframe> sur un autre domaine (anti-clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le navigateur de deviner le type de fichier (anti-MIME-sniffing)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limite les infos envoyées dans l'en-tête Referer vers d'autres sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Désactive l'accès à la caméra/micro/géoloc par défaut pour les iframes tiers
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
