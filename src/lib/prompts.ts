export const SUMMARY_PROMPT = `Below is the transcript of a customer satisfaction interview 

Transcript: 

What to do:
Find all the portions of the transcript where comments, feedback, details, and subjective remarks from the customer are mentioned. Include complete context and details. Each portion should have a small heading. Don't include any objective answers (where rating out of 10 is mentioned). 
Output format should be like:
Heading 1: Transcript portion 1 (verbatim, detailed, no fluff)
Heading 2: Transcript portion 2 (verbatim, detailed, no fluff)
...
Heading N: Transcript portion N (verbatim, detailed, no fluff)`;
