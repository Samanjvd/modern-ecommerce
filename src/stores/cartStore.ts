import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Product, ProductColor } from '@/types/Product';

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
};

type CartState = {
  items: CartItem[];

  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: ProductColor,
  ) => void;

  removeItem: (productId: number, colorValue?: string) => void;

  updateQuantity: (
    productId: number,
    quantity: number,
    colorValue?: string,
  ) => void;

  clearCart: () => void;

  getItemQuantity: (productId: number, colorValue?: string) => number;
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

      addItem: (product, quantity = 1, selectedColor) => {
        set((state) => {
          const existingItem = state.items.find((item) =>
            isSameCartItem(item, product.id, selectedColor?.value),
          );

          if (existingItem) {
            return {
              items: state.items.map((item) => {
                if (!isSameCartItem(item, product.id, selectedColor?.value)) {
                  return item;
                }

                return {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, product.stock),
                };
              }),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stock),
                selectedColor,
              },
            ],
          };
        });
      },

      removeItem: (productId, colorValue) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameCartItem(item, productId, colorValue),
          ),
        }));
      },

      updateQuantity: (productId, quantity, colorValue) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (!isSameCartItem(item, productId, colorValue)) {
              return item;
            }

            return {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.product.stock)),
            };
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemQuantity: (productId, colorValue) => {
        const item = get().items.find((currentItem) =>
          isSameCartItem(currentItem, productId, colorValue),
        );

        return item?.quantity ?? 0;
      },
    }),
    {
      name: 'zanbilak-cart',
    },
  ),
);
