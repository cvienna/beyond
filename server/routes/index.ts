import { Hono } from "hono";
import chat from "./chat";
import completion from "./completion";

const app = new Hono();

app.route("/chat", chat);
app.route("/completion", completion);

export default app;
