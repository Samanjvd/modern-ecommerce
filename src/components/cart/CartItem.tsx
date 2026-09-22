import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import type { CartItem as CartItemType } from '@/stores/cartStore';

type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { product, quantity, selectedColor } = item;

  const { removeItem, updateQuantity, syncing } = useCartStore();

  const [removing, setRemoving] = useState(false);

  const isBusy = syncing || removing;

  const finalPrice = product.discountPrice ?? product.price;

  const totalPrice = finalPrice * quantity;

  const image = product.images?.[0]?.url || '';

  async function handleRemove() {
    try {
      setRemoving(true);

      await removeItem(product.id, selectedColor?.value);

      toast.success('محصول از سبد خرید حذف شد');
    } catch (error) {
      console.error(error);

      toast.error('حذف محصول انجام نشد');
    } finally {
      setRemoving(false);
    }
  }

  async function handleIncrease() {
    if (quantity >= product.stock) {
      toast.error('بیشتر از موجودی نمی‌توانید اضافه کنید');
      return;
    }

    try {
      await updateQuantity(product.id, quantity + 1, selectedColor?.value);
    } catch (error) {
      console.error(error);

      toast.error('بروزرسانی تعداد انجام نشد');
    }
  }

  async function handleDecrease() {
    if (quantity <= 1) {
      await handleRemove();
      return;
    }

    try {
      await updateQuantity(product.id, quantity - 1, selectedColor?.value);
    } catch (error) {
      console.error(error);

      toast.error('بروزرسانی تعداد انجام نشد');
    }
  }

  return (
    <article
      className={`flex gap-4 border-b border-[var(--color-border)] py-5 last:border-b-0 ${
        isBusy ? 'opacity-60' : ''
      }`}
    >
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            بدون تصویر
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 font-medium text-gray-900">
            {product.title}
          </h3>

          {product.brand && (
            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          )}

          {selectedColor && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <span>رنگ:</span>

              <span
                className="h-4 w-4 rounded-full border"
                style={{
                  backgroundColor: selectedColor.value,
                }}
              />

              <span>{selectedColor.name}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center rounded-lg border border-[var(--color-border)]">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isBusy || quantity >= product.stock}
              onClick={handleIncrease}
              className="h-9 w-9 rounded-none"
              aria-label="افزایش تعداد"
            >
              <Plus size={16} />
            </Button>

            <span className="flex h-9 min-w-10 items-center justify-center border-x border-[var(--color-border)] text-sm">
              {quantity.toLocaleString('fa-IR')}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isBusy}
              onClick={handleDecrease}
              className="h-9 w-9 rounded-none"
              aria-label="کاهش تعداد"
            >
              <Minus size={16} />
            </Button>
          </div>

          <div className="text-left">
            <p className="font-bold text-[var(--color-primary)]">
              {totalPrice.toLocaleString('fa-IR')} تومان
            </p>

            {product.discountPrice && product.discountPrice < product.price && (
              <p className="text-xs text-gray-400 line-through">
                {(product.price * quantity).toLocaleString('fa-IR')} تومان
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isBusy}
            onClick={handleRemove}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label="حذف محصول"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </article>
  );
}
