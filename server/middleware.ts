import { Context } from "hono";
import { AppError } from "./errors";
import { ContentfulStatusCode } from "hono/utils/http-status";

export function ErrorMiddleware(err: Error, c: Context) {
  if (err instanceof AppError) {
    return c.json(
      { success: false, message: err.message },
      err.statusCode as ContentfulStatusCode, // Consider ContentlessStatusCode
    );
  }

  return c.json({ success: false, message: "Internal server error" }, 500);
}
