import { create } from "zustand";

interface StreamingState {
  activeStreams: Record<string, { chatId: string; messageId?: string }>;
  addStream: (completionId: string, chatId: string, messageId?: string) => void;
  updateStream: (
    completionId: string,
    data: Partial<{ chatId: string; messageId: string }>,
  ) => void;
  removeStream: (completionId: string) => void;
}

export const useStreamingStore = create<StreamingState>((set) => {
  return {
    activeStreams: {},
    addStream(completionId, chatId, messageId) {
      set((state) => ({
        activeStreams: {
          ...state.activeStreams,
          [completionId]: { chatId, messageId },
        },
      }));
    },
    updateStream(completionId, data) {
      set((state) => ({
        activeStreams: {
          ...state.activeStreams,
          [completionId]: { ...state.activeStreams[completionId], ...data },
        },
      }));
    },
    removeStream(completionId) {
      set((state) => {
        const { [completionId]: _, ...rest } = state.activeStreams;
        return { activeStreams: rest };
      });
    },
  };
});
