import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
import dbConnect from '../../../config/db';
import User from '../../../models/user'; 

export async function GET(request: NextRequest) {
  try {
    await dbConnect(); 

    return NextResponse.json({ 
      success: true, 
      message: "Connected to DB and App Router is functioning" 
    }, { status: 200 });

  } catch (error: any) { 
    console.error("Test Route Error:", error.message || error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error" 
    }, { status: 500 });
  }
}