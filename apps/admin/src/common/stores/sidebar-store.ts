import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ISidebarStore {
  open: boolean;
  toggle: () => void;
}

const useSidebarStore = create<ISidebarStore>()(
  persist(
    (set, get) => ({
      open: get()?.open ?? true,
      toggle: () => set((state) => ({ open: !state.open })),
    }),
    { name: "sidebar" }
  )
);

export default useSidebarStore;
