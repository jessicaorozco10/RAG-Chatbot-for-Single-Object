"use client";

import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaStop, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { getAccessibilitySettings } from "@/lib/accesabilityStorage";

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  usedRag?: boolean;
}

interface AssistantProps {
  userBubbleClass?: string;
  assistantBubbleClass?: string;
  inputClass?: string;
  sendButtonClass?: string;
  welcomeMessage?: string;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function ChatUI({
  userBubbleClass = "bg-zinc-800/50 text-white border-2 border-zinc-500/70 backdrop-blur-md shadow-md",
  assistantBubbleClass = "bg-white/80 text-black",
  inputClass = "bg-white/80 text-black",
  sendButtonClass = "bg-white/80 text-black",
  welcomeMessage,
}: AssistantProps) {
  /**
 * Loads saved accessibility settings when the component mounts.
 * Updates text size and letter spacing from stored user preferences
 * so the UI stays consistent across sessions.
 */
  const [textSize, setTextSize] = useState(16);
  const [spacing, setSpacing] = useState(0);
  useEffect(() => {
    const settings = getAccessibilitySettings();
    if (settings) {
      setTextSize(settings.textScale);
      setSpacing(settings.letterSpacing);
    }
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastUsedRag, setLastUsedRag] = useState<boolean | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const idCounter = useRef(0);
  const finalTranscriptRef = useRef("");
  const messagesRef = useRef<Message[]>([]);
  // Added ref for auto growing textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nextId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };

  useEffect(() => {
    if (messages.length === 0) {
      const defaultWelcome = "Welcome to the Harry Clarke Art Assistant at The Wolfsonian–FIU. I can help you explore the art and legacy of Harry Clarke—a artist known for richly detailed stained glass.";
      const welcomeText = welcomeMessage ?? defaultWelcome;
      setMessages([{ id: nextId(), text: welcomeText, sender: "assistant" }]);
    }
  }, [welcomeMessage]);
  
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, liveTranscript]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto resize textarea when input changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const speakAssistantReply = (reply: string) => {
    if (
      typeof window === "undefined" ||
      !isSpeechEnabled ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "en-US";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text: string, currentMessages: Message[]) => {
    if (!text.trim() || isLoading) return;

    const historyForApi = [
      ...currentMessages.map((message) => ({
        role: message.sender,
        content: message.text,
      })),
      { role: "user", content: text },
    ];

    const userMsg: Message = { id: nextId(), text, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      const data: { reply?: string; usedRag?: boolean } = await res.json();

      if (!res.ok) {
        throw new Error(data.reply ?? `HTTP ${res.status}`);
      }

      const reply = data.reply ?? "No response from AI";
      const usedRag = Boolean(data.usedRag);
      setLastUsedRag(usedRag);

      setMessages((prev) => [
        ...prev,
        { id: nextId(), text: reply, sender: "assistant", usedRag },
      ]);
      speakAssistantReply(reply);
    } catch (err) {
      console.error(err);
      setLastUsedRag(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          text:
            err instanceof Error
              ? `Error: ${err.message}`
              : "Error: Could not reach AI. Is Ollama running?",
          sender: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input, messagesRef.current);

  const handleSpeechToggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text to speech is not supported in this browser.");
      return;
    }

    if (isSpeechEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsSpeechEnabled((prev) => !prev);
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setLiveTranscript("");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    finalTranscriptRef.current = "";

    recognition.onstart = () => {
      setIsListening(true);
      setLiveTranscript("");
      finalTranscriptRef.current = "";
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      const current = final || interim;
      finalTranscriptRef.current = current;
      setLiveTranscript(current);
    };

    recognition.onend = () => {
      setIsListening(false);
      setLiveTranscript("");
      const spoken = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";

      if (spoken) {
        void sendMessage(spoken, messagesRef.current);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setLiveTranscript("");
      finalTranscriptRef.current = "";
    };

    recognition.start();
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-1 flex-col space-y-2 overflow-y-auto p-4">
        {lastUsedRag !== null && (
          <div className="flex justify-center">
            <div className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
              {lastUsedRag
                ? "Using Pinecone context"
                : "Replying without Pinecone context"}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col max-w-[70%]">
              {msg.sender === "assistant" && (
                <span className="mb-1 ml-1 text-m font-medium text-white/80">
                  Art Assistant
                </span>
              )}

              {/* Added break words whitespace pre wrap to prevent text overflow */}
              <div
                className={`rounded-xl px-4 py-3 shadow-md backdrop-blur-md break-words whitespace-pre-wrap ${msg.sender === "user" ? userBubbleClass : assistantBubbleClass
                  }`}
                style={{
                  fontSize: `${textSize}px`,
                  letterSpacing: `${spacing}px`,
                }}
              >
                {msg.text}

                {msg.sender === "assistant" && msg.usedRag && (
                  <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] opacity-60">
                    Pinecone context used
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isListening && (
          <div className="flex justify-end">
            <div
              className={`max-w-[70%] rounded-xl px-4 py-3 italic opacity-60 shadow-md backdrop-blur-md break-words whitespace-pre-wrap ${userBubbleClass}`}
            >
              {liveTranscript || (
                <span className="flex h-5 items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`rounded-xl px-4 py-3 shadow-md backdrop-blur-md ${assistantBubbleClass}`}
            >
              <span className="flex h-5 items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="p-4">
        <div className="relative flex items-center">
          {/* Replaced input with auto growing textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading || isListening}
            rows={1}
            className={`w-full resize-none overflow-y-auto rounded-2xl px-4 py-3 pr-36 shadow-md outline-none transition-opacity disabled:opacity-50 ${inputClass}`}
            style={{ maxHeight: "200px" }}
          />
          <button
            onClick={handleSpeechToggle}
            className={`absolute right-24 rounded-full p-2 transition-all ${isSpeechEnabled
                ? "bg-black text-white hover:bg-black/90"
                : "hover:bg-black/10"
              }`}
            title={
              isSpeechEnabled
                ? isSpeaking
                  ? "Turn off text to speech and stop reading"
                  : "Turn off text to speech"
                : "Turn on text to speech"
            }
          >
            {isSpeechEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={`absolute right-12 rounded-full p-2 transition-all disabled:opacity-40 ${isListening
                ? "scale-110 animate-pulse bg-red-500 text-white"
                : "hover:bg-black/10"
              }`}
            title={isListening ? "Tap to stop" : "Tap to speak"}
          >
            {isListening ? <FaStop /> : <FaMicrophone />}
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || isListening}
            className={`absolute right-2 rounded-full p-2 shadow-md transition-opacity disabled:opacity-40 ${sendButtonClass}`}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}
