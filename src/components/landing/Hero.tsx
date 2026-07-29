import { motion } from "framer-motion";
import { HeroCarousel } from "./HeroCarousel";
import { BrandMarquee } from "./BrandMarquee";
import { QuickCategories } from "./QuickCategories";
import { WhyShopWithUs } from "./WhyShopWithUs";
import { useReveal } from "@/components/loading/RevealContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

const revealVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: easeOut } },
};

export function Hero() {
  const { phase } = useReveal();

  return (
    <motion.div
      initial="hidden"
      animate={phase !== "loading" ? "visible" : "hidden"}
      variants={revealVariants}
    >
      <HeroCarousel />
      <BrandMarquee />
      <QuickCategories />
      <WhyShopWithUs />
    </motion.div>
  );
}
