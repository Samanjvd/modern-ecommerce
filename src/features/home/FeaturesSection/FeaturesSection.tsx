import { Headphones, PackageCheck, ShieldCheck, Truck } from 'lucide-react';

import { features } from '@/data/Features';

const featureIcons = [PackageCheck, Truck, Headphones, ShieldCheck];

export function FeaturesSection() {
  return (
    <section className="w-full px-4 py-8 md:px-16">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {features.map((feature, index) => {
          const Icon = featureIcons[index];

          return (
            <div
              key={feature.id}
              className="flex flex-col items-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-sm)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Icon size={23} />
              </div>

              <h3 className="text-sm font-bold text-[var(--color-text)] md:text-base">
                {feature.title}
              </h3>

              <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
