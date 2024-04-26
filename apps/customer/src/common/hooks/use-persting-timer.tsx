/**
 * This hook is responsible for creating persiting timer,
 * if user refreshes the page, this hook persists the timer, and instead of starting from 15 minutes,
 * it starts from the remaining time.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ITimerStore {
  id: any;
  remainingTime: number;
  startTimer: () => void;
  clearTimer: () => void;
  resetTimer: () => void;
}

const usePersistingTimerStore = create<ITimerStore>()(
  persist(
    (set, get) => ({
      id: null,
      remainingTime: get()?.remainingTime ?? 900, // 15 minutes
      startTimer: () => {
        set({
          id: setInterval(() => {
            if (get()?.remainingTime <= 0) {
              clearInterval(get()?.id);
              set({ remainingTime: 900 });
              return;
            }
            set((state) => ({ remainingTime: state.remainingTime - 1 }));
          }, 1000),
        });
      },
      clearTimer: () => {
        clearInterval(get().id);
      },
      resetTimer: () => {
        const id = get()?.id;
        if (id) clearInterval(id);
        set({ remainingTime: 900 });
      },
    }),
    {
      name: "timer-storage",
    },
  ),
);

export const userPersistingTimer = () => {
  const { clearTimer, remainingTime, startTimer, resetTimer } =
    usePersistingTimerStore();

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    startTimer,
    clearTimer,
    remainingTime,
    formatTime,
    resetTimer,
  };
};
