import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // build prompt for ollama
    const prompt =
      messages.map((m: any) => `${m.role}: ${m.content}`).join("\n") +
      "\nassistant:"

    // call ollama local server
    const res = await fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "",
        prompt,
        stream: false
      })
    })

    const data = await res.json()

    return NextResponse.json({ reply: data.response })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ reply: "Error: Could not get AI response." })
  }
}