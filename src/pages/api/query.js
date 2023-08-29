import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { Chroma } from "langchain/vectorstores/chroma";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

const handler = async (req, res) => {
  const { method } = req;
  const { query, transcript } = req.body;

  if (method == "POST") {
    const model = new OpenAI({});

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([transcript]);

    console.log({ docs });

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
    const vectorStoreRetriever = vectorStore.asRetriever();

    const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
    const res = await chain.call({
      query,
    });

    res.status(200).json(res);
  } else {
    res.status(500).send("Method not allowed!");
  }
};

export default handler;
