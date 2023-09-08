// pages/api/convertToPdf.js

import MarkdownIt from "markdown-it";
import pdf from "html-pdf";
import { marked } from "marked";
import path from "path";

const markdownIt = new MarkdownIt();

export default async (req, res) => {
  if (req.method === "POST") {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).send("Markdown content is required.");
    }

    const html = marked(markdown);

    const pdfOptions = {
      format: "A4",
      border: {
        top: "2cm",
        right: "1cm",
        bottom: "2cm",
        left: "1cm",
      },
      phantomPath: path.resolve(
        process.cwd(),
        "node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"
      ),
    };

    // process.env.FONTCONFIG_PATH = path.join(process.cwd(), "my-font-directory");
    process.env.LD_LIBRARY_PATH = path.join(process.cwd(), "bins");

    pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=converted.pdf");
      res.status(200).send(buffer);
    });
  } else {
    res.status(405).send("Method not allowed.");
  }
};
