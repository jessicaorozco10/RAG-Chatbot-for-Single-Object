"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
// thing to check later
// the position if it goes over the button if we make it be front change z index
// have the transcript initialize the first letter
// tried having the glass comonent take the whole screen but it messes up the input
// the glass component make the input look good in android and i phone
// messahe need id text and sender
interface Message {
  id: number; // id for react
  text: string; // message content
  sender: "user" | "assistant"; // who send it
}
// styling props and let oyu cistomize the color more easy
// in order for the chat assistant to have different color we define them sepertely
interface AssistantProps {
  userBubbleClass?: string;
  assistantBubbleClass?: string;
  inputClass?: string;
  sendButtonClass?: string;
}
export default function ChatUI({
  // change the color of user assistant input send
  // for now user is white with blach text
  userBubbleClass = "bg-black text-white border-2 border-white",
  // for now assistant is blue with white text
  assistantBubbleClass = "bg-white/80 text-black",
  // tried using the button component same look but it look bad and this is more easy to see
  inputClass = "bg-white/80 text-black",
  // tried using the button component same look but it look bad and this is more easy to see
  sendButtonClass = "bg-white/80 text-black",
}: 







// control the chat app
AssistantProps) {
  // this is the state and rederence and it the control of the chat app
  // array store message
  const [messages, setMessages] = useState<Message[]>([]);
  // track the current text in the input box
  const [input, setInput] = useState("");
  // track if ai is proccessing a message
  const [isLoading, setIsLoading] = useState(false);
  // track if the microphone is listening
  const [isListening, setIsListening] = useState(false);
  // store transcript
  const [liveTranscript, setLiveTranscript] = useState("");
  // reference to the bottom div of the chat used to scroll to the latest message
  const endRef = useRef<HTMLDivElement>(null);
  // reference to the speech recognigtion instance allowing start and stop control
  const recognitionRef = useRef<any>(null);
  // counter to generate unique id for each chat message when rendering list in react each element need unique id to know what change
  const idCounter = useRef(0);
  // store the final transcript out side react state to avoid unnesarcy re render
  const finalTranscriptRef = useRef("");
  // keep a real time copy of all message for api call with out relying on pontentially stale state
  const messagesRef = useRef<Message[]>([]);

  // every message get a new number
  const nextId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };
  // messageref update
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  // scroll when there new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, liveTranscript]);
  // add user message immedietly
  // message peoceess
  // function that send a message to the ai
  // send a user message to the ai get a response and update to the chat ui
  const sendMessage = async (text: string, currentMessages: Message[]) => {
    // prevent sending empty message or sending while ai is still responding
    if (!text.trim() || isLoading) return;
    // convert chat into ai format as it let it understand loop through every past message and convert it
    const historyForApi = [
      ...currentMessages.map((m) => ({ role: m.sender, content: m.text })),
      { role: "user", content: text },
    ];
    // create the user chat bubble
    const userMsg: Message = { id: nextId(), text, sender: "user" };
    // show the user message immediedtly in ui clear input box tell ui that ai is thinking
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    // send conversation to backend ai
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // get ai response
      const data = await res.json();
      const reply: string = data.reply || "No response from AI";
      // send ai reply to chat ui
      setMessages((prev) => [
        ...prev,
        { id: nextId(), text: reply, sender: "assistant" },
      ]);
      // speak ai response out load text to speech
      if (typeof window !== "undefined") {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          text: "Error: Could not reach AI. Is Ollama running?",
          sender: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  // send message
  const handleSend = () => sendMessage(input, messagesRef.current);
  // control mic
  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setLiveTranscript("");
      return;
    }
    // check if browser support speech recognition chrome speech recognition safari web kit speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");
    // create speech recognition
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.continuous = true;
    recognitionRef.current = recog;
    finalTranscriptRef.current = "";
    // update ui to show mic is active
    recog.onstart = () => {
      setIsListening(true);
      setLiveTranscript("");
      finalTranscriptRef.current = "";
    };
    // speech come in peice
    recog.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      const current = final || interim;
      finalTranscriptRef.current = current;
      setLiveTranscript(current);
    };
    // mic turn of
    recog.onend = () => {
      setIsListening(false);
      setLiveTranscript("");
      const spoken = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";
      if (spoken) {
        sendMessage(spoken, messagesRef.current);
      }
    };

    recog.onerror = () => {
      setIsListening(false);
      setLiveTranscript("");
      finalTranscriptRef.current = "";
    };

    recog.start();
  };

  return (
    // overall container
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-2">
        {/* loop through all message and make the bubble*/}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-xl backdrop-blur-md shadow-md max-w-[70%] ${
                msg.sender === "user" ? userBubbleClass : assistantBubbleClass
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* live transcript bubble*/}
        {isListening && (
          <div className="flex justify-end">
            <div
              className={`px-4 py-3 rounded-xl backdrop-blur-md shadow-md max-w-[70%] opacity-60 italic ${userBubbleClass}`}
            >
              {/* animated dot*/}
              {liveTranscript || (
                <span className="flex gap-1 items-center h-5">
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* ai typing indicator*/}       
        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`px-4 py-3 rounded-xl backdrop-blur-md shadow-md ${assistantBubbleClass}`}
            >
              <span className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* input bar*/}    
      <div className="p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading || isListening}
            className={`w-full px-4 pr-24 py-3 rounded-2xl backdrop-blur-md shadow-md outline-none disabled:opacity-50 transition-opacity ${inputClass}`}
          />
          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={`absolute right-12 p-2 rounded-full transition-all disabled:opacity-40 ${
              isListening
                ? "bg-red-500 text-white scale-110 animate-pulse"
                : "hover:bg-black/10"
            }`}
            title={isListening ? "Tap to stop" : "Tap to speak"}
          >
            {isListening ? <FaStop /> : <FaMicrophone />}
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || isListening}
            className={`absolute right-2 p-2 rounded-full shadow-md disabled:opacity-40 transition-opacity ${sendButtonClass}`}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}