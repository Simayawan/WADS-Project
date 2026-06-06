import { NextResponse } from 'next/server';
import { features } from '@/lib/db';

/**
 * @swagger
 * /api/features:
 * get:
 * summary: Get all features
 * description: Returns a list of all available homework assistant features.
 * responses:
 * 200:
 * description: A JSON array of features
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: integer
 * name:
 * type: string
 * description:
 * type: string
 */
export async function GET() {
  return NextResponse.json(features, { status: 200 });
}