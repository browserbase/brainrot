// import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export default async function getMemeTemplate(message: string, index: number) {
    
    // Set temperature based on index
    const temperatures = {
        0: 0.1,  // First call - more focused
    };
    
    const result = await generateText({
        // model: anthropic('claude-3-5-sonnet-20240620'),
        model: google('gemini-1.5-flash-latest'),
        temperature: temperatures[index as keyof typeof temperatures] ?? 0.6,
        messages: [
            {
                role: 'user',
                content: [
                    { 
                        type: 'text', 
                        text: `You are a meme generator assistant. Generate ONE search term.

Rules:
1. Must be 1 word only (choose common words)
2. Must relate to this message: "${message}"
3. Be creative and diverse in your selections

Return ONLY the search term, nothing else.`
                    },
                ],
            },
        ],
    });

    const searchTerm = result.text.trim();
    console.log('Generated search term:', searchTerm);
    return searchTerm;
}

