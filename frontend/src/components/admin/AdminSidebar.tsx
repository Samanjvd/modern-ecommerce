import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  {
    to: '/admin',
    label: 'داشبورد',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/products',
    label: 'محصولات',
    icon: Boxes,
  },
  {
    to: '/admin/categories',
    label: 'دسته‌بندی‌ها',
    icon: FolderTree,
  },
  {
    to: '/admin/orders',
    label: 'سفارش‌ها',
    icon: ShoppingBag,
  },
  {
    to: '/admin/users',
    label: 'کاربران',
    icon: Users,
  },
];

type AdminSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function AdminSidebar({
  collapsed,
  onToggle,
}: AdminSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside
      className={`sticky top-0 right-0 flex h-screen shrink-0 flex-col border-l bg-white shadow-sm transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div
        className={`relative flex h-20 shrink-0 items-center border-b ${
          collapsed ? 'justify-center px-3' : 'px-5'
        }`}
      >
        <Link to="/" className="flex items-center">
          <span
            className={`font-bold text-[var(--color-primary)] ${
              collapsed ? 'text-lg' : 'text-xl'
            }`}
          >
            {collapsed ? 'ز' : 'زنبیلک'}
          </span>

          {!collapsed && (
            <span className="mr-2 text-xs text-gray-400">Admin</span>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 -left-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
          aria-label={collapsed ? 'باز کردن منو' : 'بستن منو'}
        >
          {collapsed ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group flex items-center rounded-xl py-3 text-sm transition ${
                  collapsed ? 'justify-center px-3' : 'gap-3 px-4'
                } ${
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />

              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'خروج از حساب' : undefined}
          className={`flex w-full items-center rounded-xl py-3 text-sm text-red-500 transition hover:bg-red-50 ${
            collapsed ? 'justify-center px-3' : 'gap-3 px-4'
          }`}
        >
          <LogOut size={20} />

          {!collapsed && <span>خروج از حساب</span>}
        </button>
      </div>
    </aside>
  );
}
