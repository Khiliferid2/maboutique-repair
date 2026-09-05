"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

type Analytics = {
  revenueTrend: { date: string; montant: number }[];
  statusBreakdown: { name: string; value: number; color: string }[];
};

export default function AnalyticsCharts() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/boutique/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-line rounded-card p-5 h-64 animate-pulse" />
        <div className="bg-white border border-line rounded-card p-5 h-64 animate-pulse" />
      </div>
    );
  }

  const totalRepairs = data.statusBreakdown.reduce((s, x) => s + x.value, 0);

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-8">
      <div className="bg-white border border-line rounded-card p-5">
        <h3 className="font-display text-sm text-navy mb-4">
          Chiffre d'affaires — 14 derniers jours
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E8F1" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(0)} DT`, "Chiffre d'affaires"]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E3E8F1" }}
            />
            <Line type="monotone" dataKey="montant" stroke="#1E56E0" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-line rounded-card p-5">
        <h3 className="font-display text-sm text-navy mb-4">Statut des réparations</h3>
        {totalRepairs === 0 ? (
          <p className="text-sm text-inkSoft h-[200px] flex items-center justify-center">
            Aucune réparation enregistrée.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.statusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
              >
                {data.statusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E3E8F1" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
