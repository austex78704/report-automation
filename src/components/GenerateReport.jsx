import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import marked from "marked";
// import pdf from "html-pdf";
import dynamic from "next/dynamic";
import { OpenAI, OpenAIChat } from "langchain/llms/openai";

// const GeneratePdf = dynamic(() => import("./GeneratePDF"), { ssr: false });

import Loader from "../components/Loader";
import { SUMMARY_PROMPT } from "../lib/prompts";

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const upload = async (file) => {
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
      "transfer-encoding": "chunked",
    },
  });
  try {
    const response = await assembly.post("/upload", file);
    return response.data?.upload_url;
  } catch (e) {
    console.log(e);
  }
};

const transcribe = async (url) => {
  const response = await axios.post("/api/transcribe", { data: { url } });
  const id = response.data.id;

  let data = response.data;

  while (data.status !== "completed" && data.status !== "error") {
    await wait(1000);
    const response = await axios.post("/api/result", { data: { id } });

    data = response.data;
  }

  return data;
};

export default function GenerateReport({ id }) {
  const [file, setFile] = useState();

  const [name, setName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const downloadAsTXT = (content, filename) => {
    const fileName = filename;

    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = async (content) => {
    try {
      const response = await axios.post(
        "/api/pdf",
        { markdown: content },
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error converting markdown to PDF:", error);
    }
  };

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/report/${id}`);
      const report = response.data;
      console.log({ report });
      setFile(report.name);
      setName(report.name);
      setTranscript(report.transcript);
      setSummary(report.summary);
    } catch (e) {
      console.log("Error", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!id) return;
    loadReport();
  }, [id]);

  const handleInput = async (event) => {
    setFile(event.target.files[0]);
    setTranscript("");
    setError("");
    setStatus("");
    event.target.value = null;
  };

  const handleTranscription = async () => {
    try {
      setStatus("uploading");
      const url = await upload(file);
      setStatus("transcribing");
      const data = await transcribe(url);
      setTranscript(data.text);
      setStatus("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const generateSummary = async (transcript) => {
    setIsGeneratingSummary(true);
    try {
      const model = new OpenAIChat({
        temperature: 0.1,
        modelName: "gpt-3.5-turbo-16k",
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });
      const result = await model.predict(SUMMARY_PROMPT + transcript);
      setSummary(result);
    } catch (e) {
      console.log(e);
    }
    setIsGeneratingSummary(false);
  };

  const queryTranscript = async (query, transcript) => {
    try {
      const response = await axios.post("/api/query", { query, transcript });
      console.log(response.data);
      setAnswer(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const save = async () => {
    try {
      const response = await axios.post("/api/report", {
        id,
        name: name || file?.name,
        transcript,
        summary,
      });
      console.log(response.data);
      setIsSaveDone(true);
    } catch (e) {
      console.log(e);
    }
  };

  const isTranscriptReady = transcript && !error;

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {" "}
      {!isTranscriptReady && (
        <>
          <label className="flex flex-col items-center text-white rounded-lg p-2 bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors duration-150">
            <span className="text-base leading-normal">
              Select a {file ? "different" : ""} file
            </span>
            <input type="file" className="hidden" onInput={handleInput} />
          </label>
          <button
            className="rounded-lg border-2 p-2 w-full mt-2 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-40"
            disabled={!file}
            onClick={handleTranscription}
          >
            Transcribe
          </button>
        </>
      )}
      {isTranscriptReady && (
        <h2 className="font-semibold text-xl mt-4">
          Transcript{" "}
          <span className="font-normal text-xs ml-2">
            ({name || file.name})
          </span>
        </h2>
      )}
      {file && (
        <div
          className={clsx(
            "rounded-lg border-2 mt-2 p-2 max-h-64 overflow-y-auto",
            error && "border-red-500"
          )}
        >
          {isTranscriptReady ? (
            transcript
          ) : (
            <div className="w-full flex justify-center">
              {status && !error && (
                <>
                  <Loader />
                  <span className="ml-2 capitalize mt-0.5">{status}...</span>
                </>
              )}
              {error && <span className="text-red-500">{error}</span>}
              {!status &&
                !error &&
                `File "${file.name}" ready for transcription`}
            </div>
          )}
        </div>
      )}
      {isTranscriptReady && (
        <div className="flex gap-2">
          <div
            className="rounded-lg cursor-pointer border-2 p-2 w-max mt-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150 disabled:opacity-40"
            onClick={() => downloadAsTXT(transcript, "transcript.txt")}
          >
            Download as TXT
          </div>
          {/* <div
            className="rounded-lg cursor-pointer border-2 p-2 w-max mt-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150 disabled:opacity-40"
            onClick={() => downloadAsPDF("# Transcript \n" + transcript)}
          >
            Download as PDF
          </div> */}
        </div>
      )}
      {/* {isTranscriptReady && (
        <div>
          <h2 className="font-medium text-xl mt- mb-2">Query Transcript</h2>
          <input
            className="rounded-lg border-2 p-2 w-full hover:bg-gray-100 transition-colors duration-150 disabled:opacity-40"
            placeholder="Enter your question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="cursor-pointer rounded-lg border-2 p-2 w-full mt-2 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-40"
            onClick={() => queryTranscript(query, transcript)}
          >
            Query
          </button>
          {answer && (
            <div className="rounded-lg border-2 mt-2 p-2">
              <h2 className="font-medium text-xl mt- mb-2">Answer</h2>
              {answer}
            </div>
          )}
        </div>
      )} */}
      {isTranscriptReady && (
        <>
          <h2 className="font-medium text-xl mt-8 mb-2">Summary</h2>

          <button
            className="rounded-lg border-2 p-2 w-full  hover:bg-gray-100 transition-colors duration-150 disabled:opacity-40"
            disabled={isGeneratingSummary}
            onClick={() => generateSummary(transcript)}
          >
            {isGeneratingSummary ? (
              <div className="w-full flex justify-center">
                <Loader />
                <span className="ml-2 capitalize mt-0.5">
                  Generating summary...
                </span>
              </div>
            ) : summary ? (
              "Re-generate Summary"
            ) : (
              "Generate Summary"
            )}
          </button>
        </>
      )}
      {isTranscriptReady && summary && (
        <div>
          <div className="rounded-lg border-2 mt-2 p-2 max-h-64 overflow-y-auto">
            <ReactMarkdown className="no-tailwind">{summary}</ReactMarkdown>
          </div>
          <div className="flex gap-2">
            <div
              className="rounded-lg cursor-pointer border-2 p-2 w-max mt-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150 disabled:opacity-40"
              onClick={() => downloadAsTXT(summary, "summary.txt")}
            >
              Download as TXT
            </div>
            {/* <div
              className="rounded-lg cursor-pointer border-2 p-2 w-max mt-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150 disabled:opacity-40"
              onClick={() => downloadAsPDF(summary)}
            >
              Download as PDF
            </div> */}
          </div>
        </div>
      )}
      {transcript && (
        <button
          className="rounded-lg border-2 p-2 w-full mt-4 bg-green-600 text-white hover:bg-green-500 transition-colors duration-150 disabled:opacity-40"
          onClick={save}
        >
          Save
        </button>
      )}
    </div>
  );
}
