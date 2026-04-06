import { db } from "@server/lib/db";
import { message, NewMessage } from "@server/schemas/message";
import { chat } from "@server/schemas/chat";
import { and, eq, isNull } from "drizzle-orm";

export async function getMessagesByChat(chatId: string) {
  return await db
    .select()
    .from(message)
    .where(and(eq(chat.id, chatId), isNull(chat.deletedAt)))
    .orderBy(message.createdAt);
}

export async function createMessage(data: NewMessage) {
  const result = await db
    .insert(message)
    .values({ ...data, createdAt: new Date() })
    .returning();

  return result[0] ?? null;
}
