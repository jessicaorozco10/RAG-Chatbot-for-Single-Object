import { NextResponse } from "next/server";
import { generateChatReply } from "../../lib/ai/chat";
import type { ChatMessageInput } from "../../lib/ai/messages";

interface ChatRequestBody {
  messages?: ChatMessageInput[];
}

const normalizeChatError = (err: unknown) => {
  if (!(err instanceof Error)) {
    return "Could not get AI response.";
  }

  const message = err.message;

  if (message.includes("model") && message.includes("not found")) {
    return `${message}. Run: ollama pull llama3.2`;
  }

  if (
    message.includes("ECONNREFUSED") ||
    message.includes("fetch failed") ||
    message.includes("connect")
  ) {
    if (message.toLowerCase().includes("pinecone")) {
      return "Could not reach Pinecone. Check your Pinecone API key, host, index, and network access.";
    }

    return "Could not reach Ollama at http://127.0.0.1:11434. Start Ollama and try again.";
  }

  return message;
};

export async function POST(req: Request) {
  try {
    const { messages }: ChatRequestBody = await req.json();
    const result = await generateChatReply(messages ?? []);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    const message = normalizeChatError(err);

    return NextResponse.json({ reply: `Error: ${message}` }, { status: 500 });
  }
}
