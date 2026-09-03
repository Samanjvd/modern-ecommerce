import {
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  type FilterConfig,
  type FilterOption,
  type FilterState,
  getFilterConfigs,
} from '@/data/productFilterConfigs';
import type { Product, ProductColor, ProductCategory } from '@/types/Product';

type ProductFiltersProps = {
  products: Product[];
  value: FilterState;
  onChange: (value: FilterState) => void;
  onClose?: () => void;
};

const getProductValue = (product: Product, filterId: string): unknown => {
  const parts = filterId.split('.');

  let current: unknown = product;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return current;
};

const getColorOptions = (products: Product[]): ProductColor[] => {
  const colors = new Map<string, ProductColor>();

  products.forEach((product) => {
    product.colors.forEach((color) => {
      if (!colors.has(color.name)) {
        colors.set(color.name, color);
      }
    });
  });

  return Array.from(colors.values());
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price);
};

const getInitialPrice = (products: Product[]): [number, number] => {
  if (!products.length) {
    return [0, 0];
  }

  const prices = products.map(
    (product) => product.discountPrice ?? product.price,
  );

  return [Math.min(...prices), Math.max(...prices)];
};

export function ProductFilters({
  products,
  value,
  onChange,
  onClose,
}: ProductFiltersProps) {
  const configs = useMemo(
    () => getFilterConfigs(value.category),
    [value.category],
  );

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    price: true,
  });

  const [brandSearch, setBrandSearch] = useState('');

  const priceRange = useMemo(() => getInitialPrice(products), [products]);

  const availableBrands = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.brand).filter(Boolean)),
    );
  }, [products]);

  const categoryOptions: {
    value: ProductCategory;
    label: string;
  }[] = [
    { value: 'mobile', label: 'موبایل' },
    { value: 'laptop', label: 'لپ‌تاپ و کامپیوتر' },
    { value: 'headphone', label: 'هدفون و هندزفری' },
    { value: 'smartwatch', label: 'ساعت هوشمند' },
    { value: 'camera', label: 'دوربین' },
    { value: 'accessories', label: 'لوازم جانبی' },
    { value: 'gaming', label: 'گیمینگ' },
    { value: 'home', label: 'خانه' },
  ];

  const commonFilterIds = new Set([
    'brand',
    'colors',
    'rating',
    'availability',
  ]);

  const handleCategoryChange = (category?: ProductCategory) => {
    const nextValues = Object.fromEntries(
      Object.entries(value.values).filter(([key]) => commonFilterIds.has(key)),
    );

    onChange({
      category,
      values: nextValues,
      price: value.price,
    });
  };

  const availableColors = useMemo(() => getColorOptions(products), [products]);

  const availableOptions = useMemo(() => {
    const result: Record<string, FilterOption[]> = {};

    configs.forEach((config) => {
      if (config.id === 'brand') {
        result.brand = availableBrands.map((brand) => ({
          value: brand,
          label: brand,
        }));

        return;
      }

      if (config.id === 'colors' || config.type === 'color') {
        return;
      }

      if (config.options?.length) {
        result[config.id] = config.options;
        return;
      }

      const values = new Set<string>();

      products.forEach((product) => {
        const productValue = getProductValue(product, config.id);

        if (
          typeof productValue === 'string' ||
          typeof productValue === 'number' ||
          typeof productValue === 'boolean'
        ) {
          values.add(String(productValue));
        }
      });

      result[config.id] = Array.from(values).map((item) => ({
        value: item,
        label: item,
      }));
    });

    return result;
  }, [configs, products, availableBrands]);

  const activeFilterCount = useMemo(() => {
    return Object.values(value.values).reduce(
      (total, items) => total + items.length,
      0,
    );
  }, [value.values]);

  const hasPriceFilter =
    value.price[0] !== priceRange[0] || value.price[1] !== priceRange[1];

  const toggleGroup = (id: string) => {
    setCollapsed((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const toggleValue = (filterId: string, selectedValue: string) => {
    const currentValues = value.values[filterId] ?? [];

    const nextValues = currentValues.includes(selectedValue)
      ? currentValues.filter((item) => item !== selectedValue)
      : [...currentValues, selectedValue];

    onChange({
      ...value,
      values: {
        ...value.values,
        [filterId]: nextValues,
      },
    });
  };

  const resetFilters = () => {
    onChange({
      values: {},
      price: priceRange,
    });
  };

  const updateMinPrice = (newMin: number) => {
    const min = Math.max(priceRange[0], Math.min(newMin, value.price[1]));

    onChange({
      ...value,
      price: [min, value.price[1]],
    });
  };

  const updateMaxPrice = (newMax: number) => {
    const max = Math.min(priceRange[1], Math.max(newMax, value.price[0]));

    onChange({
      ...value,
      price: [value.price[0], max],
    });
  };

  const renderCheckbox = (config: FilterConfig) => {
    let options = availableOptions[config.id] ?? [];

    if (config.id === 'brand') {
      const query = brandSearch.trim().toLocaleLowerCase('fa');

      if (query) {
        options = options.filter((option) =>
          option.label.toLocaleLowerCase('fa').includes(query),
        );
      }
    }

    if (!options.length) {
      return (
        <p className="py-3 text-xs text-[var(--color-text-muted)]">
          گزینه‌ای برای نمایش وجود ندارد.
        </p>
      );
    }

    return (
      <div className="space-y-1.5">
        {config.id === 'brand' && (
          <div className="relative mb-2.5">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-muted)]"
            />

            <input
              type="search"
              value={brandSearch}
              onChange={(event) => setBrandSearch(event.target.value)}
              placeholder="جستجوی برند..."
              className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] pr-9 pl-3 text-xs text-[var(--color-text)] transition-all duration-200 outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
            />
          </div>
        )}

        {options.map((option) => {
          const checked =
            value.values[config.id]?.includes(option.value) ?? false;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleValue(config.id, option.value)}
              className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 text-right text-xs transition-all duration-200 ${
                checked
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                    checked
                      ? 'scale-105 border-[var(--color-primary)] bg-[var(--color-primary)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] group-hover:border-[var(--color-primary)]'
                  }`}
                >
                  {checked && (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  )}
                </span>

                <span>{option.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderColors = () => {
    if (!availableColors.length) {
      return (
        <p className="py-3 text-xs text-[var(--color-text-muted)]">
          رنگی برای نمایش وجود ندارد.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {availableColors.map((color) => {
          const checked = value.values.colors?.includes(color.name) ?? false;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => toggleValue('colors', color.name)}
              className={`group flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all duration-200 ${
                checked
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-background)]'
              }`}
            >
              <span
                className={`relative h-7 w-7 shrink-0 rounded-full border border-black/10 shadow-sm transition-transform duration-200 group-hover:scale-110 ${
                  checked ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: color.value,
                }}
              >
                {checked && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10">
                    <Check
                      size={13}
                      strokeWidth={3}
                      className={
                        color.value.toLowerCase() === '#f8fafc' ||
                        color.value.toLowerCase() === '#d1d5db'
                          ? 'text-black'
                          : 'text-white'
                      }
                    />
                  </span>
                )}
              </span>

              <span
                className={`truncate text-xs ${
                  checked
                    ? 'font-medium text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderRating = (config: FilterConfig) => {
    const options = config.options ?? [];

    return (
      <div className="space-y-1.5">
        {options.map((option) => {
          const checked = value.values.rating?.includes(option.value) ?? false;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleValue('rating', option.value)}
              className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 transition-all duration-200 ${
                checked
                  ? 'bg-[var(--color-primary-light)]'
                  : 'hover:bg-[var(--color-background)]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border transition-all ${
                    checked
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                      : 'border-[var(--color-border)] group-hover:border-[var(--color-primary)]'
                  }`}
                >
                  {checked && (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  )}
                </span>

                <span
                  className={`text-xs ${
                    checked
                      ? 'font-medium text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {option.label}
                </span>
              </span>

              <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
                <Star size={13} fill="currentColor" />
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-[var(--color-text)]">
              فیلتر محصولات
            </h2>

            <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
              {activeFilterCount > 0
                ? `${activeFilterCount.toLocaleString('fa-IR')} فیلتر فعال`
                : 'محصول موردنظرت را پیدا کن'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {activeFilterCount > 0 || hasPriceFilter ? (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] text-[var(--color-error)] transition hover:bg-[var(--color-background)]"
            >
              <RotateCcw size={12} />
              پاک کردن
            </button>
          ) : null}

          {onClose && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="بستن فیلترها"
            >
              <X size={17} />
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <section className="border-b border-[var(--color-border)] p-4">
          <button
            type="button"
            onClick={() => toggleGroup('category')}
            className="group flex w-full cursor-pointer items-center justify-between"
          >
            <span className="text-xs font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
              دسته‌بندی
            </span>

            <span className="text-[var(--color-text-muted)] transition-transform duration-200">
              {collapsed.category ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </span>
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              collapsed.category
                ? 'mt-0 grid-rows-[0fr] opacity-0'
                : 'mt-3 grid-rows-[1fr] opacity-100'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategoryChange(undefined)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                    value.category === undefined
                      ? 'bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'
                  }`}
                >
                  <span>همه محصولات</span>

                  {value.category === undefined && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                  )}
                </button>

                {categoryOptions.map((category) => {
                  const isSelected = value.category === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleCategoryChange(category.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-primary)]/10 font-bold text-[var(--color-primary)]'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'
                      }`}
                    >
                      <span>{category.label}</span>

                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)] p-4">
          <button
            type="button"
            onClick={() => toggleGroup('price')}
            className="group flex w-full cursor-pointer items-center justify-between"
          >
            <span className="text-xs font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
              محدوده قیمت
            </span>

            <span className="text-[var(--color-text-muted)] transition-transform duration-200">
              {collapsed.price ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </span>
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              collapsed.price
                ? 'mt-0 grid-rows-[0fr] opacity-0'
                : 'mt-3 grid-rows-[1fr] opacity-100'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5">
                  <span className="block text-[9px] text-[var(--color-text-muted)]">
                    حداقل قیمت
                  </span>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {formatPrice(value.price[0])}
                    </span>

                    <span className="text-[8px] text-[var(--color-text-muted)]">
                      تومان
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5">
                  <span className="block text-[9px] text-[var(--color-text-muted)]">
                    حداکثر قیمت
                  </span>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {formatPrice(value.price[1])}
                    </span>

                    <span className="text-[8px] text-[var(--color-text-muted)]">
                      تومان
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative mt-2 h-6 select-none">
                <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-[var(--color-border)]" />

                <div
                  className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--color-primary)]"
                  style={{
                    right: `${
                      ((value.price[0] - priceRange[0]) /
                        (priceRange[1] - priceRange[0] || 1)) *
                      100
                    }%`,
                    left: `${
                      100 -
                      ((value.price[1] - priceRange[0]) /
                        (priceRange[1] - priceRange[0] || 1)) *
                        100
                    }%`,
                  }}
                />

                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={value.price[0]}
                  onChange={(event) =>
                    updateMinPrice(Number(event.target.value))
                  }
                  aria-label="حداقل قیمت"
                  className="price-range-thumb absolute inset-0 z-20 h-6 w-full cursor-pointer appearance-none bg-transparent"
                />

                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={value.price[1]}
                  onChange={(event) =>
                    updateMaxPrice(Number(event.target.value))
                  }
                  aria-label="حداکثر قیمت"
                  className="price-range-thumb absolute inset-0 z-20 h-6 w-full cursor-pointer appearance-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {configs.map((config) => {
          const isCollapsed = collapsed[config.id] ?? true;

          const selectedCount = value.values[config.id]?.length ?? 0;

          return (
            <section
              key={config.id}
              className="border-b border-[var(--color-border)] p-4 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleGroup(config.id)}
                className="group flex w-full cursor-pointer items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
                    {config.label}
                  </span>

                  {selectedCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[9px] font-bold text-white">
                      {selectedCount.toLocaleString('fa-IR')}
                    </span>
                  )}
                </span>

                <span className="text-[var(--color-text-muted)] transition-transform duration-200">
                  {isCollapsed ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronUp size={16} />
                  )}
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  isCollapsed
                    ? 'mt-0 grid-rows-[0fr] opacity-0'
                    : 'mt-3 grid-rows-[1fr] opacity-100'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  {config.type === 'color'
                    ? renderColors()
                    : config.type === 'rating'
                      ? renderRating(config)
                      : renderCheckbox(config)}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
