import { streamCompletion } from "@/lib/stream";
import { ModelId } from "@shared/models";
import { create } from "zustand";
import { useChatStore } from "./chat";
import { useUiStore } from "./ui";
import { useStreamingStore } from "./streaming";
import { useMessageInputStore } from "./messageInput";

interface CompletionState {
  submit: (
    model: ModelId,
    prompt: string,
    createdAt: Date,
    chatId?: string,
  ) => void;
}

export const useCompletionStore = create<CompletionState>(() => {
  return {
    submit: async (model, prompt, createdAt, chatId) => {
      await streamCompletion(
        {
          chatId,
          model,
          prompt,
          createdAt,
        },
        (event) => {
          if (event.event === "chat.create") {
            const { navigate } = useUiStore.getState();
            const { addChat } = useChatStore.getState();
            const { addRecord } = useMessageInputStore.getState();
            const { addStream } = useStreamingStore.getState();

            addChat(event.data);
            addRecord(event.data.id);
            addStream(event.data.completionId, event.data.id);
            navigate({ page: "chat", chatId: event.data.id });
          } else if (event.event === "chat.message.create") {
            const { addMessage } = useChatStore.getState();
            const { activeStreams, addStream } = useStreamingStore.getState();

            addMessage(event.data.chatId, event.data);
            if (!activeStreams[event.data.completionId]) {
              addStream(event.data.completionId, event.data.chatId);
            }
          } else if (event.event === "chat.completion.start") {
            const { addMessage } = useChatStore.getState();
            const { activeStreams, updateStream } =
              useStreamingStore.getState();

            updateStream(event.data.id, { messageId: event.data.id });
            addMessage(activeStreams[event.data.id].chatId, {
              id: event.data.id,
              chatId: activeStreams[event.data.id].chatId,
              content: "",
              reasoningContent: null,
              role: event.data.delta.role, // "assistant"
              model: event.data.model,
              promptTokens: null,
              completionTokens: null,
              duration: null,
              ttft: null,
              feedback: null,
              createdAt: event.data.createdAt,
              updatedAt: event.data.createdAt,
            });
          } else if (event.event === "chat.completion.chunk") {
            const { appendChunk } = useChatStore.getState();
            const { activeStreams } = useStreamingStore.getState();

            appendChunk(
              activeStreams[event.data.id].chatId,
              activeStreams[event.data.id].messageId!,
              event,
            );
          } else if (event.event === "chat.completion.stop") {
            const { updateMessage } = useChatStore.getState();
            const { activeStreams, removeStream } =
              useStreamingStore.getState();

            updateMessage(
              activeStreams[event.data.id].chatId,
              activeStreams[event.data.id].messageId!,
              {
                promptTokens: event.data.usage.promptTokens,
                completionTokens: event.data.usage.completionTokens,
                duration: event.data.usage.duration,
                ttft: event.data.usage.ttft,
              },
            );
            removeStream(event.data.id);
          }
        },
      );
    },
  };
});
