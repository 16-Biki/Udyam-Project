const API_BASE = "https://udyam-project.onrender.com";

export async function fetchFormSchema() {
  const res = await fetch(`${API_BASE}/schema/formSchema.json`);
  if (!res.ok) throw new Error("Failed to fetch form schema");
  return res.json();
}

export async function sendOtp(aadhaar) {
  const res = await fetch(`${API_BASE}/api/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aadhaar })
  });
  return res.json();
}

export async function verifyOtp(aadhaar, otp) {
  const res = await fetch(`${API_BASE}/api/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ aadhaar, otp })
  });
  return res.json();
}

export async function submitForm(data) {
  const res = await fetch(`${API_BASE}/api/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
