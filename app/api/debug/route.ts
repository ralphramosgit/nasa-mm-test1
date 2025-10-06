import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasMapboxToken: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    tokenLength: process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  });
}