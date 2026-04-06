import { zValidator } from "@hono/zod-validator";
import { streamSSE } from "hono/streaming";
import { Hono } from "hono";
import z from "zod";
import { streamCompletion } from "@server/services/completion";
import { sendSSE } from "@server/response";
import { createMessage, getMessagesByChat } from "@server/repository/message";
import { createChat } from "@server/repository/chat";
import { AppError } from "@server/errors";
import OpenAI from "openai";
import { Chat } from "@server/schemas/chat";

const completion = new Hono();

completion.post(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator(
    "json",
    z.object({ prompt: z.string(), model: z.enum(["llama-3.2-3b"]) }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const { prompt, model } = c.req.valid("json");

    let chatId = id;
    let chat: Chat | null = null;
    const messages = await getMessagesByChat(id);

    if (messages.length === 0) {
      chat = await createChat({
        title: "Lorem ipsum, dolor sit amet.",
        icon: "🪼",
      });

      if (!chat) throw new AppError(500, "Failed to create chat");
      chatId = chat.id;
    }

    const userMessage = await createMessage({
      chatId,
      content: prompt,
      from: "user",
    });
    if (!userMessage) throw new AppError(500, "Failed to create message");

    const allMessages: OpenAI.ChatCompletionMessageParam[] = [
      ...messages.map((m) => ({
        role: m.from as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: prompt },
    ];

    let assistantResponse = "";

    return streamSSE(c, async (stream) => {
      if (chat) await sendSSE(stream, "created", { chat });

      for await (const chunk of streamCompletion(allMessages, model)) {
        assistantResponse += chunk;
        await sendSSE(stream, "chunk", { chunk });
      }

      await sendSSE(stream, "done", {});
      await createMessage({
        chatId,
        content: assistantResponse,
        from: "assistant",
      });
    });
  },
);

export default completion;
