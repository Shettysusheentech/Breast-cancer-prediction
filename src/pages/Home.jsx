import React from "react";
import { Link } from "react-router-dom";
import data from "../data/model_export.json";
import StatCard from "../components/StatCard.jsx";

export default function Home() {
  const { dataset, models } = data;
  const bestModel = Object.entries(models).sort(
    (a, b) => b[1].metrics.accuracy - a[1].metrics.accuracy
  )[0];

  return (
    <div className="flex flex-col gap-8">
      <section className="panel rounded-lg p-8">
        <p className="text-xs text-clinicalDark uppercase tracking-wide font-semibold mb-3">
          College ML demo · Wisconsin Breast Cancer dataset
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight max-w-2xl">
          Classifying breast tumor samples as benign or malignant
        </h1>
        <p className="mt-4 text-inkMuted max-w-xl leading-relaxed">
          Two classic classifiers — K-Nearest Neighbors and a Support Vector Machine — trained on
          nine cell-sample measurements from the UCI Breast Cancer Wisconsin (Original) dataset.
          Both models run their real, fitted decision logic directly in your browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="px-5 py-2.5 bg-clinical text-white text-sm font-medium rounded hover:bg-clinicalDark transition-colors"
          >
            Try a Prediction
          </Link>
          <Link
            to="/dataset"
            className="px-5 py-2.5 border border-line text-sm font-medium rounded hover:border-clinical transition-colors"
          >
            View Dataset
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Samples" value={dataset.n_samples_clean} sub={`of ${dataset.n_samples_raw} raw`} />
        <StatCard label="Features" value={dataset.n_features} sub="cell-sample measurements" />
        <StatCard
          label="Models"
          value={Object.keys(models).length}
          sub={Object.keys(models).join(" · ")}
        />
        <StatCard
          label="Best Accuracy"
          value={`${(bestModel[1].metrics.accuracy * 100).toFixed(1)}%`}
          sub={bestModel[0]}
          accent="clinical"
        />
      </section>

      <section className="grid md:grid-cols-4 gap-4">
        {[
          { to: "/dataset", title: "Dataset Overview", desc: "Class balance, features, sample rows" },
          { to: "/performance", title: "Model Performance", desc: "Accuracy, confusion matrix, metrics" },
          { to: "/predict", title: "Prediction", desc: "Enter measurements, get a live prediction" },
          { to: "/results", title: "Results", desc: "Summary, comparison, and limitations" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="panel rounded-lg p-4 hover:border-clinical transition-colors group"
          >
            <p className="font-semibold text-sm group-hover:text-clinicalDark transition-colors">
              {c.title}
            </p>
            <p className="text-xs text-inkMuted mt-1">{c.desc}</p>
          </Link>
        ))}
      </section>

      <section className="panel rounded-lg p-5 border-l-4 border-l-clinical">
        <p className="text-sm text-inkMuted leading-relaxed">
          <strong className="text-ink">About this demo:</strong> this is a college-level machine
          learning project, not a diagnostic tool. See the{" "}
          <Link to="/results" className="text-clinicalDark underline">
            Results page
          </Link>{" "}
          for a plain explanation of what these models can and can't tell you.
        </p>
      </section>
    </div>
  );
}
