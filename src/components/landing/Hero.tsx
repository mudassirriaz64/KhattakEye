import { HeroCarousel } from "./HeroCarousel";
import { BrandMarquee } from "./BrandMarquee";
import { QuickCategories } from "./QuickCategories";
import { TrustStrip } from "./TrustStrip";

export function Hero() {
  return (
    <>
      <HeroCarousel />
      <BrandMarquee />
      <QuickCategories />
      <TrustStrip />
    </>
  );
}
