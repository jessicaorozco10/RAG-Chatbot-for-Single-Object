import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export const baseSystemPrompt = [
  "You are the Harry Clarke Art Assistant.",
  "Answer clearly and stay grounded in the conversation and any retrieved museum context.",
  "If you do not know the answer, say so plainly instead of inventing details.",
].join(" ");

export const toLangChainMessages = (
  messages: ChatMessageInput[],
  systemPrompt: string,
) => [
  new SystemMessage(systemPrompt),
  ...messages.map((message) =>
    message.role === "assistant"
      ? new AIMessage(message.content)
      : new HumanMessage(message.content),
  ),
];

export const messageContentToString = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (
          item &&
          typeof item === "object" &&
          "text" in item &&
          typeof item.text === "string"
        ) {
          return item.text;
        }
        return "";
      })
      .join("")
      .trim();
  }

  return "";
};
