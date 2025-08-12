const fs = require("fs");
const path = require("path");
const schemaPath = path.join(__dirname, "..", "schema", "formSchema.json");
let formSchema = [];
try {
  formSchema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
} catch (err) {
  formSchema = [];
}

function validateForm(data) {
  for (const field of formSchema) {
    const value = data[field.name];
    if (field.required && (value === undefined || String(value).trim() === "")) {
      return { valid: false, error: `${field.label || field.name} is required`, field: field.name };
    }
    if (field.pattern && value) {
      const re = new RegExp(field.pattern);
      if (!re.test(String(value).trim())) {
        return { valid: false, error: `${field.label || field.name} is invalid`, field: field.name };
      }
    }
  }

  // fallback checks
  if (data.aadhaar && !/^[0-9]{12}$/.test(String(data.aadhaar).trim())) {
    return { valid: false, error: "Aadhaar must be 12 digits", field: "aadhaar" };
  }
  if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(data.pan).trim().toUpperCase())) {
    return { valid: false, error: "PAN format invalid", field: "pan" };
  }

  return { valid: true };
}

module.exports = { validateForm, formSchema };
