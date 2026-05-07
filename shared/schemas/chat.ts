import { selectChatSchema } from "@server/schemas/chat";
import z from "zod";

export const chatResponseSchema = selectChatSchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  removedAt: z.coerce.date().optional(),
});
