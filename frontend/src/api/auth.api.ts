import { api } from './axios';

import type {
  LoginFormValues,
  RegisterFormValues,
  AuthResponse,
} from '@/types/auth';

export async function loginApi(data: LoginFormValues) {
  const response = await api.post<AuthResponse>('/auth/login', data);

  return response.data;
}

export async function registerApi(data: RegisterFormValues) {
  const response = await api.post<AuthResponse>('/auth/register', data);

  return response.data;
}

export async function getMeApi() {
  const response = await api.get('/auth/me');

  return response.data;
}

export async function refreshApi() {
  const response = await api.post('/auth/refresh');

  return response.data;
}
