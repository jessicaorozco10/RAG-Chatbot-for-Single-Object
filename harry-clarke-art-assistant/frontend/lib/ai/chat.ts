import { aiConfig } from "./config";
import {
  baseSystemPrompt,
  ChatMessageInput,
  messageContentToString,
  toLangChainMessages,
} from "./messages";
import { createChatModel } from "./ollama";
import { getRelevantContext } from "./retrieval";

const buildSystemPrompt = (context: string) => {
  if (!context) {
    return baseSystemPrompt;
  }

  return [
    baseSystemPrompt,
    "Use the retrieved context below when it is relevant.",
    "If the context is insufficient, say that directly.",
    `Retrieved context:\n${context}`,
  ].join("\n\n");
};

export const generateChatReply = async (messages: ChatMessageInput[]) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Missing chat messages.");
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage) {
    throw new Error("No user message was provided.");
  }

  const retrievedContext = await getRelevantContext(latestUserMessage.content);
  const systemPrompt = buildSystemPrompt(retrievedContext);
  const llm = createChatModel();
  const response = await llm.invoke(toLangChainMessages(messages, systemPrompt));
  const reply = messageContentToString(response.content);

  if (!reply) {
    throw new Error(
      `The Ollama model "${aiConfig.chatModel}" returned an empty response.`,
    );
  }

  return {
    reply,
    usedRag: Boolean(retrievedContext),
  };
};
