import { api } from './axios';

export type OrderStatus =
  'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    title: string;
    images?: { id: number; url: string; productId: number }[];
  };
};

export type Order = {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
  items: OrderItem[];
  user?: { id: number; name: string | null; email: string };
};

export async function getMyOrdersApi() {
  const response = await api.get<{ orders: Order[] }>('/orders');
  return response.data;
}

export async function getOrderByIdApi(id: number) {
  const response = await api.get<{ order: Order }>(`/orders/${id}`);
  return response.data;
}

export async function createOrderApi(data: {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}) {
  const response = await api.post<{ order: Order }>('/orders', data);
  return response.data;
}

export async function createPaymentApi(orderId: number) {
  const response = await api.post<{
    paymentUrl: string;
    payment: { id: number; amount: number; status: string };
  }>(`/payments/create/${orderId}`);
  return response.data;
}

export async function verifyPaymentApi(
  paymentId: number,
  transactionId: string,
) {
  const response = await api.post<{ message: string }>(
    `/payments/verify/${paymentId}`,
    { transactionId },
  );
  return response.data;
}

export async function createReviewApi(
  productId: number,
  data: { rating: number; comment: string },
) {
  const response = await api.post(`/products/${productId}/reviews`, data);
  return response.data;
}
