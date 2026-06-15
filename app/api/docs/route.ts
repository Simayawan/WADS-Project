// app/api/docs/route.js
import { NextResponse } from 'next/server';
import { spec } from './swagger';

export async function GET() {
  return NextResponse.json(spec);
}