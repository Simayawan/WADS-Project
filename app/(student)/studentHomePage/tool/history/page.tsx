"use client";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChatMessage {
  content: string;
  role: string;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Session route guard verification
    const savedUserId = localStorage.getItem("userId");
    
    if (!savedUserId) {
      router.push("/");
      return;
    }
    
    setIsAuthorized(true);

    // 2. Fetch data from Neon via our history API endpoint
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?userId=${savedUserId}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch (error) {
        console.error("Failed to load chat logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  if (isAuthorized === null || loading) {
    return (
      <div className="h-screen flex items-center justify-center font-sans bg-gray-50">
        <p className="text-gray-500 font-medium animate-pulse">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR */}
      <div className="bg-gray-200 p-4 flex justify-end gap-2 sticky top-0 z-50 shadow-sm">
        <Link href="/studentHomePage/tool/ask">
          <Button variant="outline" className="bg-gray-400">
            Back to Chat
          </Button>
        </Link>
        <Link href="/studentHomePage">
          <Button variant="outline" className="bg-gray-400">
            Home
          </Button>
        </Link>
      </div>

      {/* HEADER CONTAINER */}
      <div>
        <h1 className="mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6 text-center text-2xl font-bold">
          Your AI Conversation Logs
        </h1>
      </div>

      {/* DYNAMIC CHAT BOX CONTENT */}
      <div className="mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6 mb-10 space-y-4 max-h-[600px] overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-center text-gray-500 italic py-4">
            No previous chat conversations found for your account.
          </p>
        ) : (
          history.map((msg, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl border max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-blue-50 ml-auto border-blue-100' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-xs font-bold mb-1 uppercase tracking-wider text-gray-500">
                {msg.role === 'user' ? 'You' : 'AI Assistant'}
              </p>
              
              {/* DESIGN UNTOUCHED: Kept card spaces intact, swapping plain text display for the LaTeX-enabled Markdown engine */}
              <div className="prose max-w-none text-base break-words math-rendered-container">
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {msg.content
                    .replace(/\\\[/g, '$$$$')  // Formats block math delimiters \[ to $$
                    .replace(/\\\]/g, '$$$$')  // Formats block math delimiters \] to $$
                    .replace(/\\\(/g, '$')     // Formats inline math delimiters \( to $
                    .replace(/\\\)/g, '$')     // Formats inline math delimiters \) to $
                  }
                </ReactMarkdown>
              </div>

              <p className="text-[10px] text-gray-400 text-right mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}