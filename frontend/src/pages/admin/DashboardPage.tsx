import { Package, ShoppingBag, Users, Wallet } from 'lucide-react';

import { useEffect, useState } from 'react';

import { getDashboardApi, type DashboardResponse } from '@/api/admin.api';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse['dashboard'] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await getDashboardApi();

        setStats(response.dashboard);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="text-gray-500">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  const cards = [
    {
      title: 'محصولات',
      value: stats?.products.total ?? 0,
      icon: Package,
    },
    {
      title: 'کاربران',
      value: stats?.users.total ?? 0,
      icon: Users,
    },
    {
      title: 'سفارش‌ها',
      value: stats?.orders.total ?? 0,
      icon: ShoppingBag,
    },
    {
      title: 'درآمد',
      value: stats?.sales.total ?? 0,
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>

        <p className="mt-2 text-sm text-gray-500">نمای کلی فروشگاه</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>

                  <p className="mt-3 text-2xl font-bold">
                    {card.value.toLocaleString('fa-IR')}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--color-primary-light)] p-3 text-[var(--color-primary)]">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
