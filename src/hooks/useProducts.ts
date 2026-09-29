import { useQuery } from '@tanstack/react-query';

import { getProductsApi, type ProductQueryParams } from '@/api/product.api';

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProductsApi(params),
  });
};
