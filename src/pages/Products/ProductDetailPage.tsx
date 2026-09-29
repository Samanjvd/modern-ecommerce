import { useParams } from 'react-router-dom';

import { ProductBreadcrumb } from '@/components/product/detail/ProductBreadcrumb';
import { ProductGallery } from '@/components/product/detail/ProductGallery';
import { ProductHighlights } from '@/components/product/detail/ProductHighlights';
import { ProductInfo } from '@/components/product/detail/ProductInfo';
import { ProductSpecifications } from '@/components/product/detail/ProductSpecifications';
import { RelatedProducts } from '@/components/product/detail/RelatedProducts';

import { useProduct } from '@/hooks/useProduct';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const productId = Number(id);

  const { data, isLoading, isError } = useProduct(productId);

  if (isLoading) {
    return <div>در حال دریافت محصول...</div>;
  }

  const product = data?.product;

  if (isError || !product) {
    return <div>محصول پیدا نشد.</div>;
  }

  return (
    <section className="w-full px-4 py-6 md:px-16 md:py-8">
      <ProductBreadcrumb
        category={product.category.slug}
        title={product.title}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)] lg:gap-10">
        <ProductGallery images={product.images} title={product.title} />

        <ProductInfo product={product} />
      </div>

      <ProductHighlights product={product} />

      <ProductSpecifications product={product} />

      <RelatedProducts product={product} />
    </section>
  );
}
