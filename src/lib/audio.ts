const axios = require("axios");
const audioURL = "https://bit.ly/3yxKEIY";
const APIKey = "YOUR-ASSEMBLYAI-API-KEY";
const refreshInterval = 5000;

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: APIKey,
    "content-type": "application/json",
  },
});

export const getTranscript = async (setTranscript: any) => {
  const response = await assembly.post("/transcript", {
    audio_url: audioURL,
  });

  const checkCompletionInterval = setInterval(async () => {
    const transcript = await assembly.get(`/transcript/${response.data.id}`);
    const transcriptStatus = transcript.data.status;

    if (transcriptStatus !== "completed") {
      console.log(`Transcript Status: ${transcriptStatus}`);
    } else if (transcriptStatus === "completed") {
      console.log("\nTranscription completed!\n");
      let transcriptText = transcript.data.text;
      console.log(`Your transcribed text:\n\n${transcriptText}`);
      clearInterval(checkCompletionInterval);
    }
  }, refreshInterval);
};
