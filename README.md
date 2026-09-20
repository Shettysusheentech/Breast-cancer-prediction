# Breast Cancer Detection — Frontend

A college-level machine learning demo built around your existing breast
cancer classification notebook. **The dataset, preprocessing, models, and
results are unchanged from your notebook** — this only adds a browser UI on
top of them. Everything runs client-side: no backend, no database.

## What this is built on

Your notebook loads the UCI Breast Cancer Wisconsin (Original) dataset,
drops the `id` column and any rows with missing values (`bare_nuclei`
sometimes has `?`), then trains two classifiers on the same 80/20 split:

- **K-Nearest Neighbors** (`n_neighbors=5`)
- **Support Vector Machine** (`SVC()`, default RBF kernel)

Neither model uses feature scaling — your notebook imports
`StandardScaler` but never actually calls it, so this frontend matches that
exactly rather than "fixing" it.

## How prediction works without a backend

This app doesn't call an API to make predictions — it re-implements each
model's actual fitted decision logic directly in JavaScript, using values
exported from the real trained models (see `src/data/model_export.json`):

- **KNN** (`src/ml/knn.js`): stores the real training set your model was
  fit on, and at prediction time finds the 5 nearest neighbors by Euclidean
  distance and takes a majority vote — exactly what
  `KNeighborsClassifier.predict()` does internally.
- **SVM** (`src/ml/svm.js`): stores the fitted model's support vectors,
  dual coefficients, intercept, and gamma, and evaluates the same RBF
  kernel decision function scikit-learn uses:
  `sign(Σ dual_coef_i · exp(-gamma · ||sv_i - x||²) + intercept)`.

Both were checked against the real Python model's own `predict()` output on
the full test set before being exported — the JavaScript versions matched
scikit-learn to floating-point precision (differences around 1e-15), so
these are faithful ports, not re-derivations or approximations.

## Where the dataset came from

`archive.ics.uci.edu` (the URL in your original notebook) wasn't reachable
while building this, so the same dataset was sourced from a GitHub mirror
with an identical schema instead — it's the same 699-row UCI Breast Cancer
Wisconsin (Original) dataset, same columns, same values. If you'd rather
regenerate `model_export.json` from the exact UCI URL yourself, see
"Regenerating the model export" below.

## Pages

- **Home** — project overview, headline stats
- **Dataset Overview** — class balance, feature descriptions, a paginated
  table of the cleaned data
- **Model Performance** — accuracy comparison, confusion matrix and full
  classification report for each model
- **Prediction** — nine sliders (1–10 scale) for the real feature set, a
  KNN/SVM toggle, and a live in-browser prediction with a confidence
  measure and a plain-language explanation
- **Results** — a written summary comparing both models, and an explicit
  **Limitations** section

## Installation

Requires Node.js 18+.

```bash
npm install
```

## Running it

```bash
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview   # serve the build locally to check it
```

## Project structure

```
src/
  components/
    Navbar.jsx            Top navigation
    StatCard.jsx            Small metric card
    ClassBadge.jsx            Benign/Malignant pill
    ConfusionMatrix.jsx        Confusion matrix grid
  pages/
    Home.jsx
    DatasetOverview.jsx
    ModelPerformance.jsx
    Prediction.jsx
    Results.jsx
  ml/
    knn.js                  KNN prediction (JS port of the fitted sklearn model)
    svm.js                    RBF-kernel SVM decision function (JS port)
  data/
    model_export.json         Dataset + both fitted models' parameters
  App.jsx
  main.jsx
  index.css
```

## Regenerating the model export

If you want to retrain from the exact UCI URL (or new data) and regenerate
`src/data/model_export.json`, run equivalent Python to your notebook, then
export:

```python
import json
export = {
    "feature_names": feature_names,
    "class_labels": {"2": "Benign", "4": "Malignant"},
    "dataset": {
        "n_samples_raw": 699,
        "n_samples_clean": len(df),
        "n_dropped_missing": 699 - len(df),
        "n_features": len(feature_names),
        "class_counts": df["class"].value_counts().to_dict(),
        "rows": df[feature_names + ["class"]].to_dict(orient="records"),
    },
    "split": {"train_size": len(x_train), "test_size": len(x_test), "random_state": 42, "test_ratio": 0.2},
    "models": {
        "KNN": {
            "type": "knn", "k": 5,
            "x_train": x_train.tolist(), "y_train": y_train.tolist(),
            "metrics": {...},  # accuracy, classification_report, confusion_matrix
        },
        "SVM": {
            "type": "svm_rbf",
            "support_vectors": svm.support_vectors_.tolist(),
            "dual_coef": svm.dual_coef_[0].tolist(),
            "intercept": float(svm.intercept_[0]),
            "gamma": float(svm._gamma),
            "classes": svm.classes_.tolist(),
            "metrics": {...},
        },
    },
}
json.dump(export, open("src/data/model_export.json", "w"))
```

Then restart `npm run dev`.

## Limitations

See the in-app **Results** page for the full list — in short: this is a
teaching demo on a small, decades-old dataset with features that come from
a lab technician's microscope scoring, not something a general user can
measure themselves. It is not a diagnostic tool.
