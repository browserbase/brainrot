import { Redis } from '@upstash/redis'
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET() {
  const count = await redis.get<number>('meme-count') || 0;
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await redis.incr('meme-count');
  return NextResponse.json({ count });
}