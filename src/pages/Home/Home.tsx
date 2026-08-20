import { Header } from '@/components/layout/Header';
import { CategorySection } from '@/features/home/components/CategorySection';
import { HeroSlider } from '@/features/home/components/HeroSlider';

export function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSlider />
        <CategorySection />
        {/* <FeaturedProducts /> */}
        {/* <DiscountSection /> */}
        {/* <PromoBanner /> */}
        {/* <PopularProducts /> */}
        {/* <FeaturesSection /> */}
      </main>

      {/* <Footer /> */}
    </>
  );
}
