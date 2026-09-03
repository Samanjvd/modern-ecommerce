import { useState } from 'react';

type ProductGalleryProps = {
  image: string;
  title: string;
};

export function ProductGallery({ image, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(image);

  const images = [image];

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
        {images.map((item, index) => {
          const isActive = selectedImage === item;

          return (
            <button
              key={`${item}-${index}`}
              type="button"
              onClick={() => setSelectedImage(item)}
              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-surface)] p-1 transition-all duration-200 ${
                isActive
                  ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
              aria-label={`تصویر ${index + 1} محصول`}
            >
              <img
                src={item}
                alt={`${title} - تصویر ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          );
        })}
      </div>

      <div className="order-1 flex min-h-[350px] flex-1 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:order-2 md:min-h-[500px]">
        <img
          src={selectedImage}
          alt={title}
          className="h-full max-h-[500px] w-full object-contain transition-opacity duration-200"
        />
      </div>
    </div>
  );
}
