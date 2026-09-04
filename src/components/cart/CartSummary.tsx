import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';

export function CartSummary() {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;

    return total + price * item.quantity;
  }, 0);

  const originalTotal = items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const discount = originalTotal - subtotal;

  return (
    <aside className="h-fit rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-base font-bold text-[var(--color-text)]">
        خلاصه سفارش
      </h2>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-muted)]">مجموع کالاها</span>

          <span className="font-medium text-[var(--color-text)]">
            {originalTotal.toLocaleString('fa-IR')} تومان
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">تخفیف</span>

            <span className="font-medium text-[var(--color-error)]">
              {discount.toLocaleString('fa-IR')} تومان-
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-sm font-bold text-[var(--color-text)]">
            مبلغ قابل پرداخت
          </span>

          <span className="text-lg font-bold text-[var(--color-text)]">
            {subtotal.toLocaleString('fa-IR')} تومان
          </span>
        </div>
      </div>

      <Button type="button" variant="primary" size="lg" className="mt-6 w-full">
        ادامه فرایند خرید
        <ArrowLeft size={18} />
      </Button>
    </aside>
  );
}
