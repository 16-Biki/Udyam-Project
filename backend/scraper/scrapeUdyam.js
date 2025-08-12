
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();

    console.log("Opening Udyam Registration page...");
    await page.goto("https://udyamregistration.gov.in/UdyamRegistration.aspx", { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForTimeout(2000);

    const fields = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll("input, select, textarea"));
      const out = [];
      nodes.forEach(n => {
        const name = n.name || n.id;
        if (!name) return;
        const labelEl = (n.labels && n.labels[0]) || document.querySelector(`label[for="${n.id}"]`);
        const label = labelEl ? labelEl.innerText.trim().replace(/\*/g,"") : (n.placeholder || name);
        const type = n.tagName.toLowerCase() === "select" ? "select" : (n.type || "text");
        const required = n.required || (labelEl && /\*/.test(labelEl.innerText)) || false;
        const pattern = n.getAttribute("pattern") || null;
        out.push({ name, label, type, required, pattern, placeholder: n.placeholder || "" });
      });
      // dedupe by name
      const seen = new Set();
      return out.filter(f => {
        if (seen.has(f.name)) return false;
        seen.add(f.name);
        return true;
      });
    });

    const outPath = path.join(__dirname, "..", "schema", "formSchema.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(fields, null, 2), "utf8");
    console.log("Saved schema to", outPath);
    await browser.close();
  } catch (err) {
    console.error("Scraper error:", err);
    process.exit(1);
  }
})();
