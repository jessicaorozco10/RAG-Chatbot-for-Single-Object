import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { aiConfig } from "./config";

export const createChatModel = () =>
  new ChatOllama({
    model: aiConfig.chatModel,
    baseUrl: aiConfig.ollamaBaseUrl,
    temperature: aiConfig.temperature,
  });

export const createEmbeddingsModel = () =>
  new OllamaEmbeddings({
    model: aiConfig.embeddingModel,
    baseUrl: aiConfig.ollamaBaseUrl,
  });
