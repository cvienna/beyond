import type {
  ChatEvent,
  ChatCompletionEvent,
  ChatMessageEvent,
} from "@server/types";
import { ModelId } from "@shared/models";
import { client } from "./client";

export async function streamCompletion(
  body: {
    chatId?: string;
    model: ModelId;
    prompt: string;
    createdAt: Date;
  },
  onEvent: (event: ChatEvent | ChatMessageEvent | ChatCompletionEvent) => void,
) {
  const res = await client.api.completion.$post({ json: body });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;

    for (const line of lines) {
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const raw = line.slice(5).trim();
        if (!raw || raw === "[DONE]") continue;
        onEvent({
          event: currentEvent,
          data: JSON.parse(raw),
        } as ChatEvent | ChatMessageEvent | ChatCompletionEvent);
      }
    }
  }
}
