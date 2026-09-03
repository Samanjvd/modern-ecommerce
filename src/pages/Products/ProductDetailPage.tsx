import { useParams } from 'react-router-dom';

import { ProductBreadcrumb } from '@/components/product/detail/ProductBreadcrumb';
import { ProductGallery } from '@/components/product/detail/ProductGallery';
import { ProductHighlights } from '@/components/product/detail/ProductHighlights';
import { ProductInfo } from '@/components/product/detail/ProductInfo';
import { ProductSpecifications } from '@/components/product/detail/ProductSpecifications';
import { products } from '@/data/products';
import { RelatedProducts } from '@/components/product/detail/RelatedProducts';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4">
        <h1 className="text-xl font-bold text-[var(--color-text)]">
          محصول پیدا نشد
        </h1>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-6 md:px-16 md:py-8">
      <ProductBreadcrumb category={product.category} title={product.title} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)] lg:gap-10">
        <ProductGallery image={product.image} title={product.title} />

        <ProductInfo product={product} />
      </div>

      <ProductHighlights product={product} />

      <ProductSpecifications product={product} />

      <RelatedProducts product={product} />
    </section>
  );
}
