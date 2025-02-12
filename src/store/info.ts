import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InfoStore {
  token: string;
  member_id: string;
  merchant_id: string;
  point: number;
  setToken: (token: string) => void;
  setMemberId: (member_id: string) => void;
  setMerchantId: (merchant_id: string) => void;
  setPoint: (point: number) => void;
}

const useInfoStore = create<InfoStore>()(
  persist(
    (set) => ({
      token: '',
      member_id: '',
      merchant_id: '',
      point: 0,
      setToken: (token: string) => set({ token }),
      setMemberId: (member_id: string) => set({ member_id }),
      setMerchantId: (merchant_id: string) => set({ merchant_id }),
      setPoint: (point: number) => set({ point }),
    }),
    {
      name: 'info-storage',
    },
  ),
);

export default useInfoStore;
