"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { LANGUAGES } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-semibold text-navy border border-line rounded-lg px-3 py-1.5"
      >
        🌐 {current.label}
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <>
          {/* Zone invisible pour fermer le menu au clic en dehors */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 bg-white border border-line rounded-lg shadow-md z-20 overflow-hidden min-w-[140px]">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-paper ${
                  l.code === lang ? "font-bold text-blue" : "text-navy"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
