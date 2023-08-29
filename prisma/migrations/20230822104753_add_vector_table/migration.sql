CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "ReportTranscriptEmbedding" (
    "id" TEXT NOT NULL,
    "reportId" UUID NOT NULL,
    "namespace" TEXT DEFAULT 'default',
    "content" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "ReportTranscriptEmbedding_pkey" PRIMARY KEY ("id")
);
