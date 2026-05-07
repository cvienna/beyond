import { db } from "@server/lib/db";
import { message, NewMessage } from "@server/schemas/message";
import { eq } from "drizzle-orm";

/**
Return all messages for a specific chat in ascending order.
@param chatId - The id of the chat
 */
export async function getMessagesByChat(chatId: string) {
  return await db
    .select()
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(message.createdAt);
}

/**
Create and returns a single new message.
@param data - NewMessage object
 */
export async function createMessage(data: NewMessage) {
  const result = await db.insert(message).values(data).returning();

  return result[0] ?? null;
}

/**
Update and returns a single existing message.
@param id - The id of the message
@param data - Partial NewMessage object
 */
export async function updateMessage(id: string, data: Partial<NewMessage>) {
  const result = await db
    .update(message)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(message.id, id))
    .returning();

  return result[0] ?? null;
}
