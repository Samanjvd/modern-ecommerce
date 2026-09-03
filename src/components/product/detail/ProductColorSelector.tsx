import { useState } from 'react';

import type { ProductColor } from '@/types/Product';

type ProductColorSelectorProps = {
  colors: ProductColor[];
  value?: ProductColor;
  onChange?: (color: ProductColor) => void;
};

export function ProductColorSelector({
  colors,
  value,
  onChange,
}: ProductColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    value ?? colors[0],
  );

  if (!colors.length) {
    return null;
  }

  const handleSelect = (color: ProductColor) => {
    setSelectedColor(color);
    onChange?.(color);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[var(--color-text)]">رنگ:</span>

        <span className="text-sm text-[var(--color-text-muted)]">
          {selectedColor.name}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor.value === color.value;

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => handleSelect(color)}
              className={`flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-xs transition-all duration-200 ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
              }`}
              aria-pressed={isSelected}
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: color.value }}
              />

              {color.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
