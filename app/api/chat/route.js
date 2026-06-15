import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';
import { extractTextFromImage } from './ocr/route.js';


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  
  apiKey: process.env.OPENROUTER_API_KEY || "BUILD_FALLBACK", 
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "HAQ Student App",
  }
});

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Destructure message and messagesHistory together to create a fallback structure
    const { message, messagesHistory, image, userId } = await request.json();
    const numericUserId = parseInt(userId) || 1;

    // Resolve active history timeline loop array
    let activeChatHistory = messagesHistory || [];
    
    // Fallback: If messagesHistory is entirely empty, seed it with the standard input message payload
    if (activeChatHistory.length === 0) {
      activeChatHistory = [{ role: "user", content: message || "Type your question..." }];
    }

    const lastUserMessageIndex = activeChatHistory.length - 1;
    let finalPromptContent = activeChatHistory[lastUserMessageIndex]?.content || message || "";

    // If an image payload is passed, delegate the processing to our standalone utility file
    if (image) {
      console.log("DEBUG: Calling standalone OCR utility module...");
      const extractedText = await extractTextFromImage(image);
      
      // Combine user instructions with the text extracted by your external utility file
      finalPromptContent = `[User Instructions]: ${finalPromptContent || "Please solve this question."}\n\n[Text Extracted From Image]: ${extractedText}`;
      
      // Keep your current live timeline array memory completely synced up!
      if (activeChatHistory[lastUserMessageIndex]) {
        activeChatHistory[lastUserMessageIndex].content = finalPromptContent;
      }
    }

    // Pass the entire updated multi-turn conversation down to DeepSeek for continuous memory flow
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-v4-flash", 
      messages: [
        { 
          role: "system", 
          content: "You are the HAQ App assistant. Provide clear, concise, step-by-step educational breakdowns to help the student understand the homework problem." 
        },
        ...activeChatHistory // Spreads the continuous history array directly into the model context window
      ],
    });

    const aiReply = completion.choices[0].message.content;

    // Build defensive string fallback assignments
    let savedContent = "";
    if (image) {
      const displayMessage = message || (messagesHistory && messagesHistory[lastUserMessageIndex]?.content);
      savedContent = `[OCR Uploaded] ${displayMessage && displayMessage.trim() ? displayMessage : "Image Question"}`;
    } else {
      // Fallback progressively through history indices down to standard body prompts
      savedContent = (messagesHistory && messagesHistory[lastUserMessageIndex]?.content) || message || "";
    }

    // If string evaluates to null/empty/spaces, push an absolute fallback string
    if (!savedContent || typeof savedContent !== 'string' || !savedContent.trim()) {
      savedContent = "Normal Chat Question";
    }

    const secureAiReply = aiReply && aiReply.trim() ? aiReply : "I am processing your query.";
    const now = new Date().toISOString();
    
    // Executes atomic multi-row raw insertion query safely
    await sql`
      INSERT INTO "Chat" (content, role, "userId", "createdAt", "updatedAt") 
      VALUES (${savedContent}, 'user', ${numericUserId}, ${now}, ${now}),
             (${secureAiReply}, 'assistant', ${numericUserId}, ${now}, ${now})
    `;

    return NextResponse.json({ reply: aiReply }, { status: 200 });

  } catch (error) {
    console.error("Main Chat Route Error:", error.message);
    return NextResponse.json({ message: "Internal Processing Error", error: error.message }, { status: 500 });
  }
}

