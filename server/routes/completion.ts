import { Hono } from "hono";

import { streamSSE } from "hono/streaming";
import { writeSSE } from "@server/response";

import z from "zod";
import { zValidator } from "@hono/zod-validator";

import { streamText } from "ai";
import { aiGateway } from "@server/lib/aiGateway";

import { createChat, updateChat } from "@server/repository/chat";
import { createMessage, getMessagesByChat } from "@server/repository/message";
import { Chat } from "@server/schemas/chat";
import { ModelId } from "@shared/models";
import { randomEmoji } from "@server/utils/completion";
import { generateTitle } from "@server/services/completion";

const app = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      chatId: z.uuid().optional(),
      model: z.string() as z.ZodType<ModelId>,
      prompt: z.string(),
    }),
  ),
  async (c) => {
    const { chatId, model, prompt } = c.req.valid("json");

    const completionId = crypto.randomUUID();

    let chat: Chat | null = null;
    let messages: { role: "user" | "assistant"; content: string }[] = [
      { role: "user", content: prompt },
    ];

    if (chatId) {
      const rawMessages = await getMessagesByChat(chatId);
      messages = [
        ...(rawMessages as { role: "assistant" | "user"; content: string }[]),
        ...messages,
      ];
    } else {
      chat = await createChat({
        title: "Untitled",
        icon: randomEmoji(),
      });
    }

    const newMessage = await createMessage({
      chatId: chatId ? chatId : (chat?.id ?? ""),
      model,
      role: "user",
      content: prompt,
    });

    const result = streamText({
      model: aiGateway("accounts/fireworks/models/gpt-oss-20b"),
      messages,
    });

    const start = Date.now();
    let ttft: number | null = null;
    let content: string = "";
    let reasoningContent: string | null = null;

    const titlePromise = generateTitle(prompt);

    return streamSSE(c, async (s) => {
      if (chat) {
        await writeSSE(s, {
          event: "chat.create",
          data: { ...chat, completionId },
        });
      }

      for await (const chunk of result.fullStream) {
        if (chunk.type === "start") {
          await writeSSE(s, {
            event: "chat.message.create",
            data: { ...newMessage, completionId },
          });
          await writeSSE(s, {
            event: "chat.completion.start",
            data: {
              id: completionId,
              createdAt: new Date(start),
              model,
              delta: { role: "assistant" },
            },
          });
        } else if (chunk.type === "reasoning-delta") {
          if (!ttft) ttft = Date.now() - start;
          reasoningContent = (reasoningContent ?? "") + chunk.text;

          await writeSSE(s, {
            event: "chat.completion.chunk",
            data: {
              id: completionId,
              delta: {
                reasoningContent: chunk.text,
              },
            },
          });
        } else if (chunk.type === "text-delta") {
          if (!ttft) ttft = Date.now() - start;
          content = content + chunk.text;

          await writeSSE(s, {
            event: "chat.completion.chunk",
            data: {
              id: completionId,
              delta: {
                content: chunk.text,
              },
            },
          });
        } else if (chunk.type === "finish") {
          const now = Date.now();
          const title = await titlePromise;

          await writeSSE(s, {
            event: "chat.update",
            data: {
              completionId,
              title,
            },
          });
          await writeSSE(s, {
            event: "chat.completion.stop",
            data: {
              id: completionId,
              usage: {
                promptTokens: chunk.totalUsage.inputTokens!,
                completionTokens: chunk.totalUsage.outputTokens!,
                duration: (now - start - (ttft ?? 0)) / 1000,
                ttft: (ttft ?? 0) / 1000,
              },
            },
          });

          await createMessage({
            id: completionId,
            chatId: chatId ? chatId : (chat?.id ?? ""),
            content,
            reasoningContent,
            role: "assistant",
            model,
            promptTokens: chunk.totalUsage.inputTokens!,
            completionTokens: chunk.totalUsage.outputTokens!,
            ttft: ttft,
            duration: (now - start - (ttft ?? 0)) / 1000,
          });
          await updateChat(chatId ? chatId : (chat?.id ?? ""), { title });
        }
      }
    });
  },
);

export default app;
