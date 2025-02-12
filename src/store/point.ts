import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PointStore {
  acquisition_order: {
    description: string;
    price: number;
    quantity: number;
  }[];
  point_order: {
    description: string;
    price: number;
    quantity: number;
  }[];
  set_acquisition_order: (
    acquisition_order: PointStore['acquisition_order'],
  ) => void;
  set_point_order: (point_order: PointStore['point_order']) => void;
}

const usePointStore = create<PointStore>()(
  persist(
    (set) => ({
      acquisition_order: [],
      point_order: [],
      set_acquisition_order: (acquisition_order) => set({ acquisition_order }),
      set_point_order: (point_order) => set({ point_order }),
    }),
    {
      name: 'point-storage', // 存儲的 key
    },
  ),
);

export default usePointStore;
