import { OpenAI, OpenAIChat } from "langchain/llms/openai";

import { SUMMARY_PROMPT } from "../../lib/prompts";

const handler = async (req, res) => {
  const { transcript } = req.body;
  console.log("Generating summary");
  try {
    const model = new OpenAIChat({
      temperature: 0.1,
      modelName: "gpt-3.5-turbo-16k",
    });
    const result = await model.predict(SUMMARY_PROMPT + transcript);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

export default handler;
