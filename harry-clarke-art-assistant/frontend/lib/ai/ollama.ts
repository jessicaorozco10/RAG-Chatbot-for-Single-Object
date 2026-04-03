import { ChatOllama } from "@langchain/ollama";
import { aiConfig } from "./config";

export const createChatModel = () =>
  new ChatOllama({
    model: aiConfig.chatModel,
    baseUrl: aiConfig.ollamaBaseUrl,
    temperature: aiConfig.temperature,
  });
