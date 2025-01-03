import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RouteStore {
  path: string;
  key: string;
}

const useRouteStore = create<RouteStore>()(
  persist(
    (set, get) => ({
      path: "/",
      key: "home",
    }),
    {
      name: "auth-storage", // 存儲的 key
    },
  ),
);

export default useRouteStore;
