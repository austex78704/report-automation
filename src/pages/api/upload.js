import axios from "axios";
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
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
      "transfer-encoding": "chunked",
    },
  });
  try {
    const { files } = await parseForm(req);
    const file = await fs.readFile(files.data[0].path);

    res.status(200).json(response.data);
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
