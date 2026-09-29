import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getMyOrdersApi, type Order } from '@/api/order.api';
import { Button } from '@/components/ui/Button';

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار پرداخت',
  PAID: 'پرداخت شده',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersApi()
      .then(({ orders: result }) => setOrders(result))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-12 text-center">در حال دریافت سفارش‌ها...</div>;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold">سفارش‌های من</h1>
      {!orders.length ? (
        <div className="mt-6 rounded-2xl border bg-white p-10 text-center text-gray-500">
          هنوز سفارشی ثبت نکرده‌اید.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-5"
            >
              <div>
                <p className="font-bold">سفارش #{order.id}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">وضعیت: </span>
                {statusLabels[order.status] ?? order.status}
              </div>
              <div className="font-bold">
                {order.finalPrice.toLocaleString('fa-IR')} تومان
              </div>
              <Link to={`/orders/${order.id}`}>
                <Button variant="outline" size="sm">
                  جزئیات
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
