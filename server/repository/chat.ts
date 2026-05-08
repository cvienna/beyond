import { db } from "@server/lib/db";
import { chat, NewChat } from "@server/schemas/chat";
import { and, eq, isNull, isNotNull, desc } from "drizzle-orm";

export async function getChats() {
  return await db
    .select()
    .from(chat)
    .where(isNull(chat.deletedAt))
    .orderBy(desc(chat.updatedAt));
}

export async function getChatById(id: string) {
  const result = await db
    .select()
    .from(chat)
    .where(and(eq(chat.id, id), isNull(chat.deletedAt)))
    .limit(1);

  return result[0] ?? null;
}

export async function createChat(data: NewChat) {
  const result = await db.insert(chat).values(data).returning();

  return result[0] ?? null;
}

export async function updateChat(id: string, data: Partial<NewChat>) {
  const result = await db
    .update(chat)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(chat.id, id), isNull(chat.deletedAt)))
    .returning();

  return result[0] ?? null;
}

export async function softDeleteChat(id: string) {
  const result = await db
    .update(chat)
    .set({ deletedAt: new Date() })
    .where(and(eq(chat.id, id), isNull(chat.deletedAt)))
    .returning();

  return result[0] ?? null;
}

export async function recoverChat(id: string) {
  const result = await db
    .update(chat)
    .set({ deletedAt: null })
    .where(and(eq(chat.id, id), isNotNull(chat.deletedAt)))
    .returning();

  return result[0] ?? null;
}
