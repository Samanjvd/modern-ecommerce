import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

import { products } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export function FeaturedProducts() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const featuredProducts = products.slice(0, 12);

  const scroll = (direction: 'next' | 'prev') => {
    if (!sliderRef.current) return;

    const amount = sliderRef.current.clientWidth * 0.8;

    sliderRef.current.scrollBy({
      left: direction === 'next' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text)] md:text-xl">
          پیشنهادهای ویژه
        </h2>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scroll('prev')}
            aria-label="محصولات قبلی"
          >
            <ChevronRight size={18} />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scroll('next')}
            aria-label="محصولات بعدی"
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex [scrollbar-width:none] gap-3 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {featuredProducts.map((product) => (
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
          <Button type="button" variant="outline" className="h-12 gap-2 px-6">
            مشاهده همه
            <ChevronLeft size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
