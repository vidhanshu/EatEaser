import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { persist } from "zustand/middleware";

interface IAuthStore {
  token: string | null;
  user: NSAuth.IUser | null;
  signIn: (data: Pick<IAuthStore, "user" | "token">) => void;
  signOut: () => void;
  setUser: (user: Partial<NSAuth.IUser>) => void;
  isAuthenticated: () => boolean;
}

const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: () => {
        try {
          const token = get().token;
          if (!token) return false;

          const decoded = jwtDecode(token);
          return !!decoded && !!decoded.exp && decoded.exp > Date.now() / 1000;
        } catch (error) {
          return false;
        }
      },
      signIn: (data: Pick<IAuthStore, "token" | "user">) => set(data),
      setUser: (data: Partial<NSAuth.IUser>) =>
        set((curUser) => {
          return {
            ...curUser,
            user: {
              ...curUser.user,
              ...data,
            },
          } as IAuthStore;
        }),
      signOut: () => set(() => ({ token: null, user: null })),
    }),
    { name: "auth" }
  )
);

export default useAuthStore;
