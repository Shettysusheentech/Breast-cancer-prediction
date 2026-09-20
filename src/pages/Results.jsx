import React from "react";
import data from "../data/model_export.json";
import StatCard from "../components/StatCard.jsx";

export default function Results() {
  const { models, dataset, split } = data;
  const modelNames = Object.keys(models);
  const sorted = modelNames
    .map((name) => ({ name, acc: models[name].metrics.accuracy }))
    .sort((a, b) => b.acc - a.acc);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Results</h1>
        <p className="text-inkMuted text-sm">
          A plain-language summary of what these two models achieved, and what this demo does and
          doesn't show.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sorted.map((m, i) => (
          <StatCard
            key={m.name}
            label={i === 0 ? `${m.name} (best)` : m.name}
            value={`${(m.acc * 100).toFixed(1)}%`}
            sub="test accuracy"
            accent={i === 0 ? "clinical" : "ink"}
          />
        ))}
        <StatCard label="Samples used" value={dataset.n_samples_clean} />
        <StatCard label="Held-out test rows" value={split.test_size} />
      </div>

      <div className="panel rounded-lg p-6">
        <h3 className="font-semibold text-base mb-3">Summary</h3>
        <p className="text-sm text-inkMuted leading-relaxed">
          Both the K-Nearest Neighbors (k=5) and Support Vector Machine (RBF kernel) classifiers
          were trained on the same {split.train_size} rows and evaluated on the same held-out{" "}
          {split.test_size} rows, so their accuracy numbers are directly comparable.{" "}
          {sorted[0].name} scored slightly {sorted[0].acc === sorted[1]?.acc ? "the same as" : "higher than"}{" "}
          {sorted[1]?.name} on this split ({(sorted[0].acc * 100).toFixed(1)}% vs{" "}
          {sorted[1] ? (sorted[1].acc * 100).toFixed(1) : "—"}%). Both models agree on the vast
          majority of test cases — the confusion matrices on the Model Performance page show where
          they disagree, mostly borderline cases between benign and malignant.
        </p>
      </div>

      <div className="panel rounded-lg p-6 border-l-4 border-l-malignant">
        <h3 className="font-semibold text-base mb-3">Limitations</h3>
        <ul className="text-sm text-inkMuted leading-relaxed list-disc pl-5 flex flex-col gap-2">
          <li>
            <strong className="text-ink">This is not a diagnostic tool.</strong> It's a college-level
            demonstration of two classic ML algorithms, trained on a small, decades-old public
            dataset (699 samples, collected in the early 1990s at the University of Wisconsin).
          </li>
          <li>
            <strong className="text-ink">Features aren't self-measurable.</strong> The nine inputs
            (clump thickness, cell uniformity, etc.) come from a lab technician's visual scoring of
            a biopsy sample under a microscope — they aren't something a patient or general user can
            provide themselves.
          </li>
          <li>
            <strong className="text-ink">No probability calibration for the SVM.</strong> The SVM
            was trained without <code className="lab-digits">probability=True</code> (matching the
            original notebook), so it reports a raw decision-function distance, not a calibrated
            confidence percentage.
          </li>
          <li>
            <strong className="text-ink">Small test set.</strong> Accuracy is measured on{" "}
            {split.test_size} held-out samples — a single random split. Real-world performance on
            new data, from a different hospital or imaging process, could differ.
          </li>
          <li>
            <strong className="text-ink">No feature scaling was applied</strong>, matching the
            original notebook's preprocessing exactly (it imports{" "}
            <code className="lab-digits">StandardScaler</code> but never actually calls it). Since
            every feature already shares the same 1–10 scale, this doesn't meaningfully hurt either
            model here — but it's worth knowing this step was skipped, not silently added by this
            frontend.
          </li>
        </ul>
      </div>
    </div>
  );
}
