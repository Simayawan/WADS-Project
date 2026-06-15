"use client";

import React, { useState } from "react"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    //FRONTEND VALIDATION
    if (password !== confirmPassword) {
      alert("Passwords do not match. Security check failed.");
      return;
    }

    if (password.length < 8) {
      alert("Password too weak. Minimum 8 characters required.");
      return;
    }

    //DATA TRANSMISSION
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        router.push("/login");
      } else {
        alert("Registration failed. Please check your inputs.");
      }
    } catch (err: any) {
      console.error("Connection error during sign-up:", err.message);
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
        <form onSubmit={handleSignUp} className="w-80 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h1 className="text-xl font-semibold mb-4 text-center">Sign Up</h1>
          
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

          <div className="mb-4">
            <label className="text-gray-600 text-sm block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-gray-600 text-sm block mb-1">Repeat Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <Button type="submit" variant="outline" className="bg-gray-400 w-full hover:bg-gray-500 text-white">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}