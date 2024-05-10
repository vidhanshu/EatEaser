import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NSRestaurant } from "../types/restaurant.type";

interface INotificationStore {
  notifications: NSRestaurant.INotification[];
  addNotification: (notifications: NSRestaurant.INotification) => void;
  removeNotification: (notId: string) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<INotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (not) => {
        const newNoti = [not];
        newNoti.push(...get().notifications);

        set({
          notifications: newNoti,
        });
      },
      removeNotification: (notId) => {
        set({
          notifications: get().notifications.filter((not) => not.notId !== notId),
        });
      },
      clearNotifications: () => {
        set({
          notifications: [],
        });
      },
    }),
    { name: "notifications" },
  ),
);

export default useNotificationStore;
