export const SUMMARY_PROMPT = `Below is the transcript of a customer satisfaction interview, the first part of the interview has quantitative questions where each question has a answer rated out of 10 and the second part of the interview has qualitative or open ended questions. 

Please separate the both parts and return everything in markdown format. "Quantitative Part" and "Qualitative Part" should be formatted as headings.
Quantitative part should be in list format with proper serial numbers and any required sublists. 
Qualitative part should be a slightly trimmed down version of the transcript with any pleasantries and trivial information removed. Keep the wordings and sentences close to the original transcript.

Example Quantitative part:
XYZ has the requisite software engineering expertise to meet your
product objectives: 7/10
XYZ has an in-depth understanding of your technical needs: 8/10

Example Qualitative part: If I understood the request from our developers, currently, it’s possible to show surfaces only in the models, but we also need a way to show interiors. I’m not sure if that’s in development yet, but that’s something we need that’s important to Simcon.

Generally, their communication is very good. We have good personal contact with them. If we have issues, they’re resolved quickly, and the communication is friendly. The overall relationship is a good one. Our developers find their documentation to be accessible and easy to understand.

I don’t have an answer to that.

The area of focus relates to my earlier comment about needing to show models' interiors, not just the surfaces. We’re looking to accelerate our integration with other products, so we need to have both surfaces and interiors. It would be helpful if they could solve the issue of rendering interiors.
Make sure the qualitative part is very very detailed.

Transcript:`;

console.log({ SUMMARY_PROMPT });
