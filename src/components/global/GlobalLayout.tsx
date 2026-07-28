import type { PropsWithChildren } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { SearchOverlay } from "./SearchOverlay";
import { WishlistDrawer } from "./WishlistDrawer";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { WhatsAppButton } from "./WhatsAppButton";
import { ScrollProgress } from "./ScrollProgress";
import { CookieConsent } from "./CookieConsent";
import { useUiStore } from "@/lib/stores/ui-store";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function GlobalLayout({ children }: PropsWithChildren) {
  useTheme();
  const announcementDismissed = useUiStore((s) => s.announcementDismissed);

  return (
    <>
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
      <div className={cn(announcementDismissed ? "h-16" : "h-[104px]")} />
      <SearchOverlay />
      <WishlistDrawer />
      <CartDrawer />
      {children}
      <Footer />
      <BackToTop />
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
