"use client";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (imageB64?: string) => {
    if (!input && !imageB64) return;
    
    // 1. Structure the incoming new statement log entry
    const newUserMsg = { role: "user", content: input || "Sent an image for OCR" };
    
    // 2. Aggregate the exact historical state to prevent reference race-conditions
    const updatedHistory = [...messages, newUserMsg];
    
    setMessages(updatedHistory);
    setLoading(true);

    try {
      // DYNAMIC FIX: Extract your actual Neon User identity key out of the browser memory
      const savedUserId = localStorage.getItem("userId");
      const numericUserId = savedUserId ? parseInt(savedUserId) : 1;

      // Forward the accumulated conversation path over to the updated endpoint configuration
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messagesHistory: updatedHistory, // Pass the full state history instead of a solitary message text
          image: imageB64,
          userId: numericUserId // Linked directly to your active Neon session
        }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* STICKY NAVBAR: This will now follow you down */}
      <div className="bg-gray-200 p-4 flex justify-end gap-2 sticky top-0 z-50 shadow-sm">
        <Link href="/studentHomePage">
          <Button variant="outline" className="bg-gray-400">Back</Button>
        </Link>
        <Link href="/studentHomePage/tool/history">
          <Button variant="outline" className="bg-gray-400">History</Button>
        </Link>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-40">
        {messages.length === 0 && (
          <div className="w-full rounded-xl shadow-md p-6 bg-white border border-gray-100">
            <p>How May I help you today?</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-sm max-w-2xl ${m.role === 'user' ? 'bg-blue-50 ml-auto border' : 'bg-white border'}`}>
            <p className="text-sm font-bold mb-1">{m.role === 'user' ? 'You' : 'AI Assistant'}</p>
            
            {/* DESIGN UNTOUCHED: Kept container space intact, swapping paragraph tag for Markdown core engine */}
            <div className="prose max-w-none text-base break-words math-rendered-container">
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]}
              >
                {m.content
                  .replace(/\\\[/g, '$$$$')  // Converts \[ to $$
                  .replace(/\\\]/g, '$$$$')  // Converts \] to $$
                  .replace(/\\\(/g, '$')     // Converts \( to $
                  .replace(/\\\)/g, '$')     // Converts \) to $
                }
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {loading && <p className="text-gray-400 animate-pulse">AI is thinking...</p>}
      </div>

      {/* INPUT BAR (STAYS AT BOTTOM) */}
      <div className="fixed bottom-6 left-0 w-full flex justify-center px-4">
        <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-lg border flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 border rounded-md p-2 outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button 
            onClick={() => handleSend()}
            className="bg-gray-400 text-black px-4 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Send
          </button>

          <input 
            type="file" id="ocr-upload" hidden accept="image/*" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => handleSend(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          <button 
            onClick={() => document.getElementById('ocr-upload')?.click()}
            className="bg-gray-400 text-black px-4 py-2 rounded-md hover:bg-gray-500 transition"
          >
            OCR
          </button>
        </div>
      </div>
    </div>
  );
}