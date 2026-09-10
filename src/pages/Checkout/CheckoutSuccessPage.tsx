import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

export function CheckoutSuccessPage() {
  // eslint-disable-next-line react-hooks/purity
  const orderCode = 'ZB-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <section className="flex min-h-[65vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          <CheckCircle2 size={34} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[var(--color-text)]">
          سفارش با موفقیت ثبت شد
        </h1>

        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
          پرداخت شما با موفقیت انجام شد و سفارش در حال پردازش است.
        </p>

        <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-background)] p-4">
          <span className="text-xs text-[var(--color-text-muted)]">
            کد سفارش
          </span>

          <p
            dir="ltr"
            className="mt-1 text-lg font-bold text-[var(--color-primary)]"
          >
            {orderCode}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/products">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ShoppingBag size={18} />
              ادامه خرید
            </Button>
          </Link>

          <Link to="/">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              بازگشت به خانه
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
