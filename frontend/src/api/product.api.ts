import { api } from './axios';

import type { Product, ProductsResponse } from '@/types/Product';

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brands?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'popular' | 'newest';

  ram?: string;
  storage?: string;
  cpu?: string;
  operatingSystem?: string;
  connectionType?: string;

  bluetooth?: boolean;
  noiseCancellation?: boolean;
  microphone?: boolean;
};

export async function getProductsApi(params?: ProductQueryParams) {
  const response = await api.get<ProductsResponse>('/products', {
    params,
  });

  return response.data;
}

export async function getProductByIdApi(id: number) {
  const response = await api.get<{ product: Product }>(`/products/${id}`);

  return response.data;
}
