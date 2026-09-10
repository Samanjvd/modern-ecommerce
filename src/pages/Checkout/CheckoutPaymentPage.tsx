import { CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutStore } from '@/stores/checkoutStore';

const FREE_SHIPPING_THRESHOLD = 10_000_000;

export function CheckoutPaymentPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const shippingData = useCheckoutStore((state) => state.shippingData);

  const shippingMethod = useCheckoutStore((state) => state.shippingMethod);

  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  const [isPaying, setIsPaying] = useState(false);

  if (!items.length || !shippingData) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            سفارش قابل پرداخت نیست
          </h1>

          <Button
            type="button"
            variant="primary"
            className="mt-5"
            onClick={() => navigate('/checkout')}
          >
            بازگشت به checkout
          </Button>
        </div>
      </section>
    );
  }

  const subtotal = items.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;

    return total + price * item.quantity;
  }, 0);

  const shippingPrice = shippingMethod === 'express' ? 250_000 : 150_000;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingPrice;

  const total = subtotal + shipping;

  const handlePayment = () => {
    setIsPaying(true);

    setTimeout(() => {
      clearCart();
      clearCheckout();

      navigate('/checkout/success');
    }, 1200);
  };

  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div>
        <span className="text-xs text-[var(--color-text-muted)]">
          خانه / سبد خرید / تکمیل سفارش / پرداخت
        </span>

        <h1 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
          پرداخت سفارش
        </h1>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          روش پرداخت خود را انتخاب و سفارش را نهایی کنید.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              روش پرداخت
            </h2>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-primary)] bg-[var(--color-primary-light)] p-4 text-right"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)]">
                  <CreditCard size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    پرداخت آنلاین
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    پرداخت امن و سریع
                  </p>
                </div>
              </div>

              <CheckCircle2 size={20} className="text-[var(--color-primary)]" />
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-background)] p-4">
            <ShieldCheck
              size={20}
              className="shrink-0 text-[var(--color-primary)]"
            />

            <p className="text-xs leading-6 text-[var(--color-text-muted)]">
              اطلاعات پرداخت شما در این نسخه آزمایشی ذخیره نمی‌شود.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handlePayment}
            disabled={isPaying}
          >
            {isPaying
              ? 'در حال پردازش پرداخت...'
              : `پرداخت ${total.toLocaleString('fa-IR')} تومان`}
          </Button>
        </div>

        <aside className="h-fit rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            خلاصه پرداخت
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-muted)]">
                مبلغ کالاها
              </span>

              <span className="font-medium">
                {subtotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-muted)]">ارسال</span>

              <span className="font-medium">
                {shipping === 0
                  ? 'رایگان'
                  : `${shipping.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-sm font-bold">مبلغ نهایی</span>

                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {total.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
