import React, { useState } from "react";
import { submitForm } from "../api";

export default function StepTwoForm({ schema, formData, setFormData }) {
  const [message, setMessage] = useState("");
  const fields = schema.filter(f => !["aadhaar", "otp"].includes(f.name));
  const toRender = fields.length
    ? fields
    : [
        { name: "pan", label: "PAN", required: true, pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", placeholder: "ABCDE1234F" },
        { name: "fullName", label: "Full Name", required: false, placeholder: "" },
        { name: "email", label: "Email", required: false, pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", placeholder: "example@mail.com" },
        { name: "phone", label: "Phone", required: false, pattern: "^[0-9]{10}$", placeholder: "9876543210" }
      ];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side checks
    for (const f of toRender) {
      if (f.required && (!formData[f.name] || String(formData[f.name]).trim() === "")) {
        setMessage(`${f.label} is required`);
        return;
      }
      if (f.pattern && formData[f.name] && !new RegExp(f.pattern).test(String(formData[f.name]).trim())) {
        setMessage(`${f.label} format invalid`);
        return;
      }
    }

    const res = await submitForm(formData);
    if (res.ok) {
      setMessage("✅ Registration done successfully!");
    } else {
      setMessage(` ${res.error || "Submission failed"}`);
    }
  };

  return (
    <form className="udyam-form" onSubmit={handleSubmit}>
      {toRender.map(f => (
        <div key={f.name} className="form-group">
          <label>{f.label}</label>
          <input
            type={f.type || "text"}
            placeholder={f.placeholder || ""}
            value={formData[f.name] || ""}
            onChange={e => handleChange(f.name, e.target.value)}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}
