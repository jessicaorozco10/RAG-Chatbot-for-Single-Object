const parseBoolean = (value: string | undefined, fallback = false) => {
  if (value == null) return fallback;
  return value.toLowerCase() === "true";
};

export const aiConfig = {
  ollamaBaseUrl:
    process.env.OLLAMA_BASE_URL ??
    process.env.OLLAMA_URL?.replace(/\/api\/generate$/, "") ??
    "http://127.0.0.1:11434",
  chatModel: process.env.OLLAMA_MODEL ?? "llama3.2",
  embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL ?? "mxbai-embed-large",
  temperature: Number(process.env.OLLAMA_TEMPERATURE ?? "0.2"),
  ragEnabled: parseBoolean(process.env.ENABLE_RAG, false),
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeIndex: process.env.PINECONE_INDEX,
  pineconeNamespace: process.env.PINECONE_NAMESPACE,
  retrievalTopK: Number(process.env.RAG_TOP_K ?? "4"),
};

export const hasPineconeConfig = () =>
  Boolean(aiConfig.pineconeApiKey && aiConfig.pineconeIndex);
