import { create } from "zustand";

type Route = { page: "home" } | { page: "chat"; chatId: string };

interface UiState {
  route: Route;
  navigate: (route: Route) => void;
  sidebar: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => {
  return {
    route: { page: "home" },
    navigate(route) {
      set({ route });
    },

    sidebar: true,
    toggleSidebar() {
      set((state) => ({ sidebar: !state.sidebar }));
    },
  };
});
