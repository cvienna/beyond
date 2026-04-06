import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { env } from "@shared/env";

const app = new Hono();

app.get("/api/test", async (c) => {
  return c.json("Hello world", 200);
});

export function startServer() {
  serve(
    {
      fetch: app.fetch,
      port: env.PORT,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
}
