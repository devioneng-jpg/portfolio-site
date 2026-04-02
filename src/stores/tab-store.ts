import { create } from "zustand";

export type TabId = "chat" | "projects" | "resume" | "contact";

interface TabState {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: "chat",
  setActiveTab: (id) => set({ activeTab: id }),
}));
