import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfirmStore {
  data: {
    show: boolean;
    title: string;
    content: string;
  };
  setData: (data: ConfirmStore['data']) => void;
}

const useConfirmStore = create<ConfirmStore>()(
  persist(
    (set) => ({
      data: {
        show: false,
        title: '',
        content: '',
      },
      setData: (data: ConfirmStore['data']) => set({ data }),
    }),
    {
      name: 'confirm-storage',
    },
  ),
);

export default useConfirmStore;
