import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string;
  isLogin: boolean;
  setLogin: (isLogin: boolean) => void;
  setToken: (token: string) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: '',
      isLogin: false,
      setLogin: (isLogin: boolean) => set({ isLogin }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'auth-storage', // 存儲的 key
    },
  ),
);

export default useAuthStore;
