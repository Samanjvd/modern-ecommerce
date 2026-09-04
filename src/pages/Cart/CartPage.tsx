import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';

export function CartPage() {
  const items = useCartStore((state) => state.items);

  if (!items.length) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-12 md:px-16">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[var(--color-text)]">
            سبد خریدت خالیه
          </h1>

          <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
            هنوز محصولی به سبد خرید اضافه نکردی.
          </p>

          <Link to="/products" className="mt-6">
            <Button type="button" variant="primary" size="md">
              مشاهده محصولات
              <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div className="mb-6">
        <span className="text-xs text-[var(--color-text-muted)]">
          خانه / سبد خرید
        </span>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              سبد خرید
            </h1>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              محصولات انتخاب‌شده را بررسی و سفارش خود را نهایی کن.
            </p>
          </div>

          <span className="text-xs text-[var(--color-text-muted)]">
            {totalQuantity.toLocaleString('fa-IR')} کالا
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.selectedColor?.value ?? 'default'}`}
              item={item}
            />
          ))}
        </div>

        <CartSummary />
      </div>
    </section>
  );
}
