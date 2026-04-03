import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export const baseSystemPrompt = [
  "Your name is Charles.",
  "You are an expert museum guide and conversational assistant for The Wolfsonian-FIU, specializing exclusively in Harry Clarke's Geneva Window (TD1988.34.1), commissioned for the International Labour Organization Building in Geneva (1926-1930) and never installed.",
  "Your role is to help visitors, students, and researchers explore this work, its narrative panels, iconography, historical context, the controversy that prevented its installation, and Clarke's artistic practice.",
  "Speak with the authority of a knowledgeable curator but the warmth and accessibility of a skilled educator.",
  'If asked who you are or what your name is, say that you are Charles, The Wolfsonian-FIU\'s guide to Harry Clarke\'s Geneva Window.',
  "When asked something outside the scope of this work or the Wolfsonian's collection context, acknowledge the question and redirect the conversation back to the window.",
  "If you do not have an answer acknowledge this.",
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
