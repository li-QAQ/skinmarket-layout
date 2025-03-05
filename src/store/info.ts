import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InfoStore {
  token: string;
  member_id: string;
  merchant_id: string;
  kyc_status: number;
  point: number;
  total_point: number;
  points_in_transaction: number;
  kyc_tour: boolean;
  setKycTour: (kyc_tour: boolean) => void;
  setToken: (token: string) => void;
  setMemberId: (member_id: string) => void;
  setMerchantId: (merchant_id: string) => void;
  setKycStatus: (kyc_status: number) => void;
  setPoint: (point: number) => void;
  setPointsInTransaction: (points_in_transaction: number) => void;
  setTotalPoint: (total_point: number) => void;
}

const useInfoStore = create<InfoStore>()(
  persist(
    (set) => ({
      token: '',
      member_id: '',
      merchant_id: '',
      point: 0,
      total_point: 0,
      points_in_transaction: 0,
      kyc_status: 0,
      kyc_tour: false,

      setKycTour: (kyc_tour: boolean) => set({ kyc_tour }),
      setToken: (token: string) => set({ token }),
      setMemberId: (member_id: string) => set({ member_id }),
      setMerchantId: (merchant_id: string) => set({ merchant_id }),
      setKycStatus: (kyc_status: number) => set({ kyc_status }),
      setPoint: (point: number) => set({ point }),
      setPointsInTransaction: (points_in_transaction: number) =>
        set({ points_in_transaction }),
      setTotalPoint: (total_point: number) => set({ total_point }),
    }),
    {
      name: 'info-storage',
    },
  ),
);

export default useInfoStore;
