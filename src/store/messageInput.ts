import { Chat } from "@server/schemas/chat";
import { defaultModel, ModelId } from "@shared/models";
import { create } from "zustand";

interface MessageInputState {
  data: Record<
    string | "home",
    {
      prompt: string;
      model: ModelId;
      reasoning: boolean;
      search: boolean;
    }
  >;
  setRecords: (chats: Chat[]) => void;
  addRecord: (id: string) => void;
  removeRecord: (id: string) => void;

  setPrompt: (id: string | "home", prompt: string) => void;
  setModel: (id: string | "home", model: ModelId) => void;
  toggleReasoning: (id: string | "home") => void;
  toggleSearch: (id: string | "home") => void;
}

const defaultRecord: {
  prompt: string;
  model: typeof defaultModel;
  reasoning: boolean;
  search: boolean;
} = {
  prompt: "",
  model: defaultModel,
  reasoning: false,
  search: false,
};

export const useMessageInputStore = create<MessageInputState>((set) => {
  return {
    data: {
      home: defaultRecord,
    },
    setRecords(chats) {
      set({
        data: {
          ...Object.fromEntries(chats.map((c) => [c.id, defaultRecord])),
          home: defaultRecord,
        },
      });
    },
    addRecord(id) {
      set((state) => ({
        data: {
          ...state.data,
          [id]: {
            prompt: "",
            model: "moonshotai/kimi-k2.6",
            reasoning: false,
            search: false,
          },
        },
      }));
    },
    removeRecord(id) {
      set((state) => {
        const { [id]: _, ...rest } = state.data;
        return { data: rest };
      });
    },

    setPrompt(id, prompt) {
      set((state) => ({
        data: {
          ...state.data,
          [id]: { ...state.data[id], prompt },
        },
      }));
    },
    setModel(id, model) {
      set((state) => ({
        data: {
          ...state.data,
          [id]: { ...state.data[id], model },
        },
      }));
    },
    toggleReasoning(id) {
      set((state) => ({
        data: {
          ...state.data,
          [id]: { ...state.data[id], reasoning: !state.data[id].reasoning },
        },
      }));
    },
    toggleSearch(id) {
      set((state) => ({
        data: {
          ...state.data,
          [id]: { ...state.data[id], search: !state.data[id].search },
        },
      }));
    },
  };
});
