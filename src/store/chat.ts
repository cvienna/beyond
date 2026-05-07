import { create } from "zustand";
import { Chat } from "@server/schemas/chats";
import { Message } from "@server/schemas/message";
import { ChatCompletionEvent } from "@server/types";

interface ChatState {
  chats: Chat[] | null;
  setChats: (data: Chat[]) => void;
  addChat: (data: Chat) => void;
  updateChat: (id: string, data: Partial<Chat>) => void;
  removeChat: (id: string) => void;

  // TODO: Implement isStreaming into Message type
  messages: Record<string, Message[]>; // chatId -> Message[]
  setMessages: (chatId: string, data: Message[]) => void;
  addMessage: (chatId: string, data: Message) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    data: Partial<Message>,
  ) => void;
  appendChunk: (
    chatId: string,
    messageId: string,
    data: ChatCompletionEvent,
  ) => void;

  setFeedback: (
    chatId: string,
    messageId: string,
    data: { review: "good" | "bad"; note?: string },
  ) => void;
}

export const useChatStore = create<ChatState>((set, get) => {
  return {
    chats: null,
    setChats(data) {
      set({ chats: data });
    },
    addChat(data) {
      set((state) => ({ chats: [...(state.chats ?? []), data] }));
    },
    updateChat(id, data) {
      set((state) => ({
        chats: state.chats?.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
    },
    removeChat(id) {
      set((state) => ({ chats: state.chats?.filter((c) => c.id !== id) }));
    },

    messages: {},
    setMessages(chatId, messages) {
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: messages,
        },
      }));
    },
    addMessage(chatId, message) {
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] ?? []), message],
        },
      }));
    },
    updateMessage(chatId, messageId, data) {
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map((m) =>
            m.id === messageId ? { ...m, ...data } : m,
          ),
        },
      }));
    },
    appendChunk(chatId, messageId, chunk) {
      if (chunk.event !== "chat.completion.chunk") return;
      const isReasoning = "reasoningContent" in chunk.data.delta;
      const content =
        "reasoningContent" in chunk.data.delta
          ? chunk.data.delta.reasoningContent
          : chunk.data.delta.content;

      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map((m) =>
            m.id === messageId
              ? isReasoning
                ? {
                    ...m,
                    reasoningContent: (m.reasoningContent ?? "") + content,
                  }
                : {
                    ...m,
                    content: m.content + content,
                  }
              : m,
          ),
        },
      }));
    },
    setFeedback(chatId, messageId, feedback) {
      get().updateMessage(chatId, messageId, { feedback });
    },
  };
});
