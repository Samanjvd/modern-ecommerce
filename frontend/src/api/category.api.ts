import { api } from './axios';

export type Category = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  products?: unknown[];
};

export async function getCategoriesApi() {
  const response = await api.get<{ categories: Category[] }>('/categories');
  return response.data;
}

export async function createCategoryApi(data: {
  name: string;
  slug: string;
  image?: string;
}) {
  const response = await api.post<{ category: Category }>(
    '/admin/categories',
    data,
  );
  return response.data;
}

export async function updateCategoryApi(
  id: number,
  data: { name?: string; slug?: string; image?: string },
) {
  const response = await api.patch<{ category: Category }>(
    `/admin/categories/${id}`,
    data,
  );
  return response.data;
}

export async function deleteCategoryApi(id: number) {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
}
