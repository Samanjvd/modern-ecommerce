import { api } from './axios';

export type UserProfile = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
};

export async function getUserProfileApi() {
  const response = await api.get<{ user: UserProfile }>('/users/me');
  return response.data;
}

export async function updateUserProfileApi(data: {
  name?: string;
  phone?: string;
  avatar?: string;
}) {
  const response = await api.patch<{ user: UserProfile }>('/users/me', data);
  return response.data;
}

export async function changePasswordApi(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await api.patch<{ message: string }>(
    '/users/password',
    data,
  );
  return response.data;
}
