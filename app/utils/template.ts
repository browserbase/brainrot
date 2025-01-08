import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

export default async function getMemeTemplate(message: string) {
  const result = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620', {
      cacheControl: true,
    }),
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `You are a meme generator assistant. Given the following message, suggest a single-word search term that best captures the essence of the message for finding a common meme template. The word should be simple and commonly used in memes.

Message: "${message}"

Provide only one word, nothing else.`
          }
        ],
      },
    ],
  });

  return result.text.trim();
}

