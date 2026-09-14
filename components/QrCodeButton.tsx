"use client";

import { useState } from "react";

// Génère un QR code via un service public gratuit (api.qrserver.com),
// sans ajouter de dépendance npm — pratique quand on déploie depuis
// GitHub/Vercel sans terminal local.
//
// Le QR encode l'URL passée en prop. Un clic ouvre/ferme l'aperçu.

export default function QrCodeButton({
  url,
  label = "QR Code",
}: {
  url: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    url
  )}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // silencieux : certains navigateurs mobiles bloquent le clipboard hors HTTPS
    }
  }

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-line text-navy text-xs font-semibold px-3 py-2 rounded-lg"
      >
        📱 {label}
      </button>

      {open && (
        <div className="mt-3 bg-white border border-line rounded-card p-4 flex flex-col items-center gap-2 max-w-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR code de suivi" width={180} height={180} />
          <p className="text-[11px] text-inkSoft text-center break-all">{url}</p>
          <button
            type="button"
            onClick={copyLink}
            className="text-xs font-semibold text-blue"
          >
            📋 Copier le lien
          </button>
        </div>
      )}
    </div>
  );
}
