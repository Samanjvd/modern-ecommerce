import { create } from 'zustand';

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

const sameCartItem = (
  item: CartItem,
  productId: number,
  colorValue?: string,
) => {
  return (
    item.product.id === productId && item.selectedColor?.value === colorValue
  );
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1, selectedColor) => {
    set((state) => {
      const existingItem = state.items.find((item) =>
        sameCartItem(item, product.id, selectedColor?.value),
      );

      if (existingItem) {
        return {
          items: state.items.map((item) => {
            if (!sameCartItem(item, product.id, selectedColor?.value)) {
              return item;
            }

            const nextQuantity = Math.min(
              item.quantity + quantity,
              product.stock,
            );

            return {
              ...item,
              quantity: nextQuantity,
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
        (item) => !sameCartItem(item, productId, colorValue),
      ),
    }));
  },

  updateQuantity: (productId, quantity, colorValue) => {
    set((state) => ({
      items: state.items
        .map((item) => {
          if (!sameCartItem(item, productId, colorValue)) {
            return item;
          }

          const nextQuantity = Math.max(
            1,
            Math.min(quantity, item.product.stock),
          );

          return {
            ...item,
            quantity: nextQuantity,
          };
        })
        .filter((item) => item.quantity > 0),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getItemQuantity: (productId, colorValue) => {
    const item = get().items.find((currentItem) =>
      sameCartItem(currentItem, productId, colorValue),
    );

    return item?.quantity ?? 0;
  },
}));
