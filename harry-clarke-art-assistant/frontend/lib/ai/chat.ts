import { aiConfig } from "./config";
import {
  baseSystemPrompt,
  ChatMessageInput,
  messageContentToString,
  toLangChainMessages,
} from "./messages";
import { createChatModel } from "./ollama";
import { getPanelEntry, panelCatalogPrompt } from "./panelCatalog";
import {
  normalizeMessagesWithPanelReferences,
  resolvePanelReference,
} from "./panelReferences";
import { getRelevantContext } from "./retrieval";

const buildSystemPrompt = (context: string, panelNumber?: number | null) => {
  const focusedPanel = panelNumber ? getPanelEntry(panelNumber) : null;
  const focusedPanelPrompt = focusedPanel
    ? `Focused panel reference: Panel ${focusedPanel.number} is ${focusedPanel.title}. Works: ${focusedPanel.works.join("; ")}. Summary: ${focusedPanel.summary}`
    : null;

  if (!context) {
    return [baseSystemPrompt, `Panel guide:\n${panelCatalogPrompt}`, focusedPanelPrompt]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    baseSystemPrompt,
    `Panel guide:\n${panelCatalogPrompt}`,
    focusedPanelPrompt,
    "Use the retrieved context below as your primary source of truth when answering questions about Harry Clarke, the Geneva Window, or related museum material.",
    "Prefer details that appear in the retrieved context over general background knowledge.",
    "If the retrieved context does not answer the question well enough, say that directly instead of filling gaps with guesses.",
    "When helpful, mention the source context in plain language.",
    `Retrieved context:\n${context}`,
  ].join("\n\n");
};

export const generateChatReply = async (messages: ChatMessageInput[]) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Missing chat messages.");
  }

  const normalizedMessages = normalizeMessagesWithPanelReferences(messages);
  const latestUserMessage = [...normalizedMessages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage) {
    throw new Error("No user message was provided.");
  }

  const panelNumberFromMessage = (() => {
    const explicitMatch = latestUserMessage.content.match(/\bpanel\s+([1-8])\b/i);
    if (explicitMatch) {
      return Number(explicitMatch[1]);
    }

    return resolvePanelReference(latestUserMessage.content)?.panel ?? null;
  })();
  const retrievedContext = await getRelevantContext(latestUserMessage.content);
  const systemPrompt = buildSystemPrompt(retrievedContext, panelNumberFromMessage);
  const llm = createChatModel();
  const response = await llm.invoke(
    toLangChainMessages(normalizedMessages, systemPrompt),
  );
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
