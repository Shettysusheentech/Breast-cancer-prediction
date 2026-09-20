import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import data from "../data/model_export.json";
import StatCard from "../components/StatCard.jsx";
import ClassBadge from "../components/ClassBadge.jsx";

const FEATURE_DESCRIPTIONS = {
  clump_thickness: "Thickness of the cell clump, scale 1–10",
  uniform_cell_size: "Uniformity of cell size, scale 1–10",
  uniform_cell_shape: "Uniformity of cell shape, scale 1–10",
  marginal_adhesion: "How much cells stick together at the edges, scale 1–10",
  single_epithelial_size: "Size of single epithelial cells, scale 1–10",
  bare_nuclei: "Proportion of nuclei not surrounded by cytoplasm, scale 1–10",
  bland_chromatin: "Texture of chromatin in the nucleus, scale 1–10",
  normal_nucleoli: "How normal-looking the nucleoli are, scale 1–10",
  mitoses: "Rate of cell division observed, scale 1–10",
};

const PAGE_SIZE = 15;

export default function DatasetOverview() {
  const { dataset } = data;
  const [page, setPage] = useState(1);

  const classData = Object.entries(dataset.class_counts).map(([cls, count]) => ({
    name: cls === "2" ? "Benign" : "Malignant",
    value: count,
    color: cls === "2" ? "#16A34A" : "#DC2626",
  }));

  const totalPages = Math.ceil(dataset.rows.length / PAGE_SIZE);
  const pageRows = dataset.rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Dataset Overview</h1>
        <p className="text-inkMuted text-sm">
          UCI Breast Cancer Wisconsin (Original) dataset — 699 samples collected from digitized
          images of fine needle aspirate (FNA) biopsies.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Raw samples" value={dataset.n_samples_raw} />
        <StatCard label="Dropped (missing values)" value={dataset.n_dropped_missing} accent="malignant" />
        <StatCard label="Used for training/testing" value={dataset.n_samples_clean} accent="clinical" />
        <StatCard label="Features" value={dataset.n_features} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="panel rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-1">Class distribution</h3>
          <p className="text-xs text-inkMuted mb-3">After dropping rows with missing values</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={classData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {classData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-1">Features used</h3>
          <p className="text-xs text-inkMuted mb-3">
            Every feature is on a 1–10 scale, scored from the biopsy sample.
          </p>
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
            {dataset.rows[0] &&
              Object.keys(FEATURE_DESCRIPTIONS).map((f) => (
                <div key={f} className="flex justify-between gap-3 text-xs border-b border-line/60 pb-2">
                  <span className="font-medium capitalize whitespace-nowrap">
                    {f.replace(/_/g, " ")}
                  </span>
                  <span className="text-inkMuted text-right">{FEATURE_DESCRIPTIONS[f]}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="panel rounded-lg p-5">
        <h3 className="font-semibold text-sm mb-1">Sample rows</h3>
        <p className="text-xs text-inkMuted mb-3">{dataset.rows.length} rows total, after cleaning</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-line">
                {Object.keys(FEATURE_DESCRIPTIONS).map((f) => (
                  <th key={f} className="text-left px-3 py-2 text-[11px] text-inkMuted uppercase whitespace-nowrap">
                    {f.replace(/_/g, " ")}
                  </th>
                ))}
                <th className="text-left px-3 py-2 text-[11px] text-inkMuted uppercase">Class</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, i) => (
                <tr key={i} className="border-b border-line/50 hover:bg-paper/60">
                  {Object.keys(FEATURE_DESCRIPTIONS).map((f) => (
                    <td key={f} className="px-3 py-2 lab-digits">
                      {row[f]}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <ClassBadge classValue={row.class} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-inkMuted">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, dataset.rows.length)} of{" "}
            {dataset.rows.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-line rounded disabled:opacity-30 hover:border-clinical transition-colors"
            >
              Prev
            </button>
            <span className="lab-digits text-xs">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-line rounded disabled:opacity-30 hover:border-clinical transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
