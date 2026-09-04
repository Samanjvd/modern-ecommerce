import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  if (!items.length) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            سبد خرید خالی است
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            برای ادامه فرایند خرید ابتدا محصولی به سبد اضافه کنید.
          </p>

          <Link to="/products" className="mt-5 inline-flex">
            <Button type="button" variant="primary">
              مشاهده محصولات
              <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div>
        <span className="text-xs text-[var(--color-text-muted)]">
          خانه / سبد خرید / تکمیل سفارش
        </span>

        <h1 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
          تکمیل سفارش
        </h1>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          اطلاعات ارسال و پرداخت را وارد کنید.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            اطلاعات ارسال
          </h2>

          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            فرم آدرس و انتخاب روش ارسال در مرحله بعدی این بخش اضافه می‌شود.
          </p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            اقلام سفارش
          </h2>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor?.value ?? 'default'}`}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="min-w-0 truncate text-[var(--color-text-muted)]">
                  {item.product.title}
                </span>

                <span className="shrink-0 font-bold text-[var(--color-text)]">
                  ×{item.quantity.toLocaleString('fa-IR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
