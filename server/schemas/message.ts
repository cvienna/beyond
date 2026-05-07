import {
  pgSchema,
  uuid,
  text,
  timestamp,
  integer,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { chat } from "./chat";

export const messageSchema = pgSchema("message");

export const roleEnum = messageSchema.enum("role", ["user", "assistant"]);

export const message = messageSchema.table("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  reasoningContent: text("reasoning_content"),
  role: roleEnum().notNull(),
  model: text("model").notNull(), // nullable for users?
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  ttft: real("ttft"),
  duration: real("duration"),
  feedback: jsonb("feedback").$type<{
    review: "good" | "bad";
    note?: string;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(message, {
  content: z.string().min(1),
  reasoningContent: z.string().optional(),
  role: z.enum(["user", "assistant"]),
  model: z.string(),
  promptTokens: z.number().optional(),
  completionTokens: z.number().optional(),
  ttft: z.number().optional(),
  duration: z.number().optional(),
  feedback: z
    .object({ review: z.enum(["good", "bad"]), note: z.string().optional() })
    .optional(),
}).pick({
  content: true,
  reasoningContent: true,
  role: true,
  model: true,
  promptTokens: true,
  completionTokens: true,
  ttft: true,
  duration: true,
  feedback: true,
});

export const updateMessageSchema = insertMessageSchema.partial();

export const selectMessageSchema = createSelectSchema(message);

export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
export type InsertMessageInput = z.infer<typeof insertMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
