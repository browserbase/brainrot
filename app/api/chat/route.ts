import {
  Stagehand,
} from "@browserbasehq/stagehand";
import { NextRequest, NextResponse } from "next/server";
import { MAX_CONCURRENT_MEMES } from "../../config/constants";
import { z } from "zod";
// import { sendMemeNotification } from "@/utils/sms";
import Browserbase from "@browserbasehq/sdk";

interface Meme {
  index: number;
  imageUrl: string;
}

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  console.log("Received request for meme generation");
  const { message, sourceType = 0, sessionId, isLastSession = false } = await req.json();

  const browserbase = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY,
  });

  const debugUrl = await browserbase.sessions.debug(sessionId);
  console.log("Using existing session debug URL:", debugUrl);

  let stagehand: Stagehand | null = null;
  const results: Meme[] = [];

  try {
    const stagehandConfig: any = {
      env:
        process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
          ? "BROWSERBASE"
          : "LOCAL",
      apiKey: process.env.BROWSERBASE_API_KEY,
      projectId: process.env.BROWSERBASE_PROJECT_ID,
      domSettleTimeout: 30000,
      model: "anthropic/claude-3-5-sonnet-20241022",
      // The ANTHROPIC_API_KEY env var must be set for this to work
    };
    
    // Connect to existing session from /api/session endpoint to avoid creating new session
    if (sessionId) {
      stagehandConfig.browserbaseSessionID = sessionId;
      console.log("Connecting to existing Browserbase session:", sessionId);
    }
    
    console.log("Stagehand config:", {
      env: stagehandConfig.env,
      apiKey: stagehandConfig.apiKey ? "***" : "NOT SET",
      projectId: stagehandConfig.projectId ? "***" : "NOT SET",
      browserbaseSessionID: stagehandConfig.browserbaseSessionID || "WILL CREATE NEW",
      model: stagehandConfig.model,
    });

    stagehand = new Stagehand(stagehandConfig);
    await stagehand.init();

    console.log(
      `Starting POST request processing for template ${sourceType}...`
    );

    console.log("Initializing Stagehand instance...");
    console.log("Available pages in context:", stagehand.context.pages().length);
    const pages = stagehand.context.pages();
    console.log("Pages:", pages);
    
    if (pages.length === 0) {
      throw new Error("No pages available in context after init");
    }
    
    const page = pages[0];
    console.log("Using page:", { url: page.url(), title: page.title() });

    try {
      console.log("Starting meme processing...");
      
      // Wait a bit for the session to be fully ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Navigating to search page...");
      let templateInfo;
      const sources = Array(MAX_CONCURRENT_MEMES)
        .fill(null)
        .map((_, index) => ({
          name: `Page ${index + 1} Templates`,
          url: `https://imgflip.com/memetemplates?sort=top-30-days${
            index > 0 ? `&page=${index + 1}` : ""
          }`,
          description: `Top templates this month - Page ${index + 1}`,
        }));

      console.log(
        "Available meme sources:",
        sources.map((s) => `${s.name}: ${s.description}`)
      );

      // Use only the specified source
      const source = sources[sourceType];
      console.log(`Using ${source.description}...`);
      console.log("Navigating to URL:", source.url);
      try {
        await page.goto(source.url, { waitUntil: "domcontentloaded" });
        console.log("Page loaded successfully");
      } catch (gotoError) {
        console.error("Error in page.goto():", gotoError);
        throw gotoError;
      }

      try {
        console.log("About to call stagehand.act()...");
        await stagehand.act(
          `Look at the meme templates on the page. Find a template that would work well with the message "${message}". Click on "Add Caption" for the template you think is the best match.`
        );

        console.log("Template found");

        const extractedData = await stagehand.extract(
          `Extract the template name from the URL of the template you selected.`,
          z.object({
            name: z.string(),
          })
        );

        templateInfo = extractedData;
        console.log("Template name:", (templateInfo as any).name);
      } catch (error) {
        console.error(`Error finding template in ${source.description}:`, error);
        console.error("Full error stack:", (error as any).stack);
        throw error;
      }

      console.log("Filling in captions...");
      try {
        await stagehand.act(
          `Based on the message "${message}", fill in the text boxes with the appropriate caption that relates to the meme template. Please understand the meme format and fill in the text boxes accordingly. DO NOT GO BACK TO THE MAIN MENU.`
        );
      } catch (error) {
        console.error("Error filling captions:", error);
        console.error("Error stack:", (error as any).stack);
        throw error;
      }

      console.log("Generating final meme...");
      try {
        await stagehand.act(
          "click the button labeled 'Generate Meme'"
        );
      } catch (error) {
        console.error("Error generating meme:", error);
        console.error("Error stack:", (error as any).stack);
        throw error;
      }

      console.log("Extracting image URL...");
      const imageUrlInput = await page.locator(".img-code-wrap input").first();
      const imageUrl = await imageUrlInput.inputValue();

      const result = {
        index: sourceType,
        imageUrl: imageUrl,
        templateName:
          (templateInfo as { name?: string }).name || "Unknown Template",
        debugUrl: debugUrl.debuggerFullscreenUrl.replace(
          "https://www.browserbase.com/devtools-fullscreen/inspector.html",
          "https://www.browserbase.com/devtools-internal-compiled/index.html"
        ),
      };

      console.log("this is the valid debug URL:", result.debugUrl);

      console.log("Processing complete:", result);
      results.push(result);

      // Increment meme counter
      try {
        const baseUrl = process.env.PRODUCTION_URL || "http://localhost:3000";

        // Remove any trailing slash and ensure no double https://
        const cleanBaseUrl = baseUrl
          .replace(/\/$/, "")
          .replace(/^https?:\/\//, "");

        console.log(
          "Base URL for counter:",
          `https://${cleanBaseUrl}/api/meme-count`
        );

        await fetch(`https://${cleanBaseUrl}/api/meme-count`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment meme counter:", error);
        // Continue execution even if counter fails
      }
      return NextResponse.json(results);
    } catch (error) {
      console.error("Error during meme generation:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
      console.error("Error stack:", (error as any).stack);
      await stagehand.close();
      return NextResponse.json(
        { error: "Failed to process request", details: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fatal error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  } finally {
    // Only close if it's the last session
    if (isLastSession) {
      if (stagehand) {
        await stagehand.close().catch(console.error);
      }
    }
  }
}
