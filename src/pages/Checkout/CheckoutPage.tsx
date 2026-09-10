import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/stores/cartStore';
import { checkoutSchema, type CheckoutFormData } from './checkoutSchema';

import { useCheckoutStore } from '@/stores/checkoutStore';

const SHIPPING_OPTIONS = [
  {
    id: 'normal',
    title: 'ارسال عادی',
    description: 'تحویل طی ۲ تا ۴ روز کاری',
    price: 150_000,
  },
  {
    id: 'express',
    title: 'ارسال سریع',
    description: 'تحویل طی ۱ تا ۲ روز کاری',
    price: 250_000,
  },
] as const;

const FREE_SHIPPING_THRESHOLD = 10_000_000;

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      description: '',
    },
  });

  const shippingMethod = useCheckoutStore((state) => state.shippingMethod);

  const setShippingMethod = useCheckoutStore(
    (state) => state.setShippingMethod,
  );

  const setShippingData = useCheckoutStore((state) => state.setShippingData);

  const subtotal = items.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;

    return total + price * item.quantity;
  }, 0);

  const originalTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const discount = Math.max(0, originalTotal - subtotal);

  const selectedShipping = SHIPPING_OPTIONS.find(
    (option) => option.id === shippingMethod,
  );

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (selectedShipping?.price ?? 0);

  const total = subtotal + shipping;

  const navigate = useNavigate();

  const onSubmit = (data: CheckoutFormData) => {
    setShippingData(data);

    navigate('/checkout/confirmation');
  };

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
        >
          <h2 className="text-base font-bold text-[var(--color-text)]">
            اطلاعات ارسال
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                نام و نام خانوادگی
              </label>

              <input
                id="fullName"
                type="text"
                {...register('fullName')}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="مثلاً سامان جاویدی"
              />

              {errors.fullName && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                شماره موبایل
              </label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                dir="ltr"
                {...register('phone')}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-left text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="09123456789"
              />

              {errors.phone && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="province"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                استان
              </label>

              <input
                id="province"
                type="text"
                {...register('province')}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="مثلاً تهران"
              />

              {errors.province && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.province.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                شهر
              </label>

              <input
                id="city"
                type="text"
                {...register('city')}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="مثلاً تهران"
              />

              {errors.city && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                آدرس کامل
              </label>

              <textarea
                id="address"
                rows={4}
                {...register('address')}
                className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-sm leading-6 text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="آدرس کامل محل تحویل را وارد کنید"
              />

              {errors.address && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                کد پستی
              </label>

              <input
                id="postalCode"
                type="text"
                inputMode="numeric"
                dir="ltr"
                {...register('postalCode')}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-left text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="1234567890"
              />

              {errors.postalCode && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.postalCode.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                توضیحات سفارش
                <span className="mr-1 text-xs font-normal text-[var(--color-text-muted)]">
                  (اختیاری)
                </span>
              </label>

              <input
                id="description"
                type="text"
                {...register('description')}
                className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
                placeholder="مثلاً تحویل در ساعات اداری"
              />

              {errors.description && (
                <p className="mt-1.5 text-xs text-[var(--color-error)]">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              روش ارسال
            </h2>

            <div className="mt-4 grid gap-3">
              {SHIPPING_OPTIONS.map((option) => {
                const isSelected = shippingMethod === option.id;
                const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setShippingMethod(option.id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-[var(--radius-lg)] border p-4 text-right transition ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                        : 'border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-[var(--color-primary)]'
                            : 'border-[var(--color-border)]'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                        )}
                      </span>

                      <div>
                        <p className="text-sm font-bold text-[var(--color-text)]">
                          {option.title}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-[var(--color-text)]">
                      {isFree
                        ? 'رایگان'
                        : `${option.price.toLocaleString('fa-IR')} تومان`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" variant="primary" size="lg">
              ادامه فرایند خرید
              <ArrowRight size={18} />
            </Button>
          </div>
        </form>

        <div className="flex h-fit flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-4 text-base font-bold text-[var(--color-text)]">
            اقلام سفارش
          </h2>

          <div className="mt-4 mb-4 space-y-3">
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

          <div className="mt-6 border-t border-[var(--color-border)] pt-5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-muted)]">
                مبلغ کالاها
              </span>

              <span className="font-medium text-[var(--color-text)]">
                {originalTotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            {discount > 0 && (
              <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--color-text-muted)]">تخفیف</span>

                <span className="font-medium text-[var(--color-error)]">
                  {discount.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="text-[var(--color-text-muted)]">
                هزینه ارسال
              </span>

              <span className="font-medium text-[var(--color-text)]">
                {shipping === 0
                  ? 'رایگان'
                  : `${shipping.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>

            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  مبلغ قابل پرداخت
                </span>

                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {total.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
