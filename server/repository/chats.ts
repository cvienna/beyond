import { db } from "@server/lib/db";
import { chats, NewChat } from "@server/schemas/chats";
import { and, eq, isNull, isNotNull } from "drizzle-orm";

export async function getChats() {
  return await db.select().from(chats).where(isNull(chats.deletedAt));
}

export async function getChatById(id: string) {
  const result = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, id), isNull(chats.deletedAt)))
    .limit(1);

  return result[0] ?? null;
}

export async function createChat(data: NewChat) {
  const result = await db
    .insert(chats)
    .values({ ...data, createdAt: new Date(), updatedAt: new Date() })
    .returning();

  return result[0] ?? null;
}

export async function updateChat(id: string, data: Partial<NewChat>) {
  const result = await db
    .update(chats)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(chats.id, id), isNull(chats.deletedAt)))
    .returning();

  return result[0] ?? null;
}

export async function softDeleteChat(id: string) {
  const result = await db
    .update(chats)
    .set({ deletedAt: new Date() })
    .where(and(eq(chats.id, id), isNull(chats.deletedAt)))
    .returning();

  return result[0] ?? null;
}

export async function recoverChat(id: string) {
  const result = await db
    .update(chats)
    .set({ deletedAt: null })
    .where(and(eq(chats.id, id), isNotNull(chats.deletedAt)))
    .returning();

  return result[0] ?? null;
}
