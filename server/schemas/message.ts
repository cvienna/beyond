import { pgSchema, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { chat } from "./chat";

export const messageSchema = pgSchema("message");

const fromEnum = pgEnum("fromEnum", ["user", "assistant"]);

export const message = messageSchema.table("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  from: fromEnum("from").notNull(),
  /*
  ttft (time to first token)
  duration (time it took to complete)
  tokens (amount generated)

  sources (from search)
  */
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(message, {
  content: z.string().min(1),
  from: z.string(),
}).pick({ content: true, from: true });

export const updateMessageSchema = insertMessageSchema.partial();

export const selectMessageSchema = createSelectSchema(message);

export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
export type InsertMessageInput = z.infer<typeof insertMessageSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
