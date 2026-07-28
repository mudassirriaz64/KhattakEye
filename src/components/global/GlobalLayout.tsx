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

export function GlobalLayout({ children }: PropsWithChildren) {
  return (
    <>
      <ScrollProgress />
      <AnnouncementBar />
      <Navbar />
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
