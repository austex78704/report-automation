// import {
//   Prisma,
//   PrismaClient,
//   ReportTranscriptEmbedding,
// } from "@prisma/client";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { PrismaVectorStore } from "langchain/vectorstores/prisma";

// const handler = async (req, res) => {
//   const db = new PrismaClient();

//   // console.log(ReportTranscriptEmbedding);

//   const reportId = "c55cd218-24da-4ef2-8222-b758a58b2991";

//   const vectorStore =
//     PrismaVectorStore.withModel <
//     ReportTranscriptEmbedding >
//     db.create(new OpenAIEmbeddings(), {
//       prisma: Prisma,
//       tableName: "ReportTranscriptEmbedding",
//       vectorColumnName: "vector",
//       columns: {
//         id: PrismaVectorStore.IdColumn,
//         content: PrismaVectorStore.ContentColumn,
//         reportId: PrismaVectorStore.StringColumn,
//       },
//     });

//   const texts = ["Hello world", "Bye bye", "What's this?"];

//   const result = await vectorStore.addModels(
//     await db.$transaction(
//       texts.map((content) =>
//         db.reportTranscriptEmbedding.create({ data: { content, reportId } })
//       )
//     )
//   );

//   res.status(200).json(result);
// };

const handler = async (req, res) => {
  res.status(200).json({});
};
export default handler;
