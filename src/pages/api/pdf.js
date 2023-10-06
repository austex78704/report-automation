// pages/api/convertToPdf.js

import { marked } from "marked";
import puppeteer from "puppeteer";

export async function convertMarkdownToPDF(markdownContent) {
  const htmlContent = marked(markdownContent);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: 40,
      bottom: 40,
      left: 20,
      right: 20,
    },
  });
  await browser.close();

  return pdfBuffer;
}

export default async (req, res) => {
  if (req.method === "POST") {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).send("Markdown content is required.");
    }

    const buffer = await convertMarkdownToPDF(markdown);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=converted.pdf");
    res.status(200).send(buffer);
  } else {
    res.status(405).send("Method not allowed.");
  }
};
