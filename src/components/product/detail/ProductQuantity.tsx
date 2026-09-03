import { Minus, Plus } from 'lucide-react';

type ProductQuantityProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
};

export function ProductQuantity({
  value,
  max,
  onChange,
}: ProductQuantityProps) {
  const decrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div>
      <span className="text-sm font-bold text-[var(--color-text)]">تعداد</span>

      <div className="mt-3 inline-flex h-11 items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={decrease}
          disabled={value <= 1}
          className="flex h-full w-11 items-center justify-center text-[var(--color-text-muted)] transition hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="کاهش تعداد"
        >
          <Minus size={16} />
        </button>

        <span
          className="flex h-full min-w-12 items-center justify-center border-x border-[var(--color-border)] text-sm font-bold text-[var(--color-text)]"
          aria-live="polite"
        >
          {value.toLocaleString('fa-IR')}
        </span>

        <button
          type="button"
          onClick={increase}
          disabled={value >= max}
          className="flex h-full w-11 items-center justify-center text-[var(--color-text-muted)] transition hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="افزایش تعداد"
        >
          <Plus size={16} />
        </button>
      </div>

      {max > 0 && (
        <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
          حداکثر {max.toLocaleString('fa-IR')} عدد موجود است
        </p>
      )}
    </div>
  );
}
