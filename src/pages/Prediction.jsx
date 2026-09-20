import React, { useState } from "react";
import data from "../data/model_export.json";
import ClassBadge from "../components/ClassBadge.jsx";
import { knnPredict } from "../ml/knn.js";
import { svmPredict } from "../ml/svm.js";

const { feature_names, models } = data;

const defaultValues = Object.fromEntries(feature_names.map((f) => [f, 4]));

export default function Prediction() {
  const [values, setValues] = useState(defaultValues);
  const [modelChoice, setModelChoice] = useState("KNN");
  const [result, setResult] = useState(null);

  const updateValue = (feature, val) => {
    setValues((v) => ({ ...v, [feature]: val }));
    setResult(null);
  };

  const handlePredict = () => {
    const point = feature_names.map((f) => Number(values[f]));

    if (modelChoice === "KNN") {
      const { xTrain, yTrain } = { xTrain: models.KNN.x_train, yTrain: models.KNN.y_train };
      const out = knnPredict(point, xTrain, yTrain, models.KNN.k);
      setResult({
        model: "KNN",
        prediction: out.prediction,
        confidencePct: (out.agreeingNeighbors / out.totalNeighbors) * 100,
        confidenceLabel: `${out.agreeingNeighbors} of ${out.totalNeighbors} nearest neighbors agree`,
      });
    } else {
      const out = svmPredict(point, models.SVM);
      setResult({
        model: "SVM",
        prediction: out.prediction,
        decision: out.decision,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Prediction</h1>
        <p className="text-inkMuted text-sm">
          Set the nine cell-sample measurements (1–10 scale, matching the dataset), pick a model,
          and run a real prediction — entirely in your browser.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="panel rounded-lg p-6">
          <div className="flex flex-col gap-5">
            {feature_names.map((f) => (
              <label key={f} className="block">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium capitalize">{f.replace(/_/g, " ")}</span>
                  <span className="lab-digits text-sm text-clinicalDark">{values[f]}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={values[f]}
                  onChange={(e) => updateValue(f, Number(e.target.value))}
                  className="w-full"
                />
              </label>
            ))}

            <div>
              <span className="text-sm font-medium block mb-2">Model</span>
              <div className="flex gap-2">
                {["KNN", "SVM"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setModelChoice(m);
                      setResult(null);
                    }}
                    className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                      modelChoice === m
                        ? "bg-clinical text-white border-clinical"
                        : "border-line text-inkMuted hover:border-clinical"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePredict}
              className="w-full py-2.5 bg-clinical text-white font-medium rounded text-sm hover:bg-clinicalDark transition-colors"
            >
              Predict
            </button>
          </div>
        </div>

        <div className="panel rounded-lg p-6 flex flex-col">
          <h3 className="font-semibold text-sm mb-4">Result</h3>

          {!result ? (
            <div className="flex-1 flex items-center justify-center text-center py-10">
              <p className="text-sm text-inkMuted max-w-xs">
                Set the measurements on the left and press Predict.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs text-inkMuted uppercase tracking-wide mb-2">Predicted class</p>
                <ClassBadge classValue={result.prediction} size="lg" />
              </div>

              {result.model === "KNN" ? (
                <div>
                  <p className="text-xs text-inkMuted uppercase tracking-wide mb-1">Confidence</p>
                  <p className="lab-digits text-2xl font-semibold text-clinicalDark">
                    {result.confidencePct.toFixed(0)}%
                  </p>
                  <p className="text-xs text-inkMuted mt-1">{result.confidenceLabel}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-inkMuted uppercase tracking-wide mb-1">
                    Decision-function value
                  </p>
                  <p className="lab-digits text-2xl font-semibold text-clinicalDark">
                    {result.decision.toFixed(3)}
                  </p>
                  <p className="text-xs text-inkMuted mt-1">
                    Distance from the decision boundary — this SVM wasn't fit with{" "}
                    <code>probability=True</code>, so it doesn't expose a calibrated confidence
                    percentage. Further from zero (either direction) means a more confident call,
                    not a probability.
                  </p>
                </div>
              )}

              <div className="bg-paper rounded p-3 text-xs text-inkMuted leading-relaxed border border-line">
                <strong className="text-ink">In plain terms:</strong> the {result.model} model
                compared these nine measurements to patterns it learned from real biopsy samples
                and classified this sample as{" "}
                <strong>{result.prediction === 2 ? "benign" : "malignant"}</strong>. This is a
                statistical pattern match, not a medical diagnosis — see the Results page for the
                model's real accuracy and its limitations.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
