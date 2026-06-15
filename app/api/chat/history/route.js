import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Extract userId from query parameters (e.g., /api/chat/history?userId=1)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: "Missing userId parameter" }, { status: 400 });
    }

    const numericUserId = parseInt(userId);

    // Fetch history for this specific user, ordered chronologically
    const history = await sql`
      SELECT content, role, "createdAt" 
      FROM "Chat" 
      WHERE "userId" = ${numericUserId}
      ORDER BY "createdAt" ASC
    `;

    return NextResponse.json({ history }, { status: 200 });

  } catch (error) {
    console.error("History API Error:", error.message);
    return NextResponse.json({ message: "Database Error", error: error.message }, { status: 500 });
  }
}