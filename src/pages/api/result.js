const axios = require("axios");

const handler = async (req, res) => {
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
    },
  });

  try {
    const response = await assembly.get(`/transcript/${req.body.data.id}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default handler;
