import { NextResponse } from "next/server";
import { generateChatReply } from "../../lib/ai/chat";
import type { ChatMessageInput } from "../../lib/ai/messages";

interface ChatRequestBody {
  messages?: ChatMessageInput[];
}

export async function POST(req: Request) {
  try {
    const { messages }: ChatRequestBody = await req.json();
    const result = await generateChatReply(messages ?? []);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    const message =
      err instanceof Error ? err.message : "Could not get AI response.";

    return NextResponse.json({ reply: `Error: ${message}` }, { status: 500 });
  }
}
