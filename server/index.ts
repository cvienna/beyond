import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import routes from "./routes";
import { env } from "@shared/env";

const app = new Hono();

app.use("*", cors({ origin: "http://localhost:5173" }));
app.route("/api", routes);

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
