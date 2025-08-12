import React, { useEffect, useState } from "react";
import { fetchFormSchema } from "./api";
import ProgressTracker from "./components/ProgressTracker";
import StepOneForm from "./components/StepOneForm";
import StepTwoForm from "./components/StepTwoForm";

export default function App() {
  const [schema, setSchema] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchFormSchema().then(setSchema).catch(err => {
      console.error("Could not load schema:", err);
    });
  }, []);

  return (
    <div className="app-container">
      <h1>Udyam Registration (Steps 1 & 2)</h1>
      <ProgressTracker step={step} />
      {step === 1 && (
        <StepOneForm
          schema={schema}
          onNext={() => setStep(2)}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {step === 2 && (
        <StepTwoForm
          schema={schema}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
