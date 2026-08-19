import { Button } from '@/components/ui/Button';
import { ArrowRight, Clock3, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

type SearchModalProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

const recentSearches = ['آیفون ۱۵', 'هدفون بی‌سیم', 'لپ تاپ ایسوس'];

export function SearchModal({
  open,
  value,
  onChange,
  onClose,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="جستجو"
      className="fixed inset-0 z-[100] bg-[var(--color-background)] md:hidden"
    >
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex h-16 items-center gap-3 px-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="بستن جستجو"
            className="shrink-0 rounded-full"
          >
            <ArrowRight size={21} />
          </Button>

          <div className="relative flex-1">
            <Search
              size={19}
              aria-hidden="true"
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="دنبال چی هستی؟"
              aria-label="جستجوی محصولات"
              className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] pr-11 pl-10 text-sm transition-all outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-light)]"
            />

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange('')}
                aria-label="پاک کردن جستجو"
                className="absolute top-1/2 left-1 h-8 w-8 -translate-y-1/2 text-[var(--color-primary)]"
              >
                <X size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-6">
        {!value ? (
          <section aria-labelledby="recent-searches-title">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="recent-searches-title"
                className="text-sm font-bold text-[var(--color-text)]"
              >
                جستجوهای اخیر
              </h2>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-normal text-[var(--color-primary)]"
              >
                <Trash2 size={15} />
                پاک کردن
              </Button>
            </div>

            <div className="flex flex-col">
              {recentSearches.map((search) => (
                <Button
                  key={search}
                  type="button"
                  variant="ghost"
                  onClick={() => onChange(search)}
                  className="h-auto w-full justify-start gap-3 rounded-none border-b border-[var(--color-border)] py-4 text-right text-sm font-normal text-[var(--color-text)]"
                >
                  <Clock3
                    size={17}
                    aria-hidden="true"
                    className="shrink-0 text-[var(--color-text-muted)]"
                  />

                  <span>{search}</span>
                </Button>
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="search-results-title">
            <p className="mb-4 text-xs text-[var(--color-text-muted)]">
              نتایج جستجو برای:
            </p>

            <h2
              id="search-results-title"
              className="text-lg font-bold text-[var(--color-text)]"
            >
              {value}
            </h2>

            <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-5 text-center text-sm text-[var(--color-text-muted)]">
              در حال آماده‌سازی نتایج جستجو...
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
