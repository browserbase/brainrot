import { ConstructorParams, LogLine, Stagehand } from "@browserbasehq/stagehand";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import getMemeTemplate from '@/app/utils/template';

// should pre-process the message to search a meme based on the message or image
// add context 
// ex: image of tweet, give to llm, llm searches for right meme, caption the meme based on query and context from image
// ex: query of "cat", give to llm, llm searches for right meme, caption the meme based on query and context

// if you get off track, try to get back to main menu and start over



interface Meme {
    index: number;
    imageUrl: string;
    templateName: string;
}

export async function POST(req: NextRequest) {

    const StagehandConfig: ConstructorParams = {
        env:
          process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
            ? "BROWSERBASE"
            : "LOCAL",
        apiKey: process.env.BROWSERBASE_API_KEY,
        projectId: process.env.BROWSERBASE_PROJECT_ID,
        // debugDom: true,
        headless: false,
        domSettleTimeoutMs: 30_000 /* Timeout for DOM to settle in milliseconds */,
        browserbaseSessionCreateParams: {
          projectId: process.env.BROWSERBASE_PROJECT_ID!,
          region: "us-east-1"
        },
        enableCaching: true /* Enable caching functionality */,
        // browserbaseSessionID:
        //   undefined /* Session ID for resuming Browserbase sessions */,
        modelName: "claude-3-5-sonnet-latest" /* Name of the model to use */,
        modelClientOptions: {
          apiKey: process.env.ANTHROPIC_API_KEY,
        } /* Configuration options for the model client */,
        verbose: 0,
        logger: (message: LogLine) =>
            console.log(
              `[stagehand::${message.category}] ${message.message}`,
            )
      };
    
    const stagehand = new Stagehand(StagehandConfig);

    try {
        console.log('Starting POST request processing...');
        const results: Meme[] = [];

        console.log('Initializing Stagehand instance...');
        await stagehand.init();
        
        const { message } = await req.json();
        console.log('Received message:', message);
        
        const searchQuery = await getMemeTemplate(message);
        console.log('Optimized search query:', searchQuery);
        
        try {
            console.log('Starting meme processing...');
            const page = await stagehand.page;
            
            console.log('Navigating to search page...');
            await page.goto(`https://imgflip.com/memesearch?q=${encodeURIComponent(searchQuery)}`, { 
                waitUntil: "domcontentloaded" 
            });
            
            console.log('Extracting template info...');
            const templateInfo = await page.extract({
                schema: z.object({
                    templateUrl: z.string(),
                    templateName: z.string()
                }),
                instruction: `Look at the search results on the page. For the first meme template shown, find its URL (it should start with '/meme/') and the template name. Return these exactly as found on the page.`
            });
            console.log('Template found:', templateInfo);

            console.log('Clicking add caption...');
            await page.act({
                action: `Click on the add caption for the meme template you find matching the search query the user provided. Click on the one you think is the best match.`
            });

            console.log('Generating captions...');
            const captionPrompt = await page.extract({
                schema: z.object({
                    textBoxCount: z.number(),
                    captions: z.array(z.string())
                }),
                instruction: `
                1. Count the number of text input boxes on the meme template.
                2. Generate appropriate captions related to "${message}" for each text box.
                Return both the count and an array of captions matching the number of text boxes.`
            });
            console.log('Generated captions:', captionPrompt);

            console.log('Filling in captions...');
            await page.act({
                action: `Fill in the meme captions:
                1. Locate all text input boxes for the meme
                2. ${captionPrompt.captions.map((caption, idx) => 
                    `Type "${caption}" into text box #${idx + 1}`
                ).join('\n3. ')}`
            });

            console.log('Generating final meme...');
            await page.act({
                action: "click the button labeled 'Generate Meme'"
            });

            console.log('Extracting image URL...');
            const imageUrlInput = await page.locator('.img-code-wrap input').first();
            const imageUrl = await imageUrlInput.inputValue();

            const result = {
                index: 0,
                imageUrl: imageUrl,
                templateName: templateInfo.templateName
            };

            console.log('Processing complete:', result);
            results.push(result);

            await page.close();
            await stagehand.close();
            
            return NextResponse.json(results);

        } catch (error) {
            console.error("Error during meme generation:", error);
            await stagehand.close();
            return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
        }
    } catch (error) {
        console.error("Fatal error in POST request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}



