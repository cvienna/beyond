import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { SSEStreamingApi } from "hono/streaming";

export function ok<T>(
  c: Context,
  data: T,
  statusCode: ContentfulStatusCode = 200,
) {
  return c.json({ sucess: true, data }, statusCode);
}

export async function sendSSE(
  stream: SSEStreamingApi,
  event: "created" | "chunk" | "done",
  data?: Record<string, unknown>,
) {
  await stream.writeSSE({
    event,
    data: JSON.stringify({ success: true, ...data }),
  });
}
