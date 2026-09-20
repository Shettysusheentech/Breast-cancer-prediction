import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import DatasetOverview from "./pages/DatasetOverview.jsx";
import ModelPerformance from "./pages/ModelPerformance.jsx";
import Prediction from "./pages/Prediction.jsx";
import Results from "./pages/Results.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dataset" element={<DatasetOverview />} />
          <Route path="/performance" element={<ModelPerformance />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      <footer className="border-t border-line py-6 mt-8">
        <div className="max-w-6xl mx-auto px-5 md:px-8 text-xs text-inkMuted">
          College ML demo — not a medical device. See the Results page for limitations.
        </div>
      </footer>
    </div>
  );
}
