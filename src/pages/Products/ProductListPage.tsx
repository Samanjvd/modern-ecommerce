import { ChevronLeft, ChevronRight, Filter, ListFilter, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { products } from '@/data/products';
import type { Product } from '@/types/Product';
import { type FilterState } from '@/data/productFilterConfigs';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/Button';

type SortValue =
  'relevant' | 'newest' | 'popular' | 'cheapest' | 'expensive' | 'discount';

const PRODUCTS_PER_PAGE = 12;
const MAX_PAGES = 2;

const getInitialPrice = (items: Product[]) => {
  const prices = items.map((product) => product.discountPrice ?? product.price);

  return [Math.min(...prices), Math.max(...prices)] as [number, number];
};

const getProductValue = (product: Product, key: string): unknown => {
  const keys = key.split('.');

  let value: unknown = product;

  for (const currentKey of keys) {
    if (value === null || typeof value !== 'object') {
      return undefined;
    }

    value = (value as Record<string, unknown>)[currentKey];
  }

  return value;
};

export function ProductListPage() {
  const initialPrice = useMemo(() => getInitialPrice(products), []);

  const [filters, setFilters] = useState<FilterState>({
    category: undefined,
    values: {},
    price: initialPrice,
  });

  const [sort, setSort] = useState<SortValue>('relevant');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const productPrice = product.discountPrice ?? product.price;

      if (filters.category) {
        if (product.category !== filters.category) {
          return false;
        }
      }

      if (productPrice < filters.price[0] || productPrice > filters.price[1]) {
        return false;
      }

      for (const [filterId, selectedValues] of Object.entries(filters.values)) {
        if (!selectedValues.length) continue;

        if (filterId === 'colors') {
          const hasSelectedColor = selectedValues.some((selectedColor) =>
            product.colors.some(
              (productColor) => productColor.name === selectedColor,
            ),
          );

          if (!hasSelectedColor) {
            return false;
          }

          continue;
        }

        if (filterId === 'rating') {
          const minRating = Math.max(...selectedValues.map(Number));

          if (product.rating < minRating) {
            return false;
          }

          continue;
        }

        if (filterId === 'availability') {
          if (selectedValues.includes('available') && product.stock <= 0) {
            return false;
          }

          continue;
        }

        const productValue = getProductValue(product, filterId);

        if (!selectedValues.includes(String(productValue))) {
          return false;
        }
      }

      return true;
    });

    switch (sort) {
      case 'newest':
        return result.sort((a, b) => Number(b.isNew) - Number(a.isNew));

      case 'popular':
        return result.sort(
          (a, b) =>
            Number(b.isPopular) - Number(a.isPopular) || b.rating - a.rating,
        );

      case 'cheapest':
        return result.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price),
        );

      case 'expensive':
        return result.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price),
        );

      case 'discount':
        return result.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));

      default:
        return result.sort((a, b) => b.rating - a.rating);
    }
  }, [filters, sort]);

  const totalPages = Math.min(
    MAX_PAGES,
    Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)),
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    if (page > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const categoryLabels: Record<string, string> = {
    mobile: 'موبایل',
    laptop: 'لپ‌تاپ و کامپیوتر',
    headphone: 'هدفون و هندزفری',
    smartwatch: 'ساعت هوشمند',
    camera: 'دوربین',
    accessories: 'لوازم جانبی',
    gaming: 'گیمینگ',
    home: 'خانه',
  };

  const activeFilters = useMemo(() => {
    const categoryFilter = filters.category
      ? [
          {
            id: 'category',
            value: filters.category,
            label: categoryLabels[filters.category],
          },
        ]
      : [];

    const valueFilters = Object.entries(filters.values).flatMap(
      ([filterId, values]) =>
        values.map((value) => ({
          id: filterId,
          value,
          label:
            filterId === 'rating'
              ? `${value} به بالا`
              : filterId === 'availability'
                ? 'فقط کالاهای موجود'
                : value,
        })),
    );

    return [...categoryFilter, ...valueFilters];
  }, [filters.category, filters.values]);

  const removeActiveFilter = (filterId: string, filterValue: string) => {
    if (filterId === 'category') {
      setFilters((current) => ({
        ...current,
        category: undefined,
      }));

      return;
    }

    setFilters((current) => ({
      ...current,
      values: {
        ...current.values,
        [filterId]: (current.values[filterId] ?? []).filter(
          (item) => item !== filterValue,
        ),
      },
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: undefined,
      values: {},
      price: initialPrice,
    });
  };

  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div className="mb-6">
        <span className="text-xs text-[var(--color-text-muted)]">
          خانه / فروشگاه
        </span>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              فروشگاه
            </h1>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              محصولات مورد نیازت را پیدا کن
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)] md:hidden"
          >
            <Filter size={16} />
            فیلترها
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_minmax(0,1fr)]">
        <div className="hidden min-h-0 md:block">
          <div className="sticky top-20 h-fit max-h-[100vh-2rem]">
            <ProductFilters
              products={products}
              value={filters}
              onChange={setFilters}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-sm)] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <ListFilter size={17} />
              </div>

              <div>
                <p className="text-sm font-bold text-[var(--color-text)]">
                  {filteredProducts.length.toLocaleString('fa-IR')} کالا
                </p>

                <p className="text-[10px] text-[var(--color-text-muted)]">
                  نمایش {visibleProducts.length.toLocaleString('fa-IR')} محصول
                  در این صفحه
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-[var(--color-text-muted)] sm:block">
                مرتب‌سازی:
              </span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortValue)}
                className="h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-xs text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)]"
              >
                <option value="relevant">مرتبط‌ترین</option>
                <option value="newest">جدیدترین</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="cheapest">ارزان‌ترین</option>
                <option value="expensive">گران‌ترین</option>
                <option value="discount">بیشترین تخفیف</option>
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="ml-1 text-xs font-medium text-[var(--color-text-muted)]">
                فیلترهای فعال:
              </span>

              {activeFilters.map((filter) => (
                <button
                  key={`${filter.id}-${filter.value}`}
                  type="button"
                  onClick={() => removeActiveFilter(filter.id, filter.value)}
                  className="group flex items-center gap-1.5 rounded-full bg-[var(--color-primary-light)] px-3 py-1.5 text-xs text-[var(--color-primary)] transition-all duration-200 hover:scale-105"
                >
                  {filter.label}

                  <X
                    size={13}
                    className="transition-transform group-hover:rotate-90"
                  />
                </button>
              ))}

              <button
                type="button"
                onClick={clearAllFilters}
                className="mr-auto text-xs text-[var(--color-error)] transition hover:opacity-70"
              >
                پاک کردن همه
              </button>
            </div>
          )}

          {visibleProducts.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="animate-[fadeIn_0.35s_ease-out]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex min-h-[400px] flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Filter size={24} />
              </div>

              <h2 className="text-base font-bold text-[var(--color-text)]">
                محصولی پیدا نشد
              </h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                فیلترها را کمی تغییر بده.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={clearAllFilters}
              >
                پاک کردن فیلترها
              </Button>
            </div>
          )}

          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                aria-label="صفحه قبل"
              >
                <ChevronRight size={17} />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-xs font-medium transition-all duration-200 ${
                      page === pageNumber
                        ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-sm)]'
                        : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {pageNumber.toLocaleString('fa-IR')}
                  </button>
                ),
              )}

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
                aria-label="صفحه بعد"
              >
                <ChevronLeft size={17} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="بستن فیلتر"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm animate-[slideIn_0.3s_ease-out] flex-col bg-[var(--color-background)] p-3 shadow-2xl">
            <ProductFilters
              products={products}
              value={filters}
              onChange={setFilters}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
