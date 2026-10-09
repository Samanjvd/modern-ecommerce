import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { getAdminOrdersApi, updateOrderStatusApi } from '@/api/admin.api';
import type { Order, OrderStatus } from '@/api/order.api';

const statuses: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setOrders((await getAdminOrdersApi()).orders);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
      .catch(() => toast.error('دریافت سفارش‌ها انجام نشد'))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(id: number, status: OrderStatus) {
    try {
      const { order } = await updateOrderStatusApi(id, status);
      setOrders((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: order.status } : item,
        ),
      );
      toast.success('وضعیت سفارش تغییر کرد');
    } catch {
      toast.error('تغییر وضعیت انجام نشد');
    }
  }

  if (loading)
    return <div className="p-8 text-center">در حال دریافت سفارش‌ها...</div>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مدیریت سفارش‌ها</h1>
        <p className="mt-1 text-sm text-gray-500">
          مشاهده و تغییر وضعیت سفارش‌ها
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-right">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4">شماره</th>
              <th className="px-5 py-4">کاربر</th>
              <th className="px-5 py-4">مبلغ</th>
              <th className="px-5 py-4">تاریخ</th>
              <th className="px-5 py-4">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="px-5 py-4 font-bold">#{order.id}</td>
                <td className="px-5 py-4">
                  {order.user?.name || order.user?.email || '-'}
                </td>
                <td className="px-5 py-4">
                  {order.finalPrice.toLocaleString('fa-IR')} تومان
                </td>
                <td className="px-5 py-4 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      changeStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="rounded-lg border px-2 py-2 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
