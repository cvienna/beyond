import { pgSchema, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const chatSchema = pgSchema("chat");

export const chat = chatSchema.table("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  icon: text("icon"),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const insertChatSchema = createInsertSchema(chat, {
  title: z.string().min(1).max(100),
  icon: z.emoji(),
}).pick({ title: true, icon: true });

export const updateChatSchema = insertChatSchema.partial();

export const selectChatsSchema = createSelectSchema(chat);

export type Chat = typeof chat.$inferSelect;
export type NewChat = typeof chat.$inferInsert;
export type InsertChatInput = z.infer<typeof insertChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;
