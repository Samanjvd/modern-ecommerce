import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { heroSlides } from '@/data/heroSlide';
import { Button } from '@/components/ui/Button';

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = heroSlides[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full px-4 py-5">
      <div className="relative overflow-hidden rounded-[var(--radius-xl)]">
        <a
          href={`/products/${currentSlide.productId}`}
          className="block"
          aria-label={currentSlide.alt}
        >
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="aspect-[3/1] w-full object-cover"
          />
        </a>

        {/* Navigation */}
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            aria-label="اسلاید قبلی"
            className="size-12 rounded-[var(--radius-lg)] bg-white shadow-md hover:bg-white"
          >
            <ChevronRight size={22} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            aria-label="اسلاید بعدی"
            className="size-12 rounded-[var(--radius-lg)] bg-white shadow-md hover:bg-white"
          >
            <ChevronLeft size={22} />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute right-1/2 bottom-5 flex translate-x-1/2 items-center gap-1.5">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`اسلاید ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-[var(--color-primary)]'
                  : 'w-2 bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
