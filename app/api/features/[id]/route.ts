import { NextRequest, NextResponse } from 'next/server';

// In Next.js 15, 'params' is a Promise that must be awaited
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Define as a Promise
) {
  const { id } = await context.params; // Await the params here

  return NextResponse.json({ 
    message: `Feature detail for ID: ${id}`,
    data: null 
  });
}