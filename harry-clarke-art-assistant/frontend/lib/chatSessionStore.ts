export type ChatSessionMessage = {
  id: number;
  text: string;
  sender: "user" | "assistant";
  usedRag?: boolean;
};

type ChatSessionState = {
  messages: ChatSessionMessage[];
  lastUsedRag: boolean | null;
};

let chatSessionState: ChatSessionState | null = null;

export const getChatSessionState = () => chatSessionState;

export const setChatSessionState = (state: ChatSessionState) => {
  chatSessionState = state;
};

export const clearChatSessionState = () => {
  chatSessionState = null;
};
