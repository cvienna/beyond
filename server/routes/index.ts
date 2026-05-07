import { Hono } from "hono";
import chat from "./chat";
import message from "./message";
import completion from "./completion";

const app = new Hono()
  .route("/chat", chat)
  .route("/message", message)
  .route("/completion", completion);

export type AppRoutes = typeof app;
export default app;
