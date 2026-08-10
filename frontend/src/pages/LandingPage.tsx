import { useEffect, useState } from "react";
import { EditorialHero } from "@/components/landing/EditorialHero";
import { FeaturedCollections } from "@/components/landing/FeaturedCollections";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { FaceShapeGuide } from "@/components/landing/FaceShapeGuide";
import { GenderCollections } from "@/components/landing/GenderCollections";
import { TryOnPromo } from "@/components/landing/TryOnPromo";
import { PremiumBrands } from "@/components/landing/PremiumBrands";
import { TestimonialWall } from "@/components/landing/TestimonialWall";
import { NewsletterSection } from "@/components/landing/NewsletterSection";
import axios from "@/lib/api/axios";

type SectionConfig = {
  id: string;
  section: string;
  visible: boolean;
  order: number;
};

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  "hero-slider": EditorialHero,
  "featured-categories": FeaturedCollections,
  "tabbed-catalog": FeaturedProducts,
  "face-shape-guide": FaceShapeGuide,
  "gender-collections": GenderCollections,
  "tryon-promo": TryOnPromo,
  "premium-brands": PremiumBrands,
  "testimonials": TestimonialWall,
  "newsletter": NewsletterSection,
};

export function LandingPage() {
  const [sections, setSections] = useState<SectionConfig[]>([
    { id: "sec-1", section: "hero-slider", visible: true, order: 1 },
    { id: "sec-2", section: "featured-categories", visible: true, order: 2 },
    { id: "sec-3", section: "tabbed-catalog", visible: true, order: 3 },
    { id: "sec-4", section: "face-shape-guide", visible: true, order: 4 },
    { id: "sec-5", section: "gender-collections", visible: true, order: 5 },
    { id: "sec-6", section: "tryon-promo", visible: true, order: 6 },
    { id: "sec-7", section: "premium-brands", visible: true, order: 7 },
    { id: "sec-8", section: "testimonials", visible: true, order: 8 },
    { id: "sec-9", section: "newsletter", visible: true, order: 9 },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get("/settings")
      .then((res) => {
        if (res.data && Array.isArray(res.data.homepageSections) && res.data.homepageSections.length > 0) {
          setSections(res.data.homepageSections);
        }
      })
      .catch(() => {});
  }, []);

  const activeSections = [...sections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <main>
      {activeSections.map((s) => {
        const Component = SECTION_COMPONENTS[s.section];
        if (!Component) return null;
        return <Component key={s.id || s.section} />;
      })}
    </main>
  );
}
