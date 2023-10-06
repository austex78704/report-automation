import fs from "fs-extra";
import multiparty from "multiparty";

const { Deepgram } = require("@deepgram/sdk");

const deepgram = new Deepgram("7bda68a674f9b311ea30f6b4d922b7fc5ecdd767");

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

const handler = async (req, res) => {
  try {
    const { files } = await parseForm(req);

    const buffer = fs.readFileSync(files.data[0].path);

    const mimetype = "audio/mpeg";

    deepgram.transcription
      .preRecorded(
        { buffer: buffer, mimetype },
        {
          smart_format: true,
          model: "nova",
          language: "en-US",
          paragraphs: true,
        }
      )
      .then((transcription) => {
        console.log("Transcription complete");
        res.status(200).json(transcription);
        console.dir(transcription, { depth: null });
      })
      .catch((err) => {
        console.log("There was an error", { err });
        res.status(500).json(err);
      });
  } catch (error) {
    console.error(error);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
