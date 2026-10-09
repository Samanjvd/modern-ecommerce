import { useProducts } from './useProducts';

export const usePopularProducts = () => {
  const query = useProducts({
    page: 1,
    limit: 50,
    sort: 'popular',
  });

  const products =
    query.data?.products.filter((product) => product.isPopular) ?? [];

  return {
    ...query,
    products,
  };
};
