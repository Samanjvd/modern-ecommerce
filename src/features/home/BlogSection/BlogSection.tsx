import { CalendarDays } from 'lucide-react';
import { useRef } from 'react';

import { blogPosts } from '@/data/BlogPosts';
import { Button } from '@/components/ui/Button';

export function BlogSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;

    const slider = sliderRef.current;

    if (!slider) return;

    isDragging.current = true;
    startX.current = event.clientX;
    startScrollLeft.current = slider.scrollLeft;

    slider.setPointerCapture(event.pointerId);
    slider.style.cursor = 'grabbing';
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const slider = sliderRef.current;

    if (!slider) return;

    const distance = event.clientX - startX.current;

    slider.scrollLeft = startScrollLeft.current - distance;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    isDragging.current = false;

    const slider = sliderRef.current;

    if (!slider) return;

    slider.releasePointerCapture(event.pointerId);
    slider.style.cursor = 'grab';
  };

  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)] md:text-xl">
            بلاگ فروشگاه
          </h2>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            جدیدترین مطالب و اخبار دنیای تکنولوژی
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-[var(--color-primary)]"
        >
          نمایش همه
        </Button>
      </div>

      <div
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex w-full cursor-grab touch-pan-x scrollbar-none gap-4 overflow-x-auto pb-3 select-none"
      >
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group relative h-80 w-[85%] min-w-[85%] shrink-0 overflow-hidden rounded-[var(--radius-xl)] sm:w-[55%] sm:min-w-[55%] md:w-[40%] md:min-w-[40%] lg:w-[31%] lg:min-w-[31%] xl:w-[25%] xl:min-w-[25%]"
          >
            <img
              src={post.image}
              alt={post.title}
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/45" />

            <div className="relative flex h-full flex-col justify-between p-5 text-white">
              <div>
                <h3 className="line-clamp-3 text-base leading-7 font-bold md:text-lg">
                  {post.title}
                </h3>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-white/80">
                  <CalendarDays size={14} />
                  <span>{post.date}</span>
                </div>
              </div>

              <div className="translate-y-4 rounded-[var(--radius-lg)] bg-black/50 p-4 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="line-clamp-3 text-xs leading-6 text-white/90">
                  {post.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
