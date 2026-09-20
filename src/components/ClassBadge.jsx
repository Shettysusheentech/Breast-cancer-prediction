import React from "react";

export default function ClassBadge({ classValue, size = "md" }) {
  const isBenign = classValue === 2;
  const label = isBenign ? "Benign" : "Malignant";
  const color = isBenign ? "#16A34A" : "#DC2626";
  const sizeClasses = size === "lg" ? "text-base px-3.5 py-1.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses}`}
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label} (class {classValue})
    </span>
  );
}
