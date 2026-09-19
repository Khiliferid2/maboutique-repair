"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { SkeletonCard } from "@/components/Skeleton";
import { SERVICES_CATALOGUE, MARQUES } from "@/lib/services-catalog";
import { GOUVERNORATS, TUNISIA_LOCATIONS } from "@/lib/tunisia-locations";
import { useLanguage } from "@/lib/language-context";

type Result = {
  id: string;
  nom: string;
  ville: string | null;
  gouvernorat: string | null;
  delegation: string | null;
  adresse: string | null;
  telephone: string | null;
  whatsapp: string | null;
  plan: string;
  verified: boolean;
  horaires: string | null;
  services: string[];
  logoUrl?: string | null;
  distanceKm: number | null;
  avgNote: number | null;
  avisCount: number;
};

const planBadge: Record<string, string> = {
  premium: "bg-orange text-navy",
  pro: "bg-blue text-white",
  free: "bg-line text-inkSoft",
};
const planLabel: Record<string, string> = {
  premium: "⭐ Premium",
  pro: "Pro",
  free: "",
};

export default function RecherchePage() {
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const [service, setService] = useState("");
  const [gouvernorat, setGouvernorat] = useState("");
  const [delegation, setDelegation] = useState("");
  const [marque, setMarque] = useState("");
  const [minNote, setMinNote] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "done" | "denied">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  async function runSearch(lat?: number, lng?: number) {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (service) params.set("service", service);
    if (gouvernorat) params.set("gouvernorat", gouvernorat);
    if (delegation) params.set("delegation", delegation);
    if (marque) params.set("marque", marque);
    if (minNote) params.set("minNote", minNote);
    if (lat != null && lng != null) {
      params.set("lat", String(lat));
      params.set("lng", String(lng));
    }
    const res = await fetch(`/api/search?${params.toString()}`);
    setResults(await res.json());
    setLoading(false);
  }

  function findNearMe() {
    if (!navigator.geolocation) {
      setLocStatus("denied");
      runSearch();
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLocStatus("done");
        runSearch(lat, lng);
      },
      () => {
        setLocStatus("denied");
        runSearch();
      }
    );
  }

  function handleTextSearch(e: React.FormEvent) {
    e.preventDefault();
    runSearch(coords?.lat, coords?.lng);
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="bg-white border-b border-line sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-navy">
            <Logo size={32} />
            MaBoutique Repair
          </Link>
          <Link href="/register" className="text-sm font-semibold text-blue">
            {t("search.addShop")}
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl text-navy mb-2">{t("search.title")}</h1>
        <p className="text-inkSoft mb-6">{t("search.subtitle")}</p>

        <form onSubmit={handleTextSearch} className="flex flex-wrap gap-3 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-[2] min-w-[240px]"
          />
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-1 min-w-[180px]"
          >
            <option value="">{t("search.allServices")}</option>
            {SERVICES_CATALOGUE.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-1 min-w-[150px]"
          >
            <option value="">{t("search.allBrands")}</option>
            {MARQUES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={gouvernorat}
            onChange={(e) => {
              setGouvernorat(e.target.value);
              setDelegation("");
            }}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-1 min-w-[160px]"
          >
            <option value="">{t("search.allGouvernorats")}</option>
            {GOUVERNORATS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={delegation}
            onChange={(e) => setDelegation(e.target.value)}
            disabled={!gouvernorat}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-1 min-w-[160px] disabled:opacity-50"
          >
            <option value="">{t("search.allDelegations")}</option>
            {(TUNISIA_LOCATIONS[gouvernorat] || []).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={minNote}
            onChange={(e) => setMinNote(e.target.value)}
            className="border border-line rounded-lg px-4 py-2.5 text-sm bg-white flex-1 min-w-[140px]"
          >
            <option value="">{t("search.minRating")}</option>
            <option value="4">★ 4+</option>
            <option value="3">★ 3+</option>
            <option value="2">★ 2+</option>
          </select>
          <button
            type="submit"
            className="bg-blue text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            🔍 {t("search.button")}
          </button>
          <button
            type="button"
            onClick={findNearMe}
            className="bg-navy text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            📍 {t("search.nearMe")}
          </button>
        </form>

        {locStatus === "loading" && (
          <p className="text-xs text-inkSoft mb-4">{t("search.locating")}</p>
        )}
        {locStatus === "denied" && (
          <p className="text-xs text-red mb-4">{t("search.locationDenied")}</p>
        )}
        {locStatus === "done" && (
          <p className="text-xs text-green mb-4">📍 {t("search.locationDone")}</p>
        )}

        {results === null && !loading && (
          <p className="text-sm text-inkSoft">{t("search.prompt")}</p>
        )}
        {loading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {results && results.length === 0 && (
          <p className="text-sm text-inkSoft">{t("search.noResults")}</p>
        )}

        <div className="space-y-4">
          {results?.map((r, idx) => (
            <Link
              key={r.id}
              href={`/boutique/${r.id}`}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="animate-in block bg-white border border-line rounded-card p-5 hover:border-blue hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  {r.logoUrl ? (
                    <img src={r.logoUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-line shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-paper border border-line flex items-center justify-center text-xl shrink-0">🏪</div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-display text-lg text-navy">{r.nom}</h3>
                      {planLabel[r.plan] && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${planBadge[r.plan]}`}>
                          {planLabel[r.plan]}
                        </span>
                      )}
                      {r.verified && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green text-white flex items-center gap-1">
                          ✅ {t("search.verified")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-inkSoft mb-2">
                      📍 {r.delegation ? `${r.delegation}, ` : ""}{r.gouvernorat || r.ville || "Tunisie"}
                      {r.distanceKm != null && ` · ${r.distanceKm.toFixed(1)} km`}
                      {r.avgNote != null && (
                        <> · <span className="text-orange">★</span> {r.avgNote.toFixed(1)} ({r.avisCount})</>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.services.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="text-[11px] bg-paper border border-line px-2 py-1 rounded-full text-inkSoft"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {r.telephone && (
                    <span className="text-xs font-semibold text-navy">📞 {r.telephone}</span>
                  )}
                  {r.whatsapp && (
                    <span className="text-xs font-semibold text-green">💬 {t("search.whatsapp")}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
