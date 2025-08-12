import React from "react";
import "../styles/form.css";

export default function ProgressTracker({ step }) {
  return (
    <div className="progress-tracker">
      <div className={`step ${step >= 1 ? "active" : ""}`}>Step 1: Aadhaar</div>
      <div className={`step ${step >= 2 ? "active" : ""}`}>Step 2: PAN</div>
    </div>
  );
}
