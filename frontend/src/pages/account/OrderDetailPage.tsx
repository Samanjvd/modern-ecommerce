import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getOrderByIdApi, type Order } from '@/api/order.api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderId = Number(id);
    if (orderId > 0)
      getOrderByIdApi(orderId).then(({ order: result }) => setOrder(result));
  }, [id]);

  if (!order)
    return <div className="p-12 text-center">در حال دریافت سفارش...</div>;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <Link to="/orders" className="text-sm text-[var(--color-primary)]">
        بازگشت به سفارش‌ها
      </Link>
      <div className="mt-4 rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-bold">جزئیات سفارش #{order.id}</h1>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          <p>
            گیرنده: {order.firstName} {order.lastName}
          </p>
          <p>تلفن: {order.phone}</p>
          <p>شهر: {order.city}</p>
          <p>کد پستی: {order.postalCode}</p>
          <p className="md:col-span-2">آدرس: {order.address}</p>
        </div>
        <div className="mt-6 divide-y border-t">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <span>{item.product?.title ?? `محصول ${item.productId}`}</span>
              <span>
                {item.quantity.toLocaleString('fa-IR')} ×{' '}
                {item.price.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-left text-lg font-bold">
          مبلغ نهایی: {order.finalPrice.toLocaleString('fa-IR')} تومان
        </p>
      </div>
    </main>
  );
}
