import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MessageStore {
  data: {
    show: boolean;
    type: string;
    content: string;
  };
  setData: (data: MessageStore['data']) => void;
}

const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      data: {
        show: false,
        type: '',
        content: '',
      },
      setData: (data: MessageStore['data']) => set({ data }),
    }),
    {
      name: 'info-storage',
    },
  ),
);

export default useMessageStore;
