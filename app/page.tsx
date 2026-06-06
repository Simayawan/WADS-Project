import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <div className= "bg-gray-200 p-4 flex justify-end gap-2">
        <Link href="/login">
        <Button variant="outline" className="bg-gray-400">
          Login
        </Button>
        </Link>

        <Link href= "/signIn">
          <Button variant="outline" className="bg-gray-400">
            Sign Up
            </Button>
        </Link>
      </div>

      <div>
        <h1 className= "mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6 text-center text-2xl">
          Welcome to Homework Answer & Question Assistant
        </h1>
      </div>
        <h1 className= "mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6 text-justify text-2xl">
          What is Homework Answer & Question Assistant? it is as the name says, this web app helps students to find the solution to questions they don't understand!
        </h1>
      <div>

      </div>

      <div className= "mx-auto w-350 bg-white p-6 rounded-xl shadow-md mt-6">
        <h1 className= 'italic text-center text-xl'>Features!</h1>
        <div>
          <p>Chatbot!</p>
          <p>Image Parsing!</p>
        </div>
      </div>
    </div>
  );
}
