import { Redis } from '@upstash/redis'
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function GET() {
  try {
    const count = await redis.get<number>('meme-count') || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Redis GET error:', error);
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const count = await redis.incr('meme-count');
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Redis POST error:', error);
    return NextResponse.json({ count: 0 });
  }
}