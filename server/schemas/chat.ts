import { pgSchema, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const chatSchema = pgSchema("chat");

export const chat = chatSchema.table("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  icon: text("icon").notNull(),
  /*
  model (enum)
  isPinned (bool)
  */
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const insertChatSchema = createInsertSchema(chat, {
  title: z.string().min(1).max(100),
  icon: z.emoji().min(1).max(1),
}).pick({ title: true, icon: true });

export const updateChatSchema = insertChatSchema.partial();

export const selectChatSchema = createSelectSchema(chat);

export type Chat = typeof chat.$inferSelect;
export type NewChat = typeof chat.$inferInsert;
export type InsertChatInput = z.infer<typeof insertChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;
