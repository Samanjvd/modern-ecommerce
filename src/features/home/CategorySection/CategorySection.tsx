import { ChevronLeft } from 'lucide-react';

import { categories } from '@/data/categories';

export function CategorySection() {
  return (
    <section className="w-full px-4 py-6 md:px-16">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text)] md:text-xl">
          دسته‌بندی‌ها
        </h2>

        <a
          href="/categories"
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]"
        >
          مشاهده همه
          <ChevronLeft size={16} />
        </a>
      </div>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.href}
            className="group flex flex-col items-center gap-3"
          >
            <div className="aspect-square w-full max-w-28 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--color-primary)] group-hover:shadow-[var(--shadow-md)]">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <span className="text-center text-xs font-medium text-[var(--color-text)] md:text-sm">
              {category.title}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
