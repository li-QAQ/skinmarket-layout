import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isLogin: boolean;
  setLogin: (isLogin: boolean) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLogin: false,
      setLogin: (isLogin: boolean) => set({ isLogin }),
    }),
    {
      name: "auth-storage", // 存儲的 key
    },
  ),
);

export default useAuthStore;
