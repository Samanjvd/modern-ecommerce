import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  addToCartApi,
  clearCartApi,
  deleteCartItemApi,
  getCartApi,
  updateCartItemApi,
} from '@/api/cart.api';

import type { CartItem } from '@/types/cart';
import type { Product, ProductColor } from '@/types/Product';

type CartState = {
  items: CartItem[];

  loading: boolean;
  syncing: boolean;

  loadCart: () => Promise<void>;

  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: ProductColor,
  ) => Promise<void>;

  removeItem: (productId: number, colorValue?: string) => Promise<void>;

  updateQuantity: (
    productId: number,
    quantity: number,
    colorValue?: string,
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  getItemQuantity: (productId: number, colorValue?: string) => number;

  setItems: (items: CartItem[]) => void;
};

const isSameCartItem = (
  item: CartItem,
  productId: number,
  colorValue?: string,
) => {
  return (
    item.product.id === productId && item.selectedColor?.value === colorValue
  );
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      loading: false,

      syncing: false,

      loadCart: async () => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          return;
        }

        set({
          loading: true,
        });

        try {
          const data = await getCartApi();

          const items: CartItem[] = data.cart.items.map((item) => ({
            id: item.id,
            product: item.product,
            quantity: item.quantity,
          }));

          set({
            items,
          });
        } finally {
          set({
            loading: false,
          });
        }
      },

      addItem: async (product, quantity = 1, selectedColor) => {
        const existingItem = get().items.find((item) =>
          isSameCartItem(item, product.id, selectedColor?.value),
        );

        const currentQuantity = existingItem?.quantity ?? 0;

        const nextQuantity = Math.min(
          currentQuantity + quantity,
          product.stock,
        );

        if (nextQuantity === currentQuantity) {
          return;
        }

        set({
          syncing: true,
        });

        try {
          await addToCartApi(product.id, quantity);

          const cart = await getCartApi();

          set({
            items: cart.cart.items,
          });
        } finally {
          set({
            syncing: false,
          });
        }
      },

      removeItem: async (productId, colorValue) => {
        const item = get().items.find((currentItem) =>
          isSameCartItem(currentItem, productId, colorValue),
        );

        if (!item) {
          return;
        }

        set({
          syncing: true,
        });

        try {
          if (item.id) {
            await deleteCartItemApi(item.id);
          }

          set((state) => ({
            items: state.items.filter(
              (currentItem) =>
                !isSameCartItem(currentItem, productId, colorValue),
            ),
          }));
        } finally {
          set({
            syncing: false,
          });
        }
      },

      updateQuantity: async (productId, quantity, colorValue) => {
        const item = get().items.find((currentItem) =>
          isSameCartItem(currentItem, productId, colorValue),
        );

        if (!item) {
          return;
        }

        const nextQuantity = Math.max(
          1,
          Math.min(quantity, item.product.stock),
        );

        if (nextQuantity === item.quantity) {
          return;
        }

        set({
          syncing: true,
        });

        try {
          if (item.id) {
            await updateCartItemApi(item.id, nextQuantity);
          }

          set((state) => ({
            items: state.items.map((currentItem) => {
              if (!isSameCartItem(currentItem, productId, colorValue)) {
                return currentItem;
              }

              return {
                ...currentItem,
                quantity: nextQuantity,
              };
            }),
          }));
        } finally {
          set({
            syncing: false,
          });
        }
      },

      clearCart: async () => {
        set({
          syncing: true,
        });

        try {
          if (localStorage.getItem('accessToken')) {
            await clearCartApi();
          }

          set({
            items: [],
          });
        } finally {
          set({
            syncing: false,
          });
        }
      },

      getItemQuantity: (productId, colorValue) => {
        const item = get().items.find((currentItem) =>
          isSameCartItem(currentItem, productId, colorValue),
        );

        return item?.quantity ?? 0;
      },

      setItems: (items) => {
        set({
          items,
        });
      },
    }),

    {
      name: 'zanbilak-cart',
    },
  ),
);
