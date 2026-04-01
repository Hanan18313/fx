import { create } from 'zustand';
import api from '../services/api';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, spec?: string) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  isAllSelected: () => boolean;
  selectedItems: () => CartItem[];
  totalPrice: () => number;
  totalCount: () => number;
  selectedCount: () => number;
  clearCart: () => void;
  clearSelected: () => void;
  loadFromServer: (serverItems: any[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  loadFromServer: (serverItems) => {
    set({
      items: serverItems.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        selected: item.selected === 1 || item.selected === true,
        spec: item.spec,
      })),
    });
  },

  addItem: (product, quantity = 1, spec) => {
    const { items } = get();
    const existing = items.find((i) => i.product.id === product.id && i.spec === spec);
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i,
        ),
      });
    } else {
      const tempId = Date.now();
      set({ items: [...items, { id: tempId, product, quantity, selected: true, spec }] });
      // Sync to server; replace tempId with real server id on success
      api.post('/cart', { productId: product.id, quantity, spec }).then((res) => {
        const serverId = res.data?.id ?? res.data?.data?.id;
        if (serverId) {
          set((state) => ({
            items: state.items.map((i) => (i.id === tempId ? { ...i, id: serverId } : i)),
          }));
        }
      }).catch(() => { /* optimistic update stays */ });
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    });
  },

  toggleSelect: (id) => {
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)),
    });
  },

  toggleSelectAll: () => {
    const allSelected = get().isAllSelected();
    set({ items: get().items.map((i) => ({ ...i, selected: !allSelected })) });
  },

  isAllSelected: () => {
    const { items } = get();
    return items.length > 0 && items.every((i) => i.selected);
  },

  selectedItems: () => get().items.filter((i) => i.selected),

  totalPrice: () =>
    get()
      .items.filter((i) => i.selected)
      .reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),

  totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  selectedCount: () =>
    get()
      .items.filter((i) => i.selected)
      .reduce((sum, i) => sum + i.quantity, 0),

  clearCart: () => set({ items: [] }),

  clearSelected: () => {
    set({ items: get().items.filter((i) => !i.selected) });
  },
}));
