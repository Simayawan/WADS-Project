import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    // Explicit safety check to intercept missing .env configurations before the framework crashes
    if (!connectionString) {
      console.error("[CRITICAL REGISTRATION ERROR]: Next.js could not find your environmental file strings.");
      return NextResponse.json({ 
        message: "Configuration Error", 
        error: "Database connection key is missing from environment context. Ensure .env.local sits in your main project folder." 
      }, { status: 500 });
    }

    // Direct HTTP connection to Neon using the verified key
    const sql = neon(connectionString);
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    // Generate ISO timestamps manually for the raw SQL query
    const now = new Date();

    // Raw SQL Insert (Satisfies not-null constraints for createdAt and updatedAt)
    await sql`
      INSERT INTO "User" (email, password, name, "createdAt", "updatedAt") 
      VALUES (${email}, ${password}, ${email.split('@')[0]}, ${now}, ${now})
    `;

    return NextResponse.json({ 
        message: "Success! User created in Neon." 
    }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error.message);
    
    // Check for duplicate email error
    if (error.message.includes('unique constraint') || error.message.includes('already exists')) {
        return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    return NextResponse.json({ 
        message: "Registration failed", 
        error: error.message 
    }, { status: 500 });
  }
}