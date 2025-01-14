import { NextRequest, NextResponse } from "next/server";
import Browserbase from "@browserbasehq/sdk";

export async function POST(req: NextRequest) {
  try {
    const client = new Browserbase({
      apiKey: process.env["BROWSERBASE_API_KEY"],
    });
    
    const session = await client.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      region: "us-east-1",
    });

    const debugUrl = await client.sessions.debug(session.id);

    return NextResponse.json({
      sessionId: session.id,
      debugUrl: debugUrl.debuggerFullscreenUrl,
      region: "us-east-1"
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
