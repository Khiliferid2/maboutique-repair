export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="mbrLogoGrad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0" stopColor="#1E56E0" />
          <stop offset="1" stopColor="#0F1F45" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#mbrLogoGrad)" />
      <text
        x="24"
        y="41"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="-1"
      >
        M
      </text>
      <text
        x="42"
        y="41"
        fontFamily="Poppins, Arial, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill="#FF9F43"
        textAnchor="middle"
        letterSpacing="-1"
      >
        B
      </text>
      <rect x="14" y="48" width="36" height="3" rx="1.5" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}
