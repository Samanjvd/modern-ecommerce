import { ChevronLeft } from 'lucide-react';

type ProductBreadcrumbProps = {
  category: string;
  title: string;
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

export function ProductBreadcrumb({ category, title }: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="مسیر صفحه"
      className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)] md:text-sm"
    >
      <span>خانه</span>

      <ChevronLeft size={14} className="shrink-0" />

      <span>فروشگاه</span>

      <ChevronLeft size={14} className="shrink-0" />

      <span>{categoryLabels[category] ?? category}</span>

      <ChevronLeft size={14} className="shrink-0" />

      <span className="max-w-[220px] truncate font-medium text-[var(--color-text)]">
        {title}
      </span>
    </nav>
  );
}
