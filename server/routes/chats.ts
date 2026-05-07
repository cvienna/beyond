import {
  createChat,
  getChatById,
  getChats,
  softDeleteChat,
  updateChat,
} from "@server/repository/chats";
import { ok } from "@server/response";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { AppError } from "@server/errors";
import { insertChatsSchema, updateChatsSchema } from "@server/schemas/chats";

const chat = new Hono();

chat.get("/", async (c) => {
  const chats = await getChats();
  return ok(c, chats, 200);
});

chat.get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
  const { id } = c.req.valid("param");
  const chat = await getChatById(id);
  if (!chat) throw new AppError(404, "Chat not found");
  return ok(c, chat, 200);
});

chat.post("/", zValidator("json", insertChatsSchema), async (c) => {
  const body = c.req.valid("json");
  const chat = await createChat(body);
  if (!chat) throw new AppError(500, "Failed to create chat");
  return ok(c, chat, 201);
});

chat.patch(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator("json", updateChatsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const chat = updateChat(id, body);
    if (!chat) throw new AppError(404, "Chat not found");
    return ok(c, chat, 200);
  },
);

chat.delete(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const chat = await softDeleteChat(id);
    if (!chat) throw new AppError(404, "Chat not found");
    return ok(c, null, 200);
  },
);

export default chat;
