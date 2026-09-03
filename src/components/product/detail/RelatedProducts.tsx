import { products } from '@/data/products';
import type { Product } from '@/types/Product';

import { ProductCard } from '@/components/product/ProductCard';

type RelatedProductsProps = {
  product: Product;
};

export function RelatedProducts({ product }: RelatedProductsProps) {
  const relatedProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[var(--color-text)] md:text-xl">
          محصولات مرتبط
        </h2>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          محصولاتی که ممکن است برایت جالب باشند
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </section>
  );
}
