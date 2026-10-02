import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { SearchModal } from '@/components/search/searchModal';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '@/data/categories';

import { UserMenu } from '../UserMenu';
import { CartPopover } from '../CartPopover';

export function Header() {
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.localStorage.getItem('theme') === 'dark',
  );
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    window.localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const submitSearch = () => {
    const query = search.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
        <div className="w-full px-4 md:px-16">
          <div className="flex h-20 items-center gap-4 md:h-22 md:gap-6">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight text-[var(--color-primary)] md:text-3xl"
            >
              زنبیلک
            </Link>

            <Button
              variant="ghost"
              type="button"
              onClick={() => setCategoriesOpen((current) => !current)}
              aria-expanded={categoriesOpen}
              className="hidden gap-2 px-2 text-sm font-medium md:inline-flex"
            >
              <Menu size={20} />
              دسته‌بندی‌ها
            </Button>

            <div className="hidden w-full max-w-2xl md:block">
              <SearchInput
                value={search}
                onChange={setSearch}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') submitSearch();
                }}
                placeholder="دنبال چی هستی؟"
              />
            </div>

            <div className="mr-auto flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="حالت تاریک"
                aria-pressed={darkMode}
                onClick={() => setDarkMode((current) => !current)}
                className="hidden h-10 w-10 rounded-full md:inline-flex"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              <CartPopover />

              <UserMenu />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="منو"
                aria-expanded={categoriesOpen}
                onClick={() => setCategoriesOpen((current) => !current)}
                className="flex h-10 w-10 rounded-full md:hidden"
              >
                {categoriesOpen ? <X size={21} /> : <Menu size={21} />}
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
              className="h-12 w-full justify-start rounded-[var(--radius-lg)] bg-zinc-100 px-4 text-right text-sm font-normal text-[var(--color-text-muted)] hover:bg-zinc-200"
            >
              <Search size={19} />

              <span>{search || 'دنبال چی هستی؟'}</span>
            </Button>
          </div>
        </div>
      </header>

      {categoriesOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setCategoriesOpen(false)}
        >
          <div
            role="dialog"
            aria-label="دسته‌بندی محصولات"
            onClick={(event) => event.stopPropagation()}
            className="absolute top-20 right-2 left-2 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-2xl md:right-16 md:left-16 md:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">زنبیلک</p>
                <h2 className="mt-1 text-lg font-bold text-[var(--color-text)]">
                  دسته‌بندی محصولات
                </h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCategoriesOpen(false)}
                aria-label="بستن دسته‌بندی‌ها"
              >
                <X size={19} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    navigate(category.href);
                    setCategoriesOpen(false);
                  }}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-right transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <span className="text-sm font-bold">{category.title}</span>
                  <span className="mt-1 block text-xs text-[var(--color-text-muted)]">
                    مشاهده محصولات
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <SearchModal
        open={searchOpen}
        value={search}
        onChange={setSearch}
        onSubmit={submitSearch}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
