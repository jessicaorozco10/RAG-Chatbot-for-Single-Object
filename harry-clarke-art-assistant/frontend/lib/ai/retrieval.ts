import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { aiConfig, hasPineconeConfig } from "./config";
import { createEmbeddingsModel } from "./ollama";

let vectorStorePromise: Promise<PineconeStore> | null = null;

const getVectorStore = async () => {
  if (!hasPineconeConfig()) {
    throw new Error(
      "Pinecone is not configured. Set PINECONE_API_KEY and PINECONE_INDEX first.",
    );
  }

  if (!vectorStorePromise) {
    vectorStorePromise = (async () => {
      const client = new Pinecone({ apiKey: aiConfig.pineconeApiKey! });
      const index = client.Index(aiConfig.pineconeIndex!);

      return PineconeStore.fromExistingIndex(createEmbeddingsModel(), {
        pineconeIndex: index,
        namespace: aiConfig.pineconeNamespace,
        maxConcurrency: 5,
      });
    })();
  }

  return vectorStorePromise;
};

export const getRelevantContext = async (query: string) => {
  if (!aiConfig.ragEnabled || !hasPineconeConfig()) {
    return "";
  }

  const vectorStore = await getVectorStore();
  const docs = await vectorStore.similaritySearch(query, aiConfig.retrievalTopK);

  if (docs.length === 0) {
    return "";
  }

  return docs
    .map(
      (doc, index) =>
        `Source ${index + 1}:\n${doc.pageContent}\nMetadata: ${JSON.stringify(doc.metadata)}`,
    )
    .join("\n\n");
};
