import { NextResponse } from "next/server";

let memeCount = 0;  // This will reset on server restart/redeploy

export async function GET() {
  return NextResponse.json({ count: memeCount });
}

export async function POST() {
  memeCount++;
  return NextResponse.json({ count: memeCount });
}