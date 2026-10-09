import { useQuery } from '@tanstack/react-query';

import { getProductByIdApi } from '@/api/product.api';

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdApi(id),
    enabled: id > 0,
  });
};
