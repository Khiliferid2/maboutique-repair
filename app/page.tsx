"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import CircuitBackground from "@/components/CircuitBackground";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/language-context";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-line">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            <div className="leading-tight">
              MaBoutique
              <small className="block text-[10px] tracking-widest text-blue">
                REPAIR
              </small>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-3 items-center flex-wrap text-xs sm:text-sm">
            <Link
              href="/catalogue"
              className="px-2 sm:px-4 py-2 font-semibold text-navy whitespace-nowrap"
            >
              🛒 {t("nav.shop")}
            </Link>
            <Link
              href="/recherche"
              className="px-2 sm:px-4 py-2 font-semibold text-navy whitespace-nowrap"
            >
              🔍 {t("nav.find")}
            </Link>
            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 rounded-full border border-line font-semibold text-navy whitespace-nowrap"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="px-3 sm:px-4 py-2 rounded-full bg-blue text-white font-semibold whitespace-nowrap"
            >
              {t("nav.register")}
            </Link>
            <LanguageSwitcher />
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl my-8 px-8 py-16 md:px-12 bg-gradient-to-br from-navy via-navy2 to-blue text-white">
          <CircuitBackground />
          <div className="relative max-w-xl">
            <h1 className="font-display text-3xl md:text-5xl leading-tight mb-5">
              {t("hero.title1")} {t("hero.title2")}{" "}
              <span className="text-orange">{t("hero.title3")}</span>
            </h1>
            <p className="text-white/75 mb-8">{t("hero.lead")}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-orange text-navy font-bold"
              >
                {t("hero.cta.start")}
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl border border-white/40 font-semibold"
              >
                {t("hero.cta.demo")}
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-5">
              {t("hero.client.line")}{" "}
              <Link href="/recherche" className="text-orange font-semibold underline">
                {t("hero.client.link")}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl text-navy mb-8">{t("features.title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            ["📱", "features.clients.title", "features.clients.desc"],
            ["🔧", "features.repairs.title", "features.repairs.desc"],
            ["📦", "features.stock.title", "features.stock.desc"],
            ["🧾", "features.invoices.title", "features.invoices.desc"],
            ["📊", "features.dashboard.title", "features.dashboard.desc"],
            ["🏪", "features.multi.title", "features.multi.desc"],
          ].map(([icon, titleKey, descKey]) => (
            <div
              key={titleKey}
              className="bg-white border border-line rounded-card p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-navy text-orange flex items-center justify-center text-lg mb-4">
                {icon}
              </div>
              <h3 className="font-display text-base text-navy mb-1">
                {t(titleKey)}
              </h3>
              <p className="text-sm text-inkSoft">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl bg-navy text-white px-10 py-14 text-center relative overflow-hidden">
          <CircuitBackground />
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl mb-3">{t("cta.title")}</h2>
            <p className="text-white/70 mb-7">{t("cta.desc")}</p>
            <Link
              href="/register"
              className="inline-block px-7 py-3 rounded-xl bg-orange text-navy font-bold"
            >
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-navy text-white/80 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">{t("footer.platform")}</h4>
              <div className="space-y-2">
                <Link href="/comment-ca-marche" className="block hover:text-white">{t("footer.howitworks")}</Link>
                <Link href="/faq" className="block hover:text-white">{t("footer.faq")}</Link>
                <Link href="/devenir-partenaire" className="block hover:text-white">{t("footer.partner")}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{t("footer.clients")}</h4>
              <div className="space-y-2">
                <Link href="/recherche" className="block hover:text-white">{t("footer.findrepairer")}</Link>
                <Link href="/catalogue" className="block hover:text-white">{t("footer.onlineshop")}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{t("footer.cities")}</h4>
              <div className="space-y-2">
                <Link href="/recherche/tunis" className="block hover:text-white">{t("footer.city.tunis")}</Link>
                <Link href="/recherche/sfax" className="block hover:text-white">{t("footer.city.sfax")}</Link>
                <Link href="/recherche/sousse" className="block hover:text-white">{t("footer.city.sousse")}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">{t("footer.workshops")}</h4>
              <div className="space-y-2">
                <Link href="/register" className="block hover:text-white">{t("footer.createshop")}</Link>
                <Link href="/login" className="block hover:text-white">{t("footer.login")}</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm">
            {t("footer.tagline")} — 📍 {t("footer.location")}
          </div>
        </div>
      </footer>
    </main>
  );
}
