import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import CartItem from '@/components/cart/CartItem';
import { useCartStore } from '@/stores/cartStore';

export default function CartPage() {
  const navigate = useNavigate();

  const { items, clearCart, syncing } = useCartStore();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const totalDiscount = items.reduce((total, item) => {
    const discountPrice = item.product.discountPrice ?? item.product.price;

    return total + (item.product.price - discountPrice) * item.quantity;
  }, 0);

  const finalPrice = totalPrice - totalDiscount;

  const shippingPrice = finalPrice >= 5000000 ? 0 : 150000;

  const payablePrice = finalPrice + shippingPrice;

  async function handleClearCart() {
    try {
      await clearCart();

      toast.success('سبد خرید خالی شد');
    } catch (error) {
      console.error(error);

      toast.error('خالی کردن سبد خرید انجام نشد');
    }
  }

  function handleCheckout() {
    if (!items.length) {
      return;
    }

    navigate('/checkout');
  }

  if (!items.length) {
    return (
      <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-12 md:px-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
            <ShoppingCart size={38} className="text-[var(--color-primary)]" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">سبد خرید شما خالی است</h1>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            هنوز محصولی به سبد خرید اضافه نکرده‌اید.
          </p>

          <Link to="/products">
            <Button variant="primary" className="mt-6 rounded-full px-8">
              مشاهده محصولات
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">سبد خرید</h1>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems.toLocaleString('fa-IR')} کالا
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          disabled={syncing}
          onClick={handleClearCart}
          className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} />
          خالی کردن سبد
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white px-5">
          {items.map((item) => (
            <CartItem
              key={
                item.id ??
                `${item.product.id}-${item.selectedColor?.value ?? ''}`
              }
              item={item}
            />
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold">خلاصه سفارش</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">تعداد کالا</span>

              <span>{totalItems.toLocaleString('fa-IR')}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">مبلغ کالاها</span>

              <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>تخفیف</span>

                <span>{totalDiscount.toLocaleString('fa-IR')} تومان</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-500">هزینه ارسال</span>

              <span>
                {shippingPrice === 0
                  ? 'رایگان'
                  : `${shippingPrice.toLocaleString('fa-IR')} تومان`}
              </span>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">مبلغ قابل پرداخت</span>

                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {payablePrice.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            disabled={syncing}
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full py-6"
          >
            ادامه فرآیند خرید
          </Button>
        </aside>
      </div>
    </main>
  );
}
