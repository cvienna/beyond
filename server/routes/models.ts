import { ok } from "@server/response";
import { Hono } from "hono";
import { gateway } from "ai";

const app = new Hono();

app.get("/", async (c) => {
  const availableModels = await gateway.getAvailableModels();

  return ok(c, availableModels, 200);
});
