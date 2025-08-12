const express = require("express");
const router = express.Router();
const prisma = require("./db");
const { validateForm } = require("./validation");

// Use ONE shared OTP store
global.otpStore = global.otpStore || {}; // { aadhaar: { otp, expires } }

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { aadhaar } = req.body;

  if (!aadhaar || aadhaar.length !== 12) {
    return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with expiry (5 minutes)
  global.otpStore[aadhaar] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  console.log(`[OTP] Aadhaar ${aadhaar} -> ${otp}`);

  return res.json({ success: true, message: "OTP sent successfully", otp });
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { aadhaar, otp } = req.body;

  if (!aadhaar || !otp) {
    return res.status(400).json({ success: false, message: "Missing Aadhaar or OTP" });
  }

  const stored = global.otpStore[aadhaar];
  if (!stored) {
    return res.status(400).json({ success: false, message: "OTP not requested" });
  }

  if (Date.now() > stored.expires) {
    delete global.otpStore[aadhaar];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (String(otp) !== String(stored.otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // OTP matched → remove it
  delete global.otpStore[aadhaar];
  return res.json({ success: true, message: "OTP verified, click on next button for further process" });
});

// Form submission
router.post("/submit", async (req, res) => {
  try {
    const data = req.body || {};
    const validation = validateForm(data);
    if (!validation.valid) {
      return res.status(400).json({ ok: false, error: validation.error, field: validation.field });
    }

    const payload = {
      aadhaar: data.aadhaar ? String(data.aadhaar).trim() : null,
      pan: data.pan ? String(data.pan).trim().toUpperCase() : null,
      otp: data.otp ? String(data.otp).trim() : null,
      fullName: data.fullName ? String(data.fullName).trim() : null,
      email: data.email ? String(data.email).trim() : null,
      phone: data.phone ? String(data.phone).trim() : null
    };

    const created = await prisma.registration.create({ data: payload });
    res.json({ ok: true, data: created });
  } catch (err) {
    console.error("submit error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
