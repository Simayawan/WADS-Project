import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    // Explicit error check to verify if Next.js actually found the .env.local file
    if (!connectionString) {
      console.error("[CRITICAL AUTH ERROR]: Next.js could not load your .env.local file keys.");
      return NextResponse.json({ 
        message: "Configuration Error", 
        error: "Database connection key is missing from environment context. Ensure .env.local sits in your main project folder." 
      }, { status: 500 });
    }

    // Initialize neon securely using the validated environment key
    const sql = neon(connectionString);
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    // Query for the user by email
    const users = await sql`SELECT * FROM "User" WHERE email = ${email} LIMIT 1`;
    const user = users[0];

    // Verify user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Create response and set cookie
    const response = NextResponse.json({ 
      message: "Login successful!", 
      user: { id: user.id, email: user.email } 
    }, { status: 200 });
    
    // Simple session cookie for middleware
    response.cookies.set('token', 'session_active', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
    });

    return response;

  } catch (error) {
    console.error("Login Error:", error.message);
    return NextResponse.json({ 
        message: "Internal Server Error", 
        error: error.message 
    }, { status: 500 });
  }
}

