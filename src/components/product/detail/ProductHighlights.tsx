import { Package, ShieldCheck, Star, Tag } from 'lucide-react';

import type { Product } from '@/types/Product';

type ProductHighlightsProps = {
  product: Product;
};

const categoryLabels: Record<string, string> = {
  mobile: 'موبایل',
  laptop: 'لپ‌تاپ',
  headphone: 'هدفون',
  smartwatch: 'ساعت هوشمند',
  camera: 'دوربین',
  gaming: 'گیمینگ',
  accessories: 'لوازم جانبی',
  home: 'خانه و آشپزخانه',
};

export function ProductHighlights({ product }: ProductHighlightsProps) {
  const highlights = [
    {
      icon: Tag,
      label: 'برند',
      value: product.brand,
    },
    {
      icon: ShieldCheck,
      label: 'دسته‌بندی',
      value: categoryLabels[product.category] ?? product.category,
    },
    {
      icon: Star,
      label: 'امتیاز کاربران',
      value: `${product.rating.toLocaleString('fa-IR')} از ۵`,
    },
    {
      icon: Package,
      label: 'وضعیت موجودی',
      value: product.stock > 0 ? 'موجود در انبار' : 'ناموجود',
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:border-[var(--color-primary)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  {item.label}
                </p>

                <p className="mt-1 truncate text-xs font-bold text-[var(--color-text)]">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
