import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function fillPdf(templatePath, fields, signatureDataURL, outputPath) {
  // Load template
  const existingPdf = await PDFDocument.load(fs.readFileSync(templatePath));
  const pages = existingPdf.getPages();
  const page = pages[0];

  // Embed font
  const font = await existingPdf.embedFont(StandardFonts.Helvetica);

  // Example: name and date fields (coordinates will be tuned for each PDF)
  if (fields.name) {
    page.drawText(fields.name, { x: 150, y: 150, size: 12, font, color: rgb(0, 0, 0) });
  }
  if (fields.date) {
    page.drawText(fields.date, { x: 400, y: 150, size: 12, font, color: rgb(0, 0, 0) });
  }

  // Signature
  if (signatureDataURL) {
    const sigBase64 = signatureDataURL.replace(/^data:image\/png;base64,/, "");
    const sigImage = await existingPdf.embedPng(Buffer.from(sigBase64, "base64"));
    page.drawImage(sigImage, { x: 150, y: 100, width: 200, height: 50 });
  }

  // Save output
  const pdfBytes = await existingPdf.save();
  fs.writeFileSync(outputPath, pdfBytes);
  return outputPath;
}
