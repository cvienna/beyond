import { zValidator } from "@hono/zod-validator";
import { AppError } from "@server/errors";
import {
  createMessage,
  getMessagesByChat,
  updateMessage,
} from "@server/repository/message";
import { ok } from "@server/response";
import {
  insertMessageSchema,
  updateMessageSchema,
} from "@server/schemas/message";
import { Hono } from "hono";
import z from "zod";

const message = new Hono();

message.get(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  async (c) => {
    const { id } = c.req.valid("param");
    const messages = await getMessagesByChat(id);
    return ok(c, messages, 200);
  },
);

message.post(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator("json", insertMessageSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const message = await createMessage({ ...body, chatId: id });
    if (!message) throw new AppError(500, "Failed to create message");
    return ok(c, message, 201);
  },
);

message.patch(
  "/:id",
  zValidator("param", z.object({ id: z.uuid() })),
  zValidator("json", updateMessageSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const message = await updateMessage(id, body);
    if (!message) throw new AppError(404, "Message not found");
    return ok(c, message, 200);
  },
);

export default message;
