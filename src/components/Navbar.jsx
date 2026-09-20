import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/dataset", label: "Dataset Overview" },
  { to: "/performance", label: "Model Performance" },
  { to: "/predict", label: "Prediction" },
  { to: "/results", label: "Results" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-panel border-b border-line sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔬</span>
            <div>
              <p className="font-semibold text-ink leading-none">Breast Cancer Detection</p>
              <p className="text-[11px] text-inkMuted lab-digits mt-0.5">
                KNN &amp; SVM · scikit-learn
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded transition-colors ${
                    isActive
                      ? "bg-clinical/10 text-clinicalDark"
                      : "text-inkMuted hover:text-ink hover:bg-paper"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden border border-line rounded px-2.5 py-1.5 text-sm"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <nav className="md:hidden flex flex-col pb-3 gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm rounded ${
                    isActive ? "bg-clinical/10 text-clinicalDark font-medium" : "text-inkMuted"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
