import { Chat } from "./schemas/chats";
import { Message } from "./schemas/message";

export type ChatEvent = {
  event: "chat.create";
  data: Chat & { completionId: string };
};

export type ChatMessageEvent = {
  event: "chat.message.create";
  data: Message & { completionId: string };
};

export type ChatCompletionEvent =
  | {
      event: "chat.completion.start";
      data: {
        id: string;
        model: string;
        createdAt: Date;
        delta: {
          role: "assistant" | "user";
        };
      };
    }
  | {
      event: "chat.completion.chunk";
      data: {
        id: string;
        delta:
          | {
              content: string;
            }
          | {
              reasoningContent: string;
            };
      };
    }
  | {
      event: "chat.completion.stop";
      data: {
        id: string;
        usage: {
          ttft: number;
          duration: number;
          promptTokens: number;
          completionTokens: number;
        };
      };
    };
