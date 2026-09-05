"use client";

import { useState } from "react";

export default function FaqAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white border border-line rounded-card overflow-hidden">
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-semibold text-navy text-sm">{item.q}</span>
            <span className="text-inkSoft text-lg shrink-0 ml-3">
              {open === idx ? "−" : "+"}
            </span>
          </button>
          {open === idx && (
            <div className="px-5 pb-4 text-sm text-inkSoft animate-in">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
