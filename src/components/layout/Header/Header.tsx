import { Menu, Moon, Search } from 'lucide-react';
import { useState } from 'react';

import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { SearchModal } from '@/components/search/searchModal';
import { Link } from 'react-router-dom';

import { UserMenu } from '../UserMenu';
import { CartPopover } from '../CartPopover';

export function Header() {
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

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

            <div className="mr-auto flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="حالت تاریک"
                className="hidden h-10 w-10 rounded-full md:inline-flex"
              >
                <Moon size={20} />
              </Button>

              <CartPopover />

              <UserMenu />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="منو"
                className="flex h-10 w-10 rounded-full md:hidden"
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
              className="h-12 w-full justify-start rounded-[var(--radius-lg)] bg-zinc-100 px-4 text-right text-sm font-normal text-[var(--color-text-muted)] hover:bg-zinc-200"
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
