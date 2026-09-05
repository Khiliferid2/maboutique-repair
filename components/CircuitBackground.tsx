// Fond décoratif inspiré des circuits imprimés (électronique / réparation) —
// utilisé en arrière-plan des sections sombres (hero, CTA) pour renforcer
// l'identité "réparation électronique" du site, sans distraire du contenu.
export default function CircuitBackground({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="circuit-dots" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#4C86F5" opacity="0.25" />
        </pattern>
      </defs>

      {/* grille de points façon breadboard */}
      <rect width="800" height="500" fill="url(#circuit-dots)" />

      {/* traces de circuit imprimé */}
      <g stroke="#4C86F5" strokeWidth="1.5" fill="none" opacity="0.28">
        <path d="M40 60 H220 V140 H340" />
        <path d="M40 60 V20" />
        <path d="M340 140 V220 H500" />
        <path d="M500 220 V80 H680" />
        <path d="M680 80 V30" />
        <path d="M120 340 H300 V420 H460" />
        <path d="M460 420 V460" />
        <path d="M300 340 V260 H600" />
        <path d="M600 260 V180" />
        <path d="M680 300 H760" />
        <path d="M600 260 H720 V340" />
      </g>

      {/* nœuds (pads) de circuit */}
      <g fill="#FF9F43" opacity="0.55">
        <circle cx="220" cy="60" r="4" />
        <circle cx="340" cy="140" r="4" />
        <circle cx="500" cy="220" r="4" />
        <circle cx="680" cy="80" r="4" />
        <circle cx="300" cy="340" r="4" />
        <circle cx="460" cy="420" r="4" />
        <circle cx="600" cy="260" r="4" />
        <circle cx="720" cy="340" r="4" />
      </g>

      {/* icône tournevis stylisée */}
      <g transform="translate(640,380) rotate(35)" opacity="0.22">
        <rect x="-4" y="-40" width="8" height="34" rx="3" fill="#4C86F5" />
        <rect x="-6" y="-6" width="12" height="26" rx="3" fill="#4C86F5" />
        <rect x="-8" y="18" width="16" height="10" rx="3" fill="#4C86F5" />
      </g>

      {/* icône puce électronique stylisée */}
      <g transform="translate(120,120)" opacity="0.22">
        <rect x="-20" y="-20" width="40" height="40" rx="4" fill="none" stroke="#FF9F43" strokeWidth="2" />
        <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#FF9F43" />
        {[-14, -4.5, 5, 14.5].map((x) => (
          <g key={x}>
            <line x1={x} y1="-20" x2={x} y2="-28" stroke="#FF9F43" strokeWidth="2" />
            <line x1={x} y1="20" x2={x} y2="28" stroke="#FF9F43" strokeWidth="2" />
          </g>
        ))}
      </g>
    </svg>
  );
}
