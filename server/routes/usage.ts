import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  // Retrieve usage data, such as:
  //  * Token usage last n days (independant calculation, not fetched from provider)
  //  * Credits remaining (fetched from provider - if possible)
});
