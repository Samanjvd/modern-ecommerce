import type { ProductCategory } from '@/types/Product';
import { api } from './axios';

export type CartApiItem = {
  id: number;
  quantity: number;

  product: {
    id: number;
    title: string;
    description?: string;

    images: {
      id: number;
      url: string;
      productId: number;
    }[];

    price: number;
    discountPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;

    category: ProductCategory;

    brand: string;

    colors: {
      name: string;
      value: string;
    }[];

    stock: number;
    isNew: boolean;
    isPopular: boolean;
    isFeatured: boolean;

    specifications?: Record<string, unknown>;
  };
};

export type CartApiResponse = {
  cart: {
    id: number;
    userId: number;
    items: CartApiItem[];
    summary: {
      totalItems: number;
      totalPrice: number;
      totalDiscount: number;
      finalPrice: number;
    };
  };
};

export async function getCartApi() {
  const response = await api.get<CartApiResponse>('/cart');

  return response.data;
}

export async function addToCartApi(productId: number, quantity: number) {
  const response = await api.post('/cart/items', {
    productId,
    quantity,
  });

  return response.data;
}

export async function updateCartItemApi(itemId: number, quantity: number) {
  const response = await api.patch(`/cart/items/${itemId}`, {
    quantity,
  });

  return response.data;
}

export async function deleteCartItemApi(itemId: number) {
  const response = await api.delete(`/cart/items/${itemId}`);

  return response.data;
}

export async function clearCartApi() {
  const response = await api.delete('/cart');

  return response.data;
}
