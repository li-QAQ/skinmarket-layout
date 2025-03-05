import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TourStore {
  kycTour: boolean;
  bankTour: boolean;
  setKycTour: (kycTour: boolean) => void;
  setBankTour: (bankTour: boolean) => void;
}

const useTourStore = create<TourStore>()(
  persist(
    (set) => ({
      kycTour: false,
      bankTour: false,
      setKycTour: (kycTour: boolean) => set({ kycTour }),
      setBankTour: (bankTour: boolean) => set({ bankTour }),
    }),
    {
      name: 'tour-storage',
    },
  ),
);

export default useTourStore;
