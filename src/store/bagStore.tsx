import { create } from "zustand";

interface Item {
  id: number;
  tags?: string[];
  selected?: boolean;
  name: string;
  price: number;
  image: string;
}

interface BagStore {
  items: Item[]; // 商品列表
  selectedItemIds: number[]; // 被選中的商品 ID
  itemMap: Record<number, Item>; // 商品 ID 對應商品的映射
  setSelectedItemIds: (ids: number[]) => void; // 設定被選中的商品 ID
  getSelectedCount: () => number; // 獲取被選中商品的數量
  getAllItemCount: () => number; // 獲取所有商品的數量
  setItems: (items: Item[]) => void; // 設定商品列表
  addSelectedId: (id: number) => void; // 新增選中商品的 ID
  removeSelectedId: (id: number) => void; // 移除選中商品的 ID
  getSelectedItmeTotalPrice: () => number; // 獲取選中商品的總價
  getSelectedItems: () => Item[]; // 獲取選中的商品

  // show pricing modal
  isOpenPricingModal: boolean;
  setIsOpenPricingModal: (isOpen: boolean) => void;
}

const useBag = create<BagStore>((set, get) => ({
  items: [],
  selectedItemIds: [],
  itemMap: {},
  setSelectedItemIds: (ids) => set({ selectedItemIds: ids }),
  setItems: (items) => set({ items }),
  addSelectedId: (id) =>
    set((state) => ({
      selectedItemIds: [...state.selectedItemIds, id],
    })),
  removeSelectedId: (id) =>
    set((state) => ({
      selectedItemIds: state.selectedItemIds.filter((itemId) => itemId !== id),
    })),
  getSelectedCount: () => get().selectedItemIds.length,
  getAllItemCount: () => get().items.length,
  getSelectedItmeTotalPrice: () =>
    get()
      .items.filter((item) => get().selectedItemIds.includes(item.id))
      .reduce((acc, cur) => acc + cur.price, 0),
  getSelectedItems: () =>
    get().items.filter((item) => get().selectedItemIds.includes(item.id)),

  // pricing modal
  isOpenPricingModal: false,
  setIsOpenPricingModal: (isOpen) => set({ isOpenPricingModal: isOpen }),
}));

export default useBag;
