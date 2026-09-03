import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

import type { Product } from '@/types/Product';

import { AddToCart } from './AddToCart';
import { ProductColorSelector } from './ProductColorSelector';
import { ProductPrice } from './ProductPrice';
import { ProductQuantity } from './ProductQuantity';

type ProductInfoProps = {
  product: Product;
};

const categoryLabels: Record<string, string> = {
  mobile: 'موبایل',
  laptop: 'لپ‌تاپ',
  headphone: 'هدفون',
  smartwatch: 'ساعت هوشمند',
  camera: 'دوربین',
  gaming: 'گیمینگ',
  accessories: 'لوازم جانبی',
  home: 'خانه و آشپزخانه',
};

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col justify-between">
      <span className="text-xs font-medium text-[var(--color-primary)]">
        {categoryLabels[product.category] ?? product.category}
      </span>

      <h1 className="mt-3 text-xl leading-8 font-bold text-[var(--color-text)] md:text-2xl md:leading-10">
        {product.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-[var(--color-border)] pb-5">
        <div className="flex items-center gap-1.5">
          <Star size={17} className="fill-amber-400 text-amber-400" />

          <span className="text-sm font-bold text-[var(--color-text)]">
            {product.rating.toLocaleString('fa-IR')}
          </span>

          <span className="text-xs text-[var(--color-text-muted)]">
            ({product.reviewCount.toLocaleString('fa-IR')} دیدگاه)
          </span>
        </div>

        {product.isPopular && (
          <span className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-[11px] font-medium text-[var(--color-primary)]">
            محصول محبوب
          </span>
        )}

        {product.isNew && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-medium text-green-600">
            محصول جدید
          </span>
        )}

        <div className="mr-auto flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Heart size={16} />

          {isOutOfStock ? 'ناموجود' : 'موجود در انبار'}
        </div>
      </div>

      <div className="mt-1">
        <ProductPrice
          price={product.price}
          discountPrice={product.discountPrice}
          discount={product.discount}
        />
      </div>

      <div className="flex w-full justify-between">
        {!isOutOfStock && product.colors.length > 0 && (
          <div className="mt-5">
            <ProductColorSelector colors={product.colors} />
          </div>
        )}

        {!isOutOfStock && (
          <div className="mt-5">
            <ProductQuantity
              value={quantity}
              max={product.stock}
              onChange={setQuantity}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <AddToCart disabled={isOutOfStock} />
      </div>
    </div>
  );
}
