import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import type { CartItem as CartItemType } from '@/stores/cartStore';

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity, selectedColor } = item;

  const hasDiscount =
    product.discountPrice !== undefined &&
    product.discountPrice < product.price;

  const finalPrice = product.discountPrice ?? product.price;

  const handleIncrease = () => {
    if (quantity >= product.stock) {
      return;
    }

    updateQuantity(product.id, quantity + 1, selectedColor?.value);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1, selectedColor?.value);

      return;
    }

    handleRemove();
  };

  const handleRemove = () => {
    removeItem(product.id, selectedColor?.value);
    toast.success('محصول از سبد خرید حذف شد');
  };

  return (
    <article className="flex gap-3 border-b border-[var(--color-border)] py-5 last:border-b-0 sm:gap-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-background)] sm:h-28 sm:w-28">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain p-2"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold text-[var(--color-text)]">
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            برند: {product.brand}
          </p>

          {selectedColor && (
            <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span>رنگ:</span>

              <span
                className="h-4 w-4 rounded-full border border-black/10"
                style={{
                  backgroundColor: selectedColor.value,
                }}
              />

              <span>{selectedColor.name}</span>
            </div>
          )}
        </div>

        <div className="mt-3">
          {hasDiscount && (
            <span className="ml-2 text-xs text-[var(--color-text-muted)] line-through">
              {product.price.toLocaleString('fa-IR')} تومان
            </span>
          )}

          <span className="text-sm font-bold text-[var(--color-primary)]">
            {finalPrice?.toLocaleString('fa-IR')} تومان
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col">
        <div className="flex h-10 items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={quantity === 1 ? 'حذف محصول' : 'کاهش تعداد'}
            onClick={handleDecrease}
            className="h-10 w-9 rounded-none sm:w-10"
          >
            {quantity === 1 ? (
              <Trash2 size={15} className="text-[var(--color-error)]" />
            ) : (
              <Minus size={15} />
            )}
          </Button>

          <span
            className="flex h-10 min-w-10 items-center justify-center border-x border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]"
            aria-live="polite"
          >
            {quantity.toLocaleString('fa-IR')}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="افزایش تعداد"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="h-10 w-9 rounded-none sm:w-10"
          >
            <Plus size={15} />
          </Button>
        </div>
      </div>
    </article>
  );
}
