"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang, LANGUAGES, translations } from "./i18n";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "mbr_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  // Charge la langue sauvegardée (si l'utilisateur en a déjà choisi une)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "fr" || saved === "ar" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || "ltr";

  // Met à jour l'attribut dir/lang du <html> pour un vrai support RTL
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  function t(key: string): string {
    return translations[lang][key] ?? translations.fr[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage doit être utilisé à l'intérieur de <LanguageProvider>");
  }
  return ctx;
}
