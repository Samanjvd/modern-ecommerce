import { ChevronLeft, ChevronRight, Percent } from 'lucide-react';
import { useRef } from 'react';

import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export function DiscountSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const discountedProducts = products
    .filter((product) => product.discountPrice)
    .slice(0, 12);

  const scroll = (direction: 'next' | 'prev') => {
    if (!sliderRef.current) return;

    const amount = sliderRef.current.clientWidth * 0.8;

    sliderRef.current.scrollBy({
      left: direction === 'next' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-4 my-6 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-primary)] px-4 py-5 md:mx-16 md:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Percent size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold md:text-xl">تخفیف‌های ویژه</h2>

            <p className="mt-0.5 text-xs text-white/70">فرصت‌های ویژه زنبیلک</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => scroll('prev')}
            aria-label="تخفیف‌های قبلی"
            className="h-9 w-9 rounded-full bg-white text-[var(--color-primary)] hover:bg-white/90"
          >
            <ChevronRight size={18} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => scroll('next')}
            aria-label="تخفیف‌های بعدی"
            className="h-9 w-9 rounded-full bg-white text-[var(--color-primary)] hover:bg-white/90"
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex [scrollbar-width:none] gap-3 overflow-x-auto scroll-smooth pb-1 [&::-webkit-scrollbar]:hidden"
      >
        {discountedProducts.map((product) => (
          <div
            key={product.id}
            className="w-[75%] shrink-0 sm:w-[42%] md:w-[31%] lg:w-[23%] xl:w-[19%]"
          >
            <ProductCard
              product={product}
              onAddToCart={(product) => {
                console.log('Add to cart:', product);
              }}
              onFavorite={(product) => {
                console.log('Favorite:', product);
              }}
              onProductClick={(product) => {
                console.log('Open product:', product);
              }}
            />
          </div>
        ))}

        <div className="flex w-[75%] shrink-0 items-center justify-center sm:w-[42%] md:w-[31%] lg:w-[23%] xl:w-[19%]">
          <Button
            type="button"
            variant="ghost"
            className="h-12 gap-2 bg-white px-6 text-[var(--color-primary)] hover:bg-white/90"
          >
            مشاهده همه
            <ChevronLeft size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
