import { ArrowRight, Check, MapPin, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import { useCheckoutStore } from '@/stores/checkoutStore';

const SHIPPING_OPTIONS = {
  normal: {
    title: 'ارسال عادی',
    description: 'تحویل طی ۲ تا ۴ روز کاری',
    price: 150_000,
  },
  express: {
    title: 'ارسال سریع',
    description: 'تحویل طی ۱ تا ۲ روز کاری',
    price: 250_000,
  },
} as const;

const FREE_SHIPPING_THRESHOLD = 10_000_000;

export function CheckoutConfirmationPage() {
  const items = useCartStore((state) => state.items);

  const shippingData = useCheckoutStore((state) => state.shippingData);

  const shippingMethod = useCheckoutStore((state) => state.shippingMethod);

  if (!items.length || !shippingData) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[var(--color-text)]">
            اطلاعات سفارش پیدا نشد
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            ابتدا اطلاعات ارسال را تکمیل کنید.
          </p>

          <Link to="/checkout" className="mt-5 inline-flex">
            <Button type="button" variant="primary">
              بازگشت به تکمیل سفارش
              <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const originalTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const subtotal = items.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;

    return total + price * item.quantity;
  }, 0);

  const discount = Math.max(0, originalTotal - subtotal);

  const selectedShipping = SHIPPING_OPTIONS[shippingMethod];

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : selectedShipping.price;

  const total = subtotal + shipping;

  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div>
        <span className="text-xs text-[var(--color-text-muted)]">
          خانه / سبد خرید / تکمیل سفارش / تأیید سفارش
        </span>

        <h1 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
          تأیید سفارش
        </h1>

        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          اطلاعات سفارش را بررسی کنید و سپس وارد مرحله پرداخت شوید.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <MapPin size={19} className="text-[var(--color-primary)]" />

              <h2 className="text-base font-bold text-[var(--color-text)]">
                آدرس تحویل
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  گیرنده
                </span>

                <p className="mt-1 text-sm font-bold text-[var(--color-text)]">
                  {shippingData.fullName}
                </p>
              </div>

              <div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  شماره موبایل
                </span>

                <p
                  dir="ltr"
                  className="mt-1 text-right text-sm font-bold text-[var(--color-text)]"
                >
                  {shippingData.phone}
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-[var(--color-text-muted)]">
                  آدرس
                </span>

                <p className="mt-1 text-sm leading-7 text-[var(--color-text)]">
                  {shippingData.province}، {shippingData.city}،{' '}
                  {shippingData.address}
                </p>
              </div>

              <div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  کد پستی
                </span>

                <p
                  dir="ltr"
                  className="mt-1 text-right text-sm font-bold text-[var(--color-text)]"
                >
                  {shippingData.postalCode}
                </p>
              </div>

              {shippingData.description && (
                <div>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    توضیحات
                  </span>

                  <p className="mt-1 text-sm text-[var(--color-text)]">
                    {shippingData.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Truck size={19} className="text-[var(--color-primary)]" />

              <h2 className="text-base font-bold text-[var(--color-text)]">
                روش ارسال
              </h2>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-primary)] bg-[var(--color-primary-light)] p-4">
              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">
                  {selectedShipping.title}
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {selectedShipping.description}
                </p>
              </div>

              <span className="shrink-0 text-sm font-bold text-[var(--color-text)]">
                {shipping === 0
                  ? 'رایگان'
                  : `${shipping.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link to="/checkout">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                ویرایش اطلاعات
              </Button>
            </Link>

            <Link to="/checkout/payment">
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                تأیید و ادامه پرداخت
                <Check size={18} />
              </Button>
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            خلاصه سفارش
          </h2>

          <div className="mt-5 space-y-3">
            {items.map((item) => {
              const price = item.product.discountPrice ?? item.product.price;

              return (
                <div
                  key={`${item.product.id}-${item.selectedColor?.value ?? 'default'}`}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <span className="min-w-0 truncate text-[var(--color-text-muted)]">
                    {item.product.title}
                  </span>

                  <span className="shrink-0 font-bold text-[var(--color-text)]">
                    {price.toLocaleString('fa-IR')} ×{' '}
                    {item.quantity.toLocaleString('fa-IR')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-[var(--color-border)] pt-5">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-muted)]">
                مبلغ کالاها
              </span>

              <span className="font-medium">
                {originalTotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            {discount > 0 && (
              <div className="mt-3 flex justify-between gap-4 text-sm">
                <span className="text-[var(--color-text-muted)]">تخفیف</span>

                <span className="font-medium text-[var(--color-error)]">
                  {discount.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            )}

            <div className="mt-3 flex justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-muted)]">ارسال</span>

              <span className="font-medium">
                {shipping === 0
                  ? 'رایگان'
                  : `${shipping.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>

            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold">مبلغ قابل پرداخت</span>

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
