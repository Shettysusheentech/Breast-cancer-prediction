import React from "react";

const accentMap = {
  clinical: "text-clinicalDark",
  benign: "text-benign",
  malignant: "text-malignant",
  ink: "text-ink",
};

export default function StatCard({ label, value, sub, accent = "ink" }) {
  return (
    <div className="panel rounded-lg px-5 py-4 flex flex-col gap-1">
      <span className="text-[11px] text-inkMuted uppercase tracking-wide">{label}</span>
      <span className={`lab-digits text-3xl font-semibold ${accentMap[accent]}`}>{value}</span>
      {sub && <span className="text-xs text-inkMuted">{sub}</span>}
    </div>
  );
}
