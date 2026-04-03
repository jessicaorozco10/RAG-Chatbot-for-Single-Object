const parseBoolean = (value: string | undefined, fallback = false) => {
  if (value == null) return fallback;
  return value.toLowerCase() === "true";
};

const derivePineconeIndexFromHost = (host: string | undefined) => {
  if (!host) return undefined;

  try {
    const hostname = new URL(host).hostname;
    const subdomain = hostname.split(".")[0];
    const parts = subdomain.split("-");

    if (parts.length < 2) {
      return undefined;
    }

    return parts.slice(0, -1).join("-") || undefined;
  } catch {
    return undefined;
  }
};

const pineconeHost = process.env.PINECONE_HOST;
const pineconeIndex =
  process.env.PINECONE_INDEX ?? derivePineconeIndexFromHost(pineconeHost);

export const aiConfig = {
  ollamaBaseUrl:
    process.env.OLLAMA_BASE_URL ??
    process.env.OLLAMA_URL?.replace(/\/api\/generate$/, "") ??
    "http://127.0.0.1:11434",
  chatModel: process.env.OLLAMA_MODEL ?? "llama3.2",
  temperature: Number(process.env.OLLAMA_TEMPERATURE ?? "0.2"),
  ragEnabled: parseBoolean(process.env.ENABLE_RAG, false),
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeIndex,
  pineconeHost,
  pineconeNamespace: process.env.PINECONE_NAMESPACE,
  retrievalTopK: Number(process.env.RAG_TOP_K ?? "4"),
  retrievalFetchK: Number(process.env.RAG_FETCH_K ?? "10"),
};

export const hasPineconeConfig = () =>
  Boolean(aiConfig.pineconeApiKey && aiConfig.pineconeIndex);
