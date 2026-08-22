import { Header } from '@/components/layout/Header';
import { CategorySection } from '@/features/home/CategorySection';
import { DiscountSection } from '@/features/home/DiscountSection';
import { FeaturedProducts } from '@/features/home/FeaturedProducts';
import { HeroSlider } from '@/features/home/HeroSlider';
import { PopularProducts } from '@/features/home/PopularProducts';
import { PromoBanner } from '@/features/home/PromoBanner';

export function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSlider />
        <CategorySection />
        <FeaturedProducts />
        <DiscountSection />
        <PromoBanner />
        <PopularProducts />
        {/* <FeaturesSection /> */}
      </main>

      {/* <Footer /> */}
    </>
  );
}
