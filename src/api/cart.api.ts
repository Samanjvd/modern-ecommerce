import { api } from './axios';

import type { CartResponse } from '@/types/cart';

export async function getCartApi() {
  const response = await api.get<CartResponse>('/cart');

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
