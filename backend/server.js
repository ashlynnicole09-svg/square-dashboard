import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { fillPdf } from "./pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

// PDF signing route
app.post("/sign-pdf", async (req, res) => {
  try {
    const { docType, fields, signature } = req.body;

    const templateMap = {
      "return": "templates/Return and Refund Policy.pdf",
      "delivery": "templates/MSI Delivery Policy.pdf",
      "qty": "templates/Order Quantity Policy.pdf",
      "auth": "templates/Credit Debit Card Authorization Form.pdf",
    };

    if (!templateMap[docType]) {
      return res.status(400).json({ error: "Invalid docType" });
    }

    const outputPath = path.resolve(__dirname, `signed/${docType}-${Date.now()}.pdf`);
    await fillPdf(path.resolve(__dirname, templateMap[docType]), fields, signature, outputPath);

    res.download(outputPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sign PDF" });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
