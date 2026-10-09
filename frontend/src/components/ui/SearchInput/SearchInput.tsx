import { Search, X } from 'lucide-react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchInput({
  value = '',
  onChange,
  className = '',
  ...props
}: SearchInputProps) {
  const hasValue = value.length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  const handleClear = () => {
    onChange?.('');
  };

  return (
    <div className="relative w-full">
      <Search
        size={20}
        aria-hidden="true"
        className="absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-muted)]"
      />

      <input
        {...props}
        type="text"
        value={value}
        onChange={handleChange}
        className={cn(
          'h-12 w-full rounded-[var(--radius-lg)] border border-transparent bg-zinc-100 pr-12 pl-4 text-sm transition-all outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:bg-white focus:ring-3 focus:ring-[var(--color-primary-light)]',
          className,
        )}
      />

      {hasValue && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleClear}
          aria-label="پاک کردن جستجو"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-primary)]"
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
}
