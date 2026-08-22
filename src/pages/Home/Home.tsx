import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BlogSection } from '@/features/home/BlogSection';
import { CategorySection } from '@/features/home/CategorySection';
import { DiscountSection } from '@/features/home/DiscountSection';
import { FeaturedProducts } from '@/features/home/FeaturedProducts';
import { FeaturesSection } from '@/features/home/FeaturesSection';
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
        <FeaturesSection />
        <BlogSection />
      </main>

      <Footer />
    </>
  );
}
