import {
  createChat,
  getChatById,
  getChats,
  softDeleteChat,
  updateChat,
} from "@server/repository/chat";
import { ok } from "@server/response";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { AppError } from "@server/errors";
import { insertChatSchema, updateChatSchema } from "@server/schemas/chat";

const app = new Hono()
  .get("/", async (c) => {
    const chats = await getChats();
    return ok(c, chats, 200);
  })
  .get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
    const { id } = c.req.valid("param");
    const chat = await getChatById(id);
    if (!chat) throw new AppError(404, "Chat not found");
    return ok(c, chat, 200);
  })
  .post("/", zValidator("json", insertChatSchema), async (c) => {
    const body = c.req.valid("json");
    const chat = await createChat(body);
    if (!chat) throw new AppError(500, "Failed to create chat");
    return ok(c, chat, 201);
  })
  .patch(
    "/:id",
    zValidator("param", z.object({ id: z.uuid() })),
    zValidator("json", updateChatSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const chat = updateChat(id, body);
      if (!chat) throw new AppError(404, "Chat not found");
      return ok(c, chat, 200);
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.uuid() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const chat = await softDeleteChat(id);
      if (!chat) throw new AppError(404, "Chat not found");
      return ok(c, null, 200);
    },
  );

export default app;
