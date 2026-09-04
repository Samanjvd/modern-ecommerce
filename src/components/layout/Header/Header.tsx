import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { SearchModal } from '@/components/search/searchModal';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';

export function Header() {
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItems = useCartStore((state) => state.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/70 backdrop-blur-md">
        <div className="w-full px-4 md:px-16">
          <div className="flex h-22 items-center gap-6">
            <a
              href="/"
              className="text-3xl font-bold tracking-tight text-[var(--color-primary)]"
            >
              زنبیلک
            </a>

            <Button
              variant="ghost"
              className="hidden gap-2 px-2 text-sm font-medium md:inline-flex"
            >
              <Menu size={20} />
              دسته‌بندی‌ها
            </Button>

            <div className="hidden w-full max-w-2xl md:block">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="دنبال چی هستی؟"
              />
            </div>

            <div className="mr-auto flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="علاقه‌مندی‌ها"
                className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] md:inline-flex"
              >
                <Heart size={20} />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="حالت تاریک"
                className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] md:inline-flex"
              >
                <Moon size={20} />
              </Button>

              <Link to="/cart" aria-label="سبد خرید">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="سبد خرید"
                  className="relative"
                >
                  <ShoppingCart size={21} />

                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] leading-none text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Button
                type="button"
                variant="ghost"
                className="h-10 items-center gap-2 border border-[var(--color-border)] px-4 text-sm font-medium transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <UserRound size={18} />
                <span className="hidden md:block">ورود به حساب</span>
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="منو"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-100 md:hidden"
              >
                <Menu size={21} />
              </Button>
            </div>
          </div>

          <div className="pb-4 md:hidden">
            <Button
              type="button"
              variant="ghost"
              aria-label="باز کردن جستجو"
              aria-controls="search-modal"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className="h-12 w-full justify-start rounded-[var(--radius-lg)] bg-zinc-100 px-4 text-right text-sm font-normal text-[var(--color-text-muted)] hover:bg-zinc-200 hover:text-[var(--color-text-muted)]"
            >
              <Search size={19} />

              <span>{search || 'دنبال چی هستی؟'}</span>
            </Button>
          </div>
        </div>
      </header>

      <SearchModal
        open={searchOpen}
        value={search}
        onChange={setSearch}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
