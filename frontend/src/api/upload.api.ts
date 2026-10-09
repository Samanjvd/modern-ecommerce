import { api } from './axios';

export async function uploadImageApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ url: string }>('/uploads/image', formData);
  return response.data;
}
