import { useEffect } from "react";
import { EditorialHero } from "@/components/landing/EditorialHero";
import { FeaturedCollections } from "@/components/landing/FeaturedCollections";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { FaceShapeGuide } from "@/components/landing/FaceShapeGuide";
import { BestSellers } from "@/components/landing/BestSellers";
import { LifestyleBanner } from "@/components/landing/LifestyleBanner";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { GenderCollections } from "@/components/landing/GenderCollections";
import { TryOnPromo } from "@/components/landing/TryOnPromo";
import { BrandStory } from "@/components/landing/BrandStory";
import { PremiumBrands } from "@/components/landing/PremiumBrands";
import { CustomerGallery } from "@/components/landing/CustomerGallery";
import { TestimonialWall } from "@/components/landing/TestimonialWall";
import { NewsletterSection } from "@/components/landing/NewsletterSection";

export function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <EditorialHero />
      <FeaturedCollections />
      <FeaturedProducts />
      <FaceShapeGuide />
      <BestSellers />
      <LifestyleBanner />
      <NewArrivals />
      <GenderCollections />
      <TryOnPromo />
      <BrandStory />
      <PremiumBrands />
      <CustomerGallery />
      <TestimonialWall />
      <NewsletterSection />
    </main>
  );
}
