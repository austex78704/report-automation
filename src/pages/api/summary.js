import { OpenAI, OpenAIChat } from "langchain/llms/openai";

const SUMMARY_PROMPT = `Below is the transcript of a customer satisfaction interview, the first part of the interview has quantitative questions where each question has a answer rated out of 10 and the second part of the interview has qualitative or open ended questions. 

Please separate the both parts and return everything in markdown format. "Quantitative Part" and "Qualitative Part" should be formatted as headings.
Quantitative part should be in list format with proper serial numbers and any required sublists. 
Qualitative part should have the answers to all the open-ended questions asked in the second half of the interview, these questions are like these:
What specific recommendations do you have regarding how our company could work more effectively with your company?
What additional products or services would you like to see our company offer?
What do you believe to be the most important issue that our company should address for your company in the coming year?
Make sure the answer to all of the above three questions are included in as much detail as possible in the Qualitative part.
More instructions for the qualitative part:
Keep as much of the text of the original answers possible. Do very minimal polishing and shortening.
It should be in the perspective of the customer and in strict first person. Use sentences like: I think they need to improve in. I had a great experience with them. 
Do not repeat or include what was already mentioned in the Quantitative part. Remove any fluff or pleasantries.
Don't add opening or closing notes and summaries. 
Include every single important and specific detail like names, places, incidents, reasons, etc. 

Example Quantitative part:
XYZ has the requisite software engineering expertise to meet your
product objectives: 7/10
XYZ has an in-depth understanding of your technical needs: 8/10

Example Qualitative part: If I understood the request from our developers, currently, it’s possible to show surfaces only in the models, but we also need a way to show interiors. I’m not sure if that’s in development yet, but that’s something we need that’s important to Simcon.

Generally, their communication is very good. We have good personal contact with them. If we have issues, they’re resolved quickly, and the communication is friendly. The overall relationship is a good one. Our developers find their documentation to be accessible and easy to understand.

I don’t have an answer to that.

The area of focus relates to my earlier comment about needing to show models' interiors, not just the surfaces. We’re looking to accelerate our integration with other products, so we need to have both surfaces and interiors. It would be helpful if they could solve the issue of rendering interiors.

Transcript:`;

const handler = async (req, res) => {
  const { transcript } = req.body;

  try {
    const model = new OpenAIChat({
      temperature: 0.1,
      modelName: "gpt-3.5-turbo-16k",
      // verbose: true,
    });
    const result = await model.predict(SUMMARY_PROMPT + transcript);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

export default handler;
