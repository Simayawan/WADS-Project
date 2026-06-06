"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentLayout() {
  // ensures that only logged users can enter this URL
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session based on your login tracking scheme ("userId")
    const savedUserId = localStorage.getItem("userId");
    
    if (!savedUserId) {
      // If not logged in, boot them to the landing/login page
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Logout handler to safely clear the state session
  const handleSignOut = () => {
    localStorage.removeItem("userId");
    router.push("/");
  };

  // Render initialization loading element to prevent static compilation jumps
  if (isAuthorized === null) {
    return (
      <div className="h-screen flex items-center justify-center font-sans bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR - Adjusted with active structural routes and Sticky Top feature */}
      <div className="bg-gray-200 p-4 flex justify-end gap-2 sticky top-0 z-50 shadow-sm">
        <Link href="/studentHomePage/tool/ask">
          <Button variant="outline" className="bg-gray-400">
            Chatbot
          </Button>
        </Link>

        <Button 
          variant="outline" 
          className="bg-gray-400"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>

      <div>
        <h1 className="mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6 text-center text-2xl">
          Welcome to Homework Answer & Question Assistant
        </h1>
      </div>
      
      <h1 className="mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6 text-justify text-2xl">
        What is Homework Answer & Question Assistant? it is as the name says, this web app helps students to find the solution to questions they don't understand!
      </h1>

      <div className="mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6">
        <h1 className="italic text-center text-xl">Features!</h1>
        <div>
          <p>Chatbot!</p>
          <p>Image Parsing!</p>
        </div>
      </div>
    </div>
  );
}