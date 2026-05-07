import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import type { ChatEvent, ChatMessageEvent, ChatCompletionEvent } from "./types";
import { SSEStreamingApi } from "hono/streaming";

export function ok<T>(
  c: Context,
  data: T,
  statusCode: ContentfulStatusCode = 200,
) {
  return c.json({ sucess: true, data }, statusCode);
}

export async function writeSSE(
  stream: SSEStreamingApi,
  data: ChatEvent | ChatMessageEvent | ChatCompletionEvent,
) {
  await stream.writeSSE({
    event: data.event,
    data: JSON.stringify(data.data),
  });
}
