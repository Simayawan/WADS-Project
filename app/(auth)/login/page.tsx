"use client"; // Required for Next.js state

import React, { useState } from "react"; // Added React import for types
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // FIX: Added 'React.FormEvent' to the parameter 'e'
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. FRONTEND VALIDATION (Security requirement)
    if (!email.includes("@") || password.length < 6) {
      alert("Invalid input detected. Security check failed.");
      return;
    }

    // 2. BACKEND SECURITY CHECK
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // 1. Get the data from the response
        const data = await response.json();
        
        // 2. Save the userId (this is the key for the AI History)
        // data.user.id comes from the backend route we just updated
        localStorage.setItem("userId", data.user.id);
        
        router.push("/studentHomePage");
      } else {
        alert("Unauthorized access attempt.");
      }
    } catch (err: any) {
      // FIX: Improved logging for your Week 10 Log Testing
      console.error("Secure error handling triggered:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-200 p-4 flex justify-end gap-2">
        <Link href="/">
          <Button variant="outline" className="bg-gray-400">Back</Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <form 
          onSubmit={handleLogin} 
          className="w-80 bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <h1 className="text-xl font-semibold mb-4 text-center">Login</h1>
          
          <div className="mb-4">
            <label className="text-gray-600 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-600 text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <Button type="submit" variant="outline" className="bg-gray-400 w-full hover:bg-gray-500 text-white">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}