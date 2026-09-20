import {
  ChevronDown,
  ChevronLeft,
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

export function UserMenu() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/login');
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          ورود
        </Link>

        <Link
          to="/register"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          ثبت‌نام
        </Link>
      </div>
    );
  }

  const displayName = user.name || user.email;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
        aria-expanded={open}
      >
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={21} />
          )}
        </span>

        <ChevronDown
          size={16}
          className={`hidden text-gray-500 transition-transform md:block ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] left-0 z-[80] w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={23} />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {displayName}
                </p>

                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <UserRound size={19} />
                <span>حساب کاربری</span>
              </div>

              <ChevronLeft size={17} className="text-gray-400" />
            </Link>

            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={19} />
                <span>سفارش‌ها</span>
              </div>

              <ChevronLeft size={17} className="text-gray-400" />
            </Link>

            <Link
              to="/addresses"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <MapPin size={19} />
                <span>آدرس‌ها</span>
              </div>

              <ChevronLeft size={17} className="text-gray-400" />
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Heart size={19} />
                <span>لیست علاقه‌مندی‌ها</span>
              </div>

              <ChevronLeft size={17} className="text-gray-400" />
            </Link>

            <Link
              to="/reviews"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={19} />
                <span>دیدگاه‌ها و پرسش‌ها</span>
              </div>

              <ChevronLeft size={17} className="text-gray-400" />
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-between rounded-xl bg-[var(--color-primary-light)] px-3 py-3 text-[var(--color-primary)] transition hover:opacity-80"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={19} />
                  <span>پنل مدیریت</span>
                </div>

                <ChevronLeft size={17} />
              </Link>
            )}
          </div>

          <div className="border-t p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={19} />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
