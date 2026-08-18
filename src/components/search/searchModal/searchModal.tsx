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
    <div className="fixed inset-0 z-[100] bg-[var(--color-background)] md:hidden">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex h-16 items-center gap-3 px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن جستجو"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-zinc-100"
          >
            <ArrowRight size={21} />
          </button>

          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="دنبال چی هستی؟"
              className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] pr-11 pl-10 text-sm transition-all outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-light)]"
            />

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="پاک کردن جستجو"
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-primary)]"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-6">
        {!value ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--color-text)]">
                جستجوهای اخیر
              </h2>

              <button
                type="button"
                className="flex items-center gap-1 text-xs text-[var(--color-primary)]"
              >
                <Trash2 size={15} />
                پاک کردن
              </button>
            </div>

            <div className="flex flex-col">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => onChange(search)}
                  className="flex items-center gap-3 border-b border-[var(--color-border)] py-4 text-right text-sm text-[var(--color-text)]"
                >
                  <Clock3
                    size={17}
                    className="text-[var(--color-text-muted)]"
                  />

                  <span>{search}</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <p className="mb-4 text-xs text-[var(--color-text-muted)]">
              نتایج جستجو برای:
            </p>

            <h2 className="text-lg font-bold text-[var(--color-text)]">
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
