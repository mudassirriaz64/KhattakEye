import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalLayout } from "@/components/global/GlobalLayout";
import { ButtonsPage } from "@/pages/ButtonsPage";
import { CardsPage } from "@/pages/CardsPage";
import { ColorsPage } from "@/pages/ColorsPage";
import { FormsPage } from "@/pages/FormsPage";
import { GovernancePage } from "@/pages/GovernancePage";
import { LayoutPage } from "@/pages/LayoutPage";
import { MotionPage } from "@/pages/MotionPage";
import { NavigationPage } from "@/pages/NavigationPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { TypographyPage } from "@/pages/TypographyPage";
import { LandingPage } from "@/pages/LandingPage";
import { ShopPage } from "@/pages/ShopPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { VirtualTryOnPage } from "@/pages/VirtualTryOnPage";
import { WishlistPage } from "@/pages/WishlistPage";
import { ComparePage } from "@/pages/ComparePage";
import { RecentlyViewedPage } from "@/pages/RecentlyViewedPage";

export function DesignSystemRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/foundations/colors" element={<ColorsPage />} />
        <Route path="/foundations/typography" element={<TypographyPage />} />
        <Route path="/foundations/layout" element={<LayoutPage />} />
        <Route path="/components/buttons" element={<ButtonsPage />} />
        <Route path="/components/forms" element={<FormsPage />} />
        <Route path="/components/cards" element={<CardsPage />} />
        <Route path="/components/navigation" element={<NavigationPage />} />
        <Route path="/motion" element={<MotionPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GlobalLayout>
              <LandingPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <GlobalLayout>
              <ShopPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/shop/:category"
          element={
            <GlobalLayout>
              <CategoryPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/search"
          element={
            <GlobalLayout>
              <SearchResultsPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <GlobalLayout>
              <ProductDetailsPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/virtual-try-on"
          element={
            <GlobalLayout>
              <VirtualTryOnPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <GlobalLayout>
              <WishlistPage />
            </GlobalLayout>
          }
        />
        <Route
          path="/compare"
          element={
            <GlobalLayout>
              <ComparePage />
            </GlobalLayout>
          }
        />
        <Route
          path="/recently-viewed"
          element={
            <GlobalLayout>
              <RecentlyViewedPage />
            </GlobalLayout>
          }
        />
        <Route path="/design-system/*" element={<DesignSystemRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
