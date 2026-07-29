import { HeroCarousel } from "./HeroCarousel";
import { BrandMarquee } from "./BrandMarquee";
import { QuickCategories } from "./QuickCategories";
import { WhyShopWithUs } from "./WhyShopWithUs";

export function Hero() {
  return (
    <>
      <HeroCarousel />
      <BrandMarquee />
      <QuickCategories />
      <WhyShopWithUs />
    </>
  );
}
