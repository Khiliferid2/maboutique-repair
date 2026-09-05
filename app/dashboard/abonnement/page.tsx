"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PLAN_PRICES, PLAN_FEATURES } from "@/lib/plans";

export default function AbonnementPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadPlan() {
    const res = await fetch("/api/boutique");
    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      // Si on revient d'un paiement Konnect, on vérifie le statut en fallback
      // (au cas où le webhook n'aurait pas encore été traité)
      if (searchParams.get("paiement") === "succes") {
        const res = await fetch("/api/boutique/subscribe/verify", { method: "POST" });
        const data = await res.json();
        if (data.plan) {
          setMessage(`Félicitations, votre abonnement ${data.plan.toUpperCase()} est actif ! 🎉`);
        }
      } else if (searchParams.get("paiement") === "echec") {
        setError("Le paiement n'a pas abouti. Vous pouvez réessayer.");
      }
      await loadPlan();
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upgrade(target: "pro" | "premium") {
    setUpgrading(target);
    setError("");
    const res = await fetch("/api/boutique/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: target }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Une erreur est survenue.");
      setUpgrading(null);
      return;
    }
    window.location.href = data.payUrl;
  }

  if (loading) return <p className="text-sm text-inkSoft">Chargement...</p>;

  const plans: { key: "free" | "pro" | "premium"; label: string }[] = [
    { key: "free", label: "Free" },
    { key: "pro", label: "Pro" },
    { key: "premium", label: "Premium" },
  ];

  return (
    <div>
      <h1 className="font-display text-xl text-navy mb-1">Mon abonnement</h1>
      <p className="text-sm text-inkSoft mb-6">
        Plan actuel :{" "}
        <span className="font-bold text-navy uppercase">{plan}</span>
      </p>

      {message && (
        <p className="mb-4 text-sm text-green bg-green/10 border border-green/30 rounded-lg px-4 py-2">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red bg-red/10 border border-red/30 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map(({ key, label }) => {
          const isCurrent = plan === key;
          const price = key === "free" ? 0 : PLAN_PRICES[key];
          return (
            <div
              key={key}
              className={`bg-white border rounded-card p-6 ${
                isCurrent ? "border-blue ring-2 ring-blue/20" : "border-line"
              }`}
            >
              <h3 className="font-display text-base text-navy mb-1">{label}</h3>
              <div className="font-mono text-2xl font-bold text-navy mb-4">
                {price === 0 ? "Gratuit" : `${price} DT`}
                {price > 0 && <span className="text-sm font-normal text-inkSoft"> /mois</span>}
              </div>
              <ul className="space-y-1.5 mb-5 text-sm text-inkSoft">
                {PLAN_FEATURES[key].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-green">✓</span> {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="text-center text-sm font-semibold text-blue py-2.5">
                  Votre plan actuel
                </div>
              ) : key === "free" ? null : (
                <button
                  onClick={() => upgrade(key)}
                  disabled={upgrading !== null}
                  className="w-full bg-orange text-navy font-bold py-2.5 rounded-lg disabled:opacity-60"
                >
                  {upgrading === key ? "Redirection..." : `Passer à ${label}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
