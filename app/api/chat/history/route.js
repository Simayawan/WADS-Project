import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon("postgresql://neondb_owner:npg_Ex4adS0DFTgX@ep-crimson-dust-aofjvsj8-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");
    
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