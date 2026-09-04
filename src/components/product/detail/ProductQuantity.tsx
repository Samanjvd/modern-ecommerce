import { Minus, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';

type ProductQuantityProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  onRemove?: () => void;
};

export function ProductQuantity({
  value,
  max,
  onChange,
  onRemove,
}: ProductQuantityProps) {
  const decrease = () => {
    if (value > 1) {
      onChange(value - 1);
      return;
    }

    onRemove?.();
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={value === 1 ? 'حذف از سبد خرید' : 'کاهش تعداد'}
          onClick={decrease}
          className="h-11 w-11 rounded-none"
        >
          {value === 1 ? (
            <Trash2 size={16} className="text-[var(--color-error)]" />
          ) : (
            <Minus size={16} />
          )}
        </Button>

        <span
          className="flex h-11 min-w-12 items-center justify-center border-x border-[var(--color-border)] text-sm font-bold text-[var(--color-text)]"
          aria-live="polite"
        >
          {value.toLocaleString('fa-IR')}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="افزایش تعداد"
          onClick={increase}
          disabled={value >= max}
          className="h-11 w-11 rounded-none"
        >
          <Plus size={16} />
        </Button>
      </div>

      {max > 0 && (
        <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
          حداکثر {max.toLocaleString('fa-IR')} عدد موجود است
        </p>
      )}
    </div>
  );
}
