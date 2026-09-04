import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types/Product';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';

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
  const hasDiscount =
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const addItem = useCartStore((state) => state.addItem);

  return (
    <article
      onClick={() => onProductClick?.(product)}
      className="group relative flex min-h-[430px] cursor-pointer flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-zinc-50">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite?.(product);
          }}
          className="absolute top-3 left-3 z-20 h-9 w-9 rounded-full bg-white/90 text-zinc-600 shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 hover:text-[var(--color-error)]"
        >
          <Heart size={18} />
        </Button>

        <div className="absolute top-16 left-3 z-20 flex flex-col gap-1.5">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/10"
              style={{
                backgroundColor: color.value,
              }}
            />
          ))}
        </div>

        <img
          src={product.image}
          alt={product.title}
          draggable={false}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
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

            addItem(product, 1, product.colors[0]);

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
