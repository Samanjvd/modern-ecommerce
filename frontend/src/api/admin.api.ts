import { api } from './axios';
import type { Order, OrderStatus } from './order.api';
import type { UserProfile } from './user.api';

export type DashboardResponse = {
  dashboard: {
    users: { total: number };
    products: {
      total: number;
      lowStock: { id: number; title: string; stock: number }[];
    };
    categories: { total: number };
    orders: { total: number; pending: number };
    sales: { total: number };
  };
};

export async function getDashboardApi() {
  const response = await api.get<DashboardResponse>('/admin/dashboard');
  return response.data;
}

export async function getAdminOrdersApi() {
  const response = await api.get<{ orders: Order[] }>('/admin/orders');
  return response.data;
}

export async function updateOrderStatusApi(id: number, status: OrderStatus) {
  const response = await api.patch<{ order: Order }>(
    `/admin/orders/${id}/status`,
    { status },
  );
  return response.data;
}

export async function getAdminUsersApi() {
  const response = await api.get<{ users: UserProfile[] }>('/admin/users');
  return response.data;
}

export async function updateUserRoleApi(id: number, role: 'USER' | 'ADMIN') {
  const response = await api.patch<{ user: UserProfile }>(
    `/admin/users/${id}/role`,
    { role },
  );
  return response.data;
}
