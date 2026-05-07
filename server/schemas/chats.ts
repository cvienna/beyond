import { pgSchema, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const chatsSchema = pgSchema("chats");

export const chats = chatsSchema.table("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  icon: text("icon"),
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const insertChatsSchema = createInsertSchema(chats, {
  title: z.string().min(1).max(100),
  icon: z.emoji(),
}).pick({ title: true, icon: true });

export const updateChatsSchema = insertChatsSchema.partial();

export const selectChatsSchema = createSelectSchema(chats);

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type InsertChatInput = z.infer<typeof insertChatsSchema>;
export type UpdateChatInput = z.infer<typeof updateChatsSchema>;
