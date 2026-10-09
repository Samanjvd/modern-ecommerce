import { useState } from 'react';

import type {
  Product,
  ProductSpecifications as ProductSpecificationData,
} from '@/types/Product';
import { ProductReviewForm } from './ProductReviewForm';
import { Star } from 'lucide-react';

type ProductSpecificationsProps = {
  product: Product;
};

type ProductReview = {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
};

const reviews: ProductReview[] = [
  {
    id: 1,
    userName: 'علی رضایی',
    rating: 5,
    date: '۲ روز پیش',
    comment:
      'کیفیت محصول خیلی خوب بود و دقیقاً مطابق توضیحات به دستم رسید. بسته‌بندی هم مناسب بود.',
  },
  {
    id: 2,
    userName: 'مریم احمدی',
    rating: 4,
    date: '۵ روز پیش',
    comment: 'از خرید راضی هستم. عملکرد محصول خوبه و ارسال هم سریع انجام شد.',
  },
];

type SpecificationTab = 'description' | 'technical' | 'reviews';

const specificationLabels: Record<keyof ProductSpecificationData, string> = {
  ram: 'حافظه RAM',
  storage: 'حافظه داخلی',
  cpu: 'پردازنده',
  gpu: 'پردازنده گرافیکی',
  screenSize: 'اندازه صفحه‌نمایش',
  resolution: 'رزولوشن',
  battery: 'ظرفیت باتری',
  operatingSystem: 'سیستم‌عامل',
  connectionType: 'نوع اتصال',
  bluetooth: 'بلوتوث',
  noiseCancellation: 'حذف نویز',
  microphone: 'میکروفون',
  refreshRate: 'نرخ نوسازی',
  panelType: 'نوع پنل',
  hdr: 'HDR',
  camera: 'دوربین',
  usageType: 'نوع کاربری',
};

const formatSpecificationValue = (
  key: keyof ProductSpecificationData,
  value: ProductSpecificationData[keyof ProductSpecificationData],
) => {
  if (typeof value === 'boolean') {
    return value ? 'دارد' : 'ندارد';
  }

  if (key === 'screenSize') {
    return `${value} اینچ`;
  }

  if (key === 'battery') {
    return `${value} میلی‌آمپر ساعت`;
  }

  if (key === 'refreshRate') {
    return `${value} هرتز`;
  }

  return String(value);
};

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const [activeTab, setActiveTab] = useState<SpecificationTab>('description');

  const tabs: {
    id: SpecificationTab;
    label: string;
  }[] = [
    {
      id: 'description',
      label: 'درباره محصول',
    },
    {
      id: 'technical',
      label: 'مشخصات فنی',
    },
    {
      id: 'reviews',
      label: 'دیدگاه کاربران',
    },
  ];

  const specifications = product.specifications
    ? Object.entries(product.specifications).filter(
        ([, value]) => value !== undefined && value !== null,
      )
    : [];

  return (
    <section className="mt-10 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="overflow-x-auto border-b border-[var(--color-border)]">
        <div className="flex min-w-max px-4 md:px-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-4 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {tab.label}

                {tab.id === 'reviews' && (
                  <span className="mr-1 text-[11px]">
                    ({product.reviewCount.toLocaleString('fa-IR')})
                  </span>
                )}

                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 md:p-7">
        {activeTab === 'description' && (
          <DescriptionContent product={product} />
        )}

        {activeTab === 'technical' && (
          <TechnicalSpecifications specifications={specifications} />
        )}

        {activeTab === 'reviews' && <ReviewsContent product={product} />}
      </div>
    </section>
  );
}

function DescriptionContent({ product }: { product: Product }) {
  if (!product.description) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          توضیحاتی برای این محصول ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-base font-bold text-[var(--color-text)]">
        درباره {product.title}
      </h2>

      <p className="mt-4 text-sm leading-8 whitespace-pre-line text-[var(--color-text-muted)]">
        {product.description}
      </p>
    </div>
  );
}

function TechnicalSpecifications({
  specifications,
}: {
  specifications: [string, unknown][];
}) {
  if (!specifications.length) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          مشخصات فنی برای این محصول ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-bold text-[var(--color-text)]">
        مشخصات فنی
      </h2>

      <div className="mt-5 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        {specifications.map(([key, value], index) => {
          const specificationKey = key as keyof ProductSpecificationData;

          return (
            <div
              key={key}
              className={`grid grid-cols-1 gap-2 px-4 py-3 text-sm sm:grid-cols-[220px_1fr] sm:gap-6 ${
                index !== specifications.length - 1
                  ? 'border-b border-[var(--color-border)]'
                  : ''
              }`}
            >
              <span className="font-medium text-[var(--color-text-muted)]">
                {specificationLabels[specificationKey] ?? key}
              </span>

              <span className="text-[var(--color-text)]">
                {formatSpecificationValue(
                  specificationKey,
                  value as ProductSpecificationData[typeof specificationKey],
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewsContent({ product }: { product: Product }) {
  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <p className="text-3xl font-bold text-[var(--color-text)]">
            {product.rating.toLocaleString('fa-IR')}
          </p>

          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={16}
                className={
                  index < Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[var(--color-border)]'
                }
              />
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-[var(--color-border)] sm:h-14 sm:w-auto sm:w-px" />

        <div>
          <p className="text-sm font-bold text-[var(--color-text)]">
            امتیاز کاربران
          </p>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            بر اساس {product.reviewCount.toLocaleString('fa-IR')} دیدگاه
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--color-text)]">
            آخرین دیدگاه‌ها
          </h3>

          <span className="text-xs text-[var(--color-text-muted)]">
            {reviews.length.toLocaleString('fa-IR')} دیدگاه نمایش داده می‌شود
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    {review.userName}
                  </p>

                  <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                    {review.date}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={14}
                      className={
                        index < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-[var(--color-border)]'
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)]">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      </div>

      <ProductReviewForm />
    </div>
  );
}
