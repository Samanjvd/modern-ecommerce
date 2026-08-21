import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types/Product';
import { Button } from '@/components/ui/Button';

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
};

export function ProductCard({
  product,
  onAddToCart,
  onFavorite,
  onProductClick,
}: ProductCardProps) {
  const hasDiscount = Boolean(product.discountPrice);

  return (
    <article
      onClick={() => onProductClick?.(product)}
      className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative z-10 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-zinc-50">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite?.(product);
          }}
          aria-label="افزودن به علاقه‌مندی‌ها"
          className="absolute top-3 left-3 z-10 rounded-full bg-white text-zinc-500 shadow-sm hover:text-[var(--color-error)]"
        >
          <Heart size={18} />
        </Button>

        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-3 px-1 pt-4">
        <span className="text-xs text-[var(--color-text-muted)]">
          {product.category}
        </span>

        <h3 className="min-h-12 text-sm leading-6 font-medium text-[var(--color-text)]">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <Star
            size={15}
            fill="currentColor"
            className="text-[var(--color-accent)]"
          />

          <span className="text-xs font-medium">{product.rating}</span>

          <span className="text-xs text-[var(--color-text-muted)]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex min-h-14 flex-col justify-center">
          {hasDiscount ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-[var(--color-text-muted)] line-through">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>

                <span className="text-base font-bold text-[var(--color-text)]">
                  {product.discountPrice!.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <span className="rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-xs font-bold text-[var(--color-primary)]">
                {product.discount}٪ تخفیف
              </span>
            </div>
          ) : (
            <span className="text-base font-bold text-[var(--color-text)]">
              {product.price.toLocaleString('fa-IR')} تومان
            </span>
          )}
        </div>

        <Button
          type="button"
          size="lg"
          disabled={product.stock === 0}
          onClick={(event) => {
            event.stopPropagation();
            onAddToCart?.(product);
          }}
          className="flex w-full gap-1"
        >
          <ShoppingCart size={18} />

          {product.stock > 0 ? 'افزودن به سبد' : 'ناموجود'}
        </Button>
      </div>
    </article>
  );
}
