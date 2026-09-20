import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import data from "../data/model_export.json";
import StatCard from "../components/StatCard.jsx";
import ConfusionMatrix from "../components/ConfusionMatrix.jsx";

const MODEL_COLORS = { KNN: "#0891B2", SVM: "#7C3AED" };

export default function ModelPerformance() {
  const { models, split, dataset } = data;
  const modelNames = Object.keys(models);

  const accuracyData = modelNames.map((name) => ({
    name,
    accuracy: Number((models[name].metrics.accuracy * 100).toFixed(1)),
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Model Performance</h1>
        <p className="text-inkMuted text-sm">
          Both models were trained on the same {split.train_size}-row training split and evaluated
          on the same {split.test_size}-row held-out test split (test_size={split.test_ratio},
          random_state={split.random_state}) — an apples-to-apples comparison.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Dataset size" value={dataset.n_samples_clean} />
        <StatCard label="Feature count" value={dataset.n_features} />
        {modelNames.map((name) => (
          <StatCard
            key={name}
            label={`${name} Accuracy`}
            value={`${(models[name].metrics.accuracy * 100).toFixed(1)}%`}
            accent="clinical"
          />
        ))}
      </div>

      <div className="panel rounded-lg p-5">
        <h3 className="font-semibold text-sm mb-1">Accuracy comparison</h3>
        <p className="text-xs text-inkMuted mb-3">On the held-out test set</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={accuracyData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#DCE3E8" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5A6B7D" }} tickLine={false} axisLine={{ stroke: "#DCE3E8" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#5A6B7D" }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 4 }} />
            <Bar dataKey="accuracy" radius={[3, 3, 0, 0]}>
              {accuracyData.map((entry) => (
                <Cell key={entry.name} fill={MODEL_COLORS[entry.name] || "#0891B2"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modelNames.map((name) => (
          <div key={name} className="panel rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-1">{name} — Confusion Matrix</h3>
            <p className="text-xs text-inkMuted mb-3">Rows: actual · Columns: predicted</p>
            <ConfusionMatrix matrix={models[name].metrics.confusion_matrix} />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modelNames.map((name) => {
          const report = models[name].metrics.classification_report;
          return (
            <div key={name} className="panel rounded-lg p-5">
              <h3 className="font-semibold text-sm mb-3">{name} — Classification Report</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 text-[11px] text-inkMuted uppercase">Class</th>
                    <th className="text-right py-2 text-[11px] text-inkMuted uppercase">Precision</th>
                    <th className="text-right py-2 text-[11px] text-inkMuted uppercase">Recall</th>
                    <th className="text-right py-2 text-[11px] text-inkMuted uppercase">F1</th>
                    <th className="text-right py-2 text-[11px] text-inkMuted uppercase">Support</th>
                  </tr>
                </thead>
                <tbody>
                  {["2", "4"].map((cls) => {
                    const row = report[cls];
                    return (
                      <tr key={cls} className="border-b border-line/50">
                        <td className="py-2">{cls === "2" ? "Benign" : "Malignant"}</td>
                        <td className="text-right lab-digits">{row.precision.toFixed(2)}</td>
                        <td className="text-right lab-digits">{row.recall.toFixed(2)}</td>
                        <td className="text-right lab-digits">{row["f1-score"].toFixed(2)}</td>
                        <td className="text-right lab-digits text-inkMuted">{row.support}</td>
                      </tr>
                    );
                  })}
                  <tr className="text-inkMuted">
                    <td className="py-2 text-xs uppercase">Weighted avg</td>
                    <td className="text-right lab-digits">{report["weighted avg"].precision.toFixed(2)}</td>
                    <td className="text-right lab-digits">{report["weighted avg"].recall.toFixed(2)}</td>
                    <td className="text-right lab-digits">{report["weighted avg"]["f1-score"].toFixed(2)}</td>
                    <td className="text-right lab-digits">{report["weighted avg"].support}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
