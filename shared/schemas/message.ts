import { selectMessageSchema } from "@server/schemas/message";
import z from "zod";

export const messageResponseSchema = selectMessageSchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
