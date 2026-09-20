import { Package, ShoppingBag, Users, Wallet } from 'lucide-react';

import { useEffect, useState } from 'react';

import { api } from '@/api/axios';

type DashboardStats = {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/admin/dashboard');

        setStats(response.data);
      } catch (error) {
        console.error(error);
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
      value: stats?.totalProducts ?? 0,
      icon: Package,
    },
    {
      title: 'کاربران',
      value: stats?.totalUsers ?? 0,
      icon: Users,
    },
    {
      title: 'سفارش‌ها',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
    },
    {
      title: 'درآمد',
      value: stats?.totalRevenue ?? 0,
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
