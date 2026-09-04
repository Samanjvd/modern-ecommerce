import { Minus, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
  useCartStore,
  type CartItem as CartItemType,
} from '@/stores/cartStore';

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity, selectedColor } = item;
  const finalPrice = product.discountPrice ?? product.price;
  const itemTotal = finalPrice * quantity;

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1, selectedColor?.value);
  };

  const handleDecrease = () => {
    updateQuantity(product.id, quantity - 1, selectedColor?.value);
  };

  const handleRemove = () => {
    removeItem(product.id, selectedColor?.value);
  };

  return (
    <article className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row">
      <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-background)] sm:w-28">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain p-2"
          draggable={false}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm leading-6 font-bold text-[var(--color-text)]">
              {product.title}
            </h2>

            {selectedColor && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ backgroundColor: selectedColor.value }}
                />
                رنگ {selectedColor.name}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="حذف محصول"
            onClick={handleRemove}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
          >
            <Trash2 size={17} />
          </Button>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end justify-between gap-4 sm:block">
            <div>
              <p className="mb-2 text-[11px] text-[var(--color-text-muted)]">
                تعداد
              </p>

              <div className="inline-flex h-10 items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="افزایش تعداد"
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus size={15} />
                </Button>

                <span className="flex h-10 min-w-10 items-center justify-center border-x border-[var(--color-border)] px-2 text-sm font-bold text-[var(--color-text)]">
                  {quantity.toLocaleString('fa-IR')}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="کاهش تعداد"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus size={15} />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-right sm:text-left">
            <p className="text-base font-bold text-[var(--color-text)]">
              {itemTotal.toLocaleString('fa-IR')} تومان
            </p>

            {quantity > 1 && (
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                {finalPrice.toLocaleString('fa-IR')} تومان ×{' '}
                {quantity.toLocaleString('fa-IR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
