import {
  ConstructorParams,
  LogLine,
  Stagehand,
} from "@browserbasehq/stagehand";
import { NextRequest, NextResponse } from "next/server";

interface Meme {
  index: number;
  imageUrl: string;
}

// / should pre-process the message to search a meme based on the message or image
// add context
// ex: image of tweet, give to llm, llm searches for right meme, caption the meme based on query and context from image
// ex: query of "cat", give to llm, llm searches for right meme, caption the meme based on query and context

// if you get off track, try to get back to main menu and start over

export const maxDuration = 300; // Set max duration to 300 seconds (5 minutes)


export async function POST(req: NextRequest) {
  const { message, sourceType = 0 } = await req.json();

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
    // modelName: "gpt-4o-mini",
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      //   apiKey: process.env.GROQ_API_KEY,
      //   apiKey: process.env.OPENAI_API_KEY,
    },
    // llmClient: new AISdkClient({
    //   model: google('gemini-1.5-pro-latest')
    // }),
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
      const sources = [
        {
          url: "https://imgflip.com/memetemplates?sort=top-30-days",
          description: "top templates this month",
        },
        {
          url: "https://imgflip.com/memetemplates?sort=top-30-days&page=2",
          description: "top templates this month",
        },
        {
          url: "https://imgflip.com/memetemplates?sort=top-30-days&page=3",
          description: "top templates this month",
        },
        {
          url: "https://imgflip.com/memetemplates?sort=top-30-days&page=4",
          description: "top templates this month",
        },
        {
          url: "https://imgflip.com/memetemplates?sort=top-all-time&page=5",
          description: "top templates this month",
        },
        // {
        //     url: `https://imgflip.com/memesearch?q=${encodeURIComponent(searchQuery)}`,
        //     description: 'search results'
        // }
      ];

      // Use only the specified source
      const source = sources[sourceType];
      console.log(`Using ${source.description}...`);
      await page.goto(source.url, { waitUntil: "domcontentloaded" });

      try {
        // templateInfo = await page.extract({
        //   schema: z.object({
        //     templateUrl: z.string(),
        //     templateName: z.string(),
        //   }),

        //   // instruction: sourceType === 2
        //   // ? `Look at the meme templates on the page. Find a template that matches the search term "${searchQuery}" and would work well with the message "${message}". Return its URL (starting with '/meme/') and template name exactly as found on the page.`
        //   // :
        //   instruction: `Look at the meme templates on the page. Find a template that would work well with the message "${message}". Return its URL and template name exactly as found on the page.`,
        // });

        templateInfo = await page.act({
          action: `Look at the meme templates on the page. Find a template that would work well with the message "${message}". Click on "Add Caption" for the template you think is the best match.`,
        });

        console.log("Template found:", templateInfo);

        // if (!templateInfo?.templateUrl || !templateInfo?.templateName) {
        //   throw new Error(
        //     `No suitable template found in ${source.description}`
        //   );
        // }
      } catch (error) {
        console.log(`Error finding template in ${source.description}:`, error);
        throw error;
      }

      //   console.log("Extracting template info...");
      //   console.log("Template found:", templateInfo);

      //   console.log("Clicking add caption...");
      //   await page.act({
      //     action: `Click on the add caption for the meme template you find matching the search query the user provided. Click on the one you think is the best match.`,
      //   });

      //   console.log("Generating captions...");
      //   const captionPrompt = await page.extract({
      //     schema: z.object({
      //       textBoxCount: z.number(),
      //       captions: z.array(z.string()),
      //     }),
      //     instruction: `
      //             1. Count the number of text input boxes on the meme template.
      //             2. Generate appropriate captions related to "${message}" for each text box.
      //             Return both the count and an array of captions matching the number of text boxes.`,
      //   });
      //   console.log("Generated captions:", captionPrompt);

      //   console.log("Filling in captions...");
      //   await page.act({
      //     action: `Fill in the meme captions:
      //             1. Locate all text input boxes for the meme
      //             2. ${captionPrompt.captions
      //               .map(
      //                 (caption, idx) =>
      //                   `Type "${caption}" into text box #${idx + 1}`
      //               )
      //               .join("\n3. ")}`,
      //   });

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
        // templateName: templateInfo.templateName,
      };

      console.log("Processing complete:", result);
      results.push(result);

      await page.close();
      await stagehand.close();

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
