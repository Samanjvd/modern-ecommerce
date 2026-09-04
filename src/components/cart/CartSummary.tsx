import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';

const FREE_SHIPPING_THRESHOLD = 10_000_000;
const SHIPPING_COST = 150_000;

export function CartSummary() {
  const items = useCartStore((state) => state.items);

  const originalTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const subtotal = items.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;

    return total + price * item.quantity;
  }, 0);

  const discount = originalTotal - subtotal;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const total = subtotal + shipping;

  return (
    <aside className="h-fit rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-base font-bold text-[var(--color-text)]">
        خلاصه سفارش
      </h2>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-[var(--color-text-muted)]">مجموع کالاها</span>

          <span className="font-medium text-[var(--color-text)]">
            {originalTotal.toLocaleString('fa-IR')} تومان
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--color-text-muted)]">تخفیف</span>

            <span className="font-medium text-[var(--color-error)]">
              {discount.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-[var(--color-text-muted)]">هزینه ارسال</span>

          <span className="font-medium text-[var(--color-text)]">
            {shipping === 0
              ? 'رایگان'
              : `${shipping.toLocaleString('fa-IR')} تومان`}
          </span>
        </div>

        <div className="border-t border-[var(--color-border)] pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-[var(--color-text)]">
              مبلغ قابل پرداخت
            </span>

            <span className="text-lg font-bold text-[var(--color-text)]">
              {total.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      </div>

      <Link to="/checkout" className="block">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="mt-6 w-full"
        >
          ادامه فرایند خرید
          <ArrowLeft size={18} />
        </Button>
      </Link>

      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="mt-3 text-center text-[11px] leading-5 text-[var(--color-text-muted)]">
          برای ارسال رایگان{' '}
          {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('fa-IR')} تومان
          دیگر خرید کنید.
        </p>
      )}
    </aside>
  );
}
