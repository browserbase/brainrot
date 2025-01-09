import { AvailableModel } from "@browserbasehq/stagehand";
// import { CoreMessage } from "ai";

type CoreMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | Array<{ text?: string; image_url?: { url: string } }>;
};

export interface CreateChatCompletionOptions {
  options: {
    messages: CoreMessage[];
    response_model?: {
        schema: Record<string, unknown>;
    };
    tools?: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    }[];
  };
}

export abstract class LLMClient {
  protected modelId: AvailableModel;

  constructor(modelId: AvailableModel) {
    this.modelId = modelId;
  }

  abstract createChatCompletion<T>(options: CreateChatCompletionOptions): Promise<T>;
} 