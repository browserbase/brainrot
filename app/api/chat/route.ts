import {
  ConstructorParams,
  LogLine,
  Stagehand,
} from "@browserbasehq/stagehand";
import { NextRequest, NextResponse } from "next/server";
import { MAX_CONCURRENT_MEMES } from "../../config/constants";
import { z } from "zod";
import { sendMemeNotification } from "@/utils/sms";

interface Meme {
  index: number;
  imageUrl: string;
}

// / should pre-process the message to search a meme based on the message or image
// add context
// ex: image of tweet, give to llm, llm searches for right meme, caption the meme based on query and context from image
// ex: query of "cat", give to llm, llm searches for right meme, caption the meme based on query and context

// if you get off track, try to get back to main menu and start over

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { message, sourceType = 0 /* , phoneNumber */ } = await req.json();
  
  // console.log('Request received with phone:', phoneNumber);

  const StagehandConfig: ConstructorParams = {
    env:
      process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
        ? "BROWSERBASE"
        : "LOCAL",
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    headless: false,
    domSettleTimeoutMs: 30_000,
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      region: "us-east-1",
    },
    enableCaching: false,
    modelName: "claude-3-5-sonnet-latest",
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    verbose: 0,
    logger: (message: LogLine) =>
      console.log(`[stagehand::${message.category}] ${message.message}`),
  };

  const stagehand = new Stagehand(StagehandConfig);

  try {
    console.log(
      `Starting POST request processing for template ${sourceType}...`
    );
    const results: Meme[] = [];

    console.log("Initializing Stagehand instance...");
    await stagehand.init();

    try {
      console.log("Starting meme processing...");
      const page = await stagehand.page;

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
      await page.goto(source.url, { waitUntil: "domcontentloaded" });

      try {
        templateInfo = await page.act({
          action: `Look at the meme templates on the page. Find a template that would work well with the message "${message}". Click on "Add Caption" for the template you think is the best match.`,
        });

        console.log("Template found:", templateInfo);

        templateInfo = await page.extract({
          instruction: `Extract the template name from the URL of the template you selected.`,
          schema: z.object({
            name: z.string(),
          }),
        });

        console.log("Template name:", templateInfo.name);
      } catch (error) {
        console.log(`Error finding template in ${source.description}:`, error);
        throw error;
      }

      console.log("Filling in captions...");
      await page.act({
        action: `Based on the message "${message}", fill in the text boxes with the appropriate caption that relates to the meme template. Please understand the meme format and fill in the text boxes accordingly. DO NOT GO BACK TO THE MAIN MENU.`,
      });

      console.log("Generating final meme...");
      await page.act({
        action: "click the button labeled 'Generate Meme'",
      });

      console.log("Extracting image URL...");
      const imageUrlInput = await page.locator(".img-code-wrap input").first();
      const imageUrl = await imageUrlInput.inputValue();

      const result = {
        index: sourceType,
        imageUrl: imageUrl,
        templateName:
          (templateInfo as { name?: string }).name || "Unknown Template",
      };

      console.log("Processing complete:", result);
      results.push(result);

      await page.close();
      await stagehand.close();

      // Increment meme counter
      try {
        const baseUrl = process.env.PRODUCTION_URL || "http://localhost:3000";
        
        // Remove any trailing slash and ensure no double https://
        const cleanBaseUrl = baseUrl.replace(/\/$/, '').replace(/^https?:\/\//, '');
        
        console.log("Base URL for counter:", `https://${cleanBaseUrl}/api/meme-count`);

        await fetch(`https://${cleanBaseUrl}/api/meme-count`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to increment meme counter:", error);
        // Continue execution even if counter fails
      }

      /*
      console.log("Phone number:", phoneNumber);
      console.log("Image URL:", imageUrl);
      console.log("Environment variables:", {
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
      });
      console.log("Sending SMS notification...");
      if (phoneNumber) {
        console.log('========= PHONE NUMBER CHECK =========');
        console.log('Phone number before SMS:', phoneNumber);
        console.log('Phone number type:', typeof phoneNumber);
        console.log('Phone number length:', phoneNumber.length);
        
        try {
          const smsResult = await sendMemeNotification(phoneNumber, [imageUrl]);
          console.log("SMS Result:", smsResult);
        } catch (error) {
          console.error("SMS Error:", error);
        }
      }
      */

      return NextResponse.json(results);
    } catch (error) {
      console.error("Error during meme generation:", error);
      await stagehand.close();
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fatal error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
