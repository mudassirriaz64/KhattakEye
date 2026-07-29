import { useEffect } from "react";
import { Hero } from "@/components/landing/Hero";
import { ShopByCategory } from "@/components/landing/ShopByCategory";
import { FeaturedCollection } from "@/components/landing/FeaturedCollection";
import { VirtualTryOn } from "@/components/landing/VirtualTryOn";
import { FeaturedBrands } from "@/components/landing/FeaturedBrands";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { Testimonials } from "@/components/landing/Testimonials";

export function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Hero />
      <ShopByCategory />
      <FeaturedCollection />
      <VirtualTryOn />
      <FeaturedBrands />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
