import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export function PromoBanner() {
  return (
    <section className="w-full px-4 py-6 md:px-16">
      <div className="relative min-h-44 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-primary-light)] px-6 py-8 md:min-h-52 md:px-12">
        <div className="relative z-10 flex h-full flex-col items-start justify-center gap-4">
          <div>
            <span className="text-sm font-medium text-[var(--color-primary)]">
              پیشنهاد ویژه زنبیلک
            </span>

            <h2 className="mt-2 text-xl font-bold text-[var(--color-text)] md:text-2xl">
              تکنولوژی جدید را با بهترین قیمت تجربه کن
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              جدیدترین محصولات دیجیتال با تخفیف ویژه
            </p>
          </div>

          <Button type="button" size="sm" className="gap-2">
            مشاهده محصولات
            <ArrowLeft size={16} />
          </Button>
        </div>

        <div className="absolute -top-20 -left-10 h-56 w-56 rounded-full bg-white/40" />

        <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-[var(--color-primary)]/10" />
      </div>
    </section>
  );
}
