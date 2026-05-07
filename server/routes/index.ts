import { Hono } from "hono";
import chats from "./chat";
import message from "./message";
import completion from "./completion";

const app = new Hono();

app.route("/chat", chats);
app.route("/message", message);
app.route("/completion", completion);

export default app;
