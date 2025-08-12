import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../api";

export default function StepOneForm({ schema, onNext, formData, setFormData }) {
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");

  const aadhaarField = schema.find(f => f.name === "aadhaar") || { pattern: "^[0-9]{12}$", placeholder: "Enter 12-digit Aadhaar", label: "Aadhaar" };
  const otpField = schema.find(f => f.name === "otp") || { pattern: "^[0-9]{6}$", placeholder: "Enter OTP", label: "OTP" };

 const handleSend = async () => {
  setError("");
  const aadhaar = (formData.aadhaar || "").trim();
  if (!new RegExp(aadhaarField.pattern).test(aadhaar)) {
    setError("Invalid Aadhaar");
    return;
  }
  setLoadingSend(true);
  const res = await sendOtp(aadhaar);
  setLoadingSend(false);
  if (res.success) {
    setOtpSent(true);
    alert(`OTP : ${res.otp}`); // show OTP in alert
  } else {
    setError(res.message || "Failed to send OTP");
  }
};


  const handleVerify = async () => {
    setError("");
    const aadhaar = (formData.aadhaar || "").trim();
    const otp = (formData.otp || "").trim();
    if (!otp) { setError("Enter OTP"); return; }
    setLoadingVerify(true);
    const res = await verifyOtp(aadhaar, otp);
    setLoadingVerify(false);
    if (res.success) { setOtpVerified(true); alert("OTP verified, click on next button for further process"); }
    else setError(res.message || "OTP verification failed");
  };

  return (
    <div className="udyam-form">
      <div className="form-group">
        <label>{aadhaarField.label}</label>
        <input
          type="text"
          placeholder={aadhaarField.placeholder}
          value={formData.aadhaar || ""}
          required
          onChange={e => { setFormData({ ...formData, aadhaar: e.target.value }); setOtpSent(false); setOtpVerified(false); setError(""); }}
        />
      </div>

      <div style={{display:"flex", gap:8}}>
        <button type="button" onClick={handleSend} disabled={loadingSend}>{loadingSend ? "Sending..." : "Send OTP"}</button>
       
      </div>

      <div className="form-group">
        <label>{otpField.label}</label>
        <input
          type="text"
          placeholder={otpField.placeholder}
          value={formData.otp || ""}
          required
          onChange={e => setFormData({ ...formData, otp: e.target.value })}
        />
      </div>
      <div style={{display:"flex"}}>
         <button type="button" onClick={handleVerify} disabled={!otpSent || loadingVerify}>{loadingVerify ? "Verifying..." : "Verify OTP"}</button>
      </div>
     

      {error && <p className="error">{error}</p>}

     <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
  <button
    type="button"
    onClick={() => onNext()}
    disabled={!otpVerified}
  >
    Next
  </button>
</div>
    </div>
  );
}
