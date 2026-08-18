import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalLayout } from "@/components/global/GlobalLayout";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
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
import { SelectLensesPage } from "@/pages/SelectLensesPage";
import { BlueLightLensesPage } from "@/pages/BlueLightLensesPage";
import { ComputerGlassesPage } from "@/pages/ComputerGlassesPage";
import { AntiGlarePage } from "@/pages/AntiGlarePage";
import { PhotochromicPage } from "@/pages/PhotochromicPage";
import { VirtualTryOnPage } from "@/pages/VirtualTryOnPage";
import { WishlistPage } from "@/pages/WishlistPage";
import { ComparePage } from "@/pages/ComparePage";
import { RecentlyViewedPage } from "@/pages/RecentlyViewedPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrderDetailsPage } from "@/pages/OrderDetailsPage";
import { TrackOrderPage } from "@/pages/TrackOrderPage";
import { InvoicePage } from "@/pages/InvoicePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { EmailVerificationPage } from "@/pages/auth/EmailVerificationPage";
import { OTPVerificationPage } from "@/pages/auth/OTPVerificationPage";
import { GoogleCallbackPage } from "@/pages/auth/GoogleCallbackPage";
import { DashboardPage } from "@/pages/account/DashboardPage";
import { MyOrdersPage } from "@/pages/account/MyOrdersPage";
import { AccountOrderDetailsPage } from "@/pages/account/OrderDetailsPage";
import { AccountWishlistPage } from "@/pages/account/WishlistPage";
import { SavedAddressesPage } from "@/pages/account/SavedAddressesPage";
import { EditProfilePage } from "@/pages/account/EditProfilePage";
import { ChangePasswordPage } from "@/pages/account/ChangePasswordPage";
import { ReviewsPage } from "@/pages/account/ReviewsPage";
import { NotificationsPage } from "@/pages/account/NotificationsPage";
import { AccountSettingsPage } from "@/pages/account/AccountSettingsPage";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CMSPageContainer } from "@/pages/CMSPageContainer";
import { ShippingPolicyPage } from "@/pages/ShippingPolicyPage";
import { ReturnPolicyPage } from "@/pages/ReturnPolicyPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { EyeCareTipsPage } from "@/pages/EyeCareTipsPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminProductsPage } from "@/pages/admin/ProductsPage";
import { AdminAddGlassesPage } from "@/pages/admin/AdminAddGlassesPage";
import { AdminAddLensesPage } from "@/pages/admin/AdminAddLensesPage";
import { AdminCategoriesPage } from "@/pages/admin/CategoriesPage";
import { AdminLensesCategoriesPage } from "@/pages/admin/LensesCategoriesPage";
import AdminLensConfigurationPage from "@/pages/admin/LensConfigurationPage";
import { AdminBrandsPage } from "@/pages/admin/BrandsPage";
import { AdminOrdersListPage } from "@/pages/admin/OrdersListPage";
import { AdminOrderDetailsPage } from "@/pages/admin/OrderDetailsPage";
import { AdminPaymentVerificationPage } from "@/pages/admin/PaymentVerificationPage";
import { AdminCustomersListPage } from "@/pages/admin/CustomersListPage";
import { AdminCustomerDetailPage } from "@/pages/admin/CustomerDetailPage";
import { AdminReviewsManagePage } from "@/pages/admin/ReviewsManagePage";
import { AdminTestimonialsPage } from "@/pages/admin/TestimonialsPage";
import { AdminInventoryPage } from "@/pages/admin/InventoryPage";
import { AdminHomepageCMSPage } from "@/pages/admin/HomepageCMSPage";
import { HeroSlidesPage } from "@/pages/admin/HeroSlidesPage";
import { AdminBannerManagementPage } from "@/pages/admin/BannerManagementPage";
import { AdminPagesCMSPage } from "@/pages/admin/PagesCMSPage";
import { AdminCouponsPage } from "@/pages/admin/CouponsPage";
import { AdminPromotionsPage } from "@/pages/admin/PromotionsPage";
import { AdminNewsletterPage } from "@/pages/admin/NewsletterPage";
import { AdminMediaLibraryPage } from "@/pages/admin/MediaLibraryPage";
import { AdminWebsiteSettingsPage } from "@/pages/admin/WebsiteSettingsPage";
import { AdminReportsPage } from "@/pages/admin/ReportsPage";
import { AdminAnalyticsPage } from "@/pages/admin/AnalyticsPage";
import { AdminRolesPage } from "@/pages/admin/RolesPage";
import { AdminAdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminActivityLogsPage } from "@/pages/admin/ActivityLogsPage";
import { AdminSystemNotificationsPage } from "@/pages/admin/SystemNotificationsPage";
import { AdminSecurityPage } from "@/pages/admin/SecurityPage";
import { AdminAuditLogsPage } from "@/pages/admin/AuditLogsPage";
import { AdminBlogPage } from "@/pages/admin/AdminBlogPage";
import { AboutPage } from "@/pages/AboutPage";
import { StoryPage } from "@/pages/StoryPage";
import { CraftsmanshipPage } from "@/pages/CraftsmanshipPage";
import { CareersPage } from "@/pages/CareersPage";
import { PressPage } from "@/pages/PressPage";
import { ContactPage } from "@/pages/ContactPage";
import { FAQPage } from "@/pages/FAQPage";
import { SizeGuidePage } from "@/pages/SizeGuidePage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ErrorPage } from "@/pages/ErrorPage";
import { OfflinePage } from "@/pages/OfflinePage";
import { MaintenancePage } from "@/pages/MaintenancePage";

export function DesignSystemRoutes() {
  const location = useLocation();
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><OverviewPage /></PageTransition>} />
          <Route path="/foundations/colors" element={<PageTransition><ColorsPage /></PageTransition>} />
          <Route path="/foundations/typography" element={<PageTransition><TypographyPage /></PageTransition>} />
          <Route path="/foundations/layout" element={<PageTransition><LayoutPage /></PageTransition>} />
          <Route path="/components/buttons" element={<PageTransition><ButtonsPage /></PageTransition>} />
          <Route path="/components/forms" element={<PageTransition><FormsPage /></PageTransition>} />
          <Route path="/components/cards" element={<PageTransition><CardsPage /></PageTransition>} />
          <Route path="/components/navigation" element={<PageTransition><NavigationPage /></PageTransition>} />
          <Route path="/motion" element={<PageTransition><MotionPage /></PageTransition>} />
          <Route path="/governance" element={<PageTransition><GovernancePage /></PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Routes location={location}>
        <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AdminAddGlassesPage />} />
          <Route path="products/add-glasses" element={<AdminAddGlassesPage />} />
          <Route path="products/add-lenses" element={<AdminAddLensesPage />} />
          <Route path="products/:id/edit" element={<AdminAddGlassesPage />} />
          <Route path="products/:id/edit-glasses" element={<AdminAddGlassesPage />} />
          <Route path="products/:id/edit-lenses" element={<AdminAddLensesPage />} />
          <Route path="products/:id" element={<AdminAddGlassesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="categories/glasses" element={<AdminCategoriesPage />} />
          <Route path="categories/lenses" element={<AdminLensesCategoriesPage />} />
          <Route path="buy-lenses" element={<AdminLensConfigurationPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="orders" element={<AdminOrdersListPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="orders/:id/invoice" element={<InvoicePage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="payments" element={<AdminPaymentVerificationPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="customers" element={<AdminCustomersListPage />} />
          <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
          <Route path="reviews" element={<AdminReviewsManagePage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="cms" element={<AdminPagesCMSPage />} />
          <Route path="cms/faqs" element={<AdminPagesCMSPage />} />
          <Route path="cms/banners" element={<AdminBannerManagementPage />} />
          <Route path="cms/coupons" element={<AdminCouponsPage />} />
          <Route path="cms/blogs" element={<AdminBlogPage />} />
          <Route path="blogs" element={<AdminBlogPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="cms/promotions" element={<AdminPromotionsPage />} />
          <Route path="cms/newsletter" element={<AdminNewsletterPage />} />
          <Route path="cms/settings" element={<AdminWebsiteSettingsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="admin-users" element={<AdminAdminUsersPage />} />
          <Route path="activity-logs" element={<AdminActivityLogsPage />} />
          <Route path="notifications" element={<AdminSystemNotificationsPage />} />
          <Route path="security" element={<AdminSecurityPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><GlobalLayout><LandingPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop" element={<PageTransition><GlobalLayout><ShopPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/photochromic" element={<PageTransition><GlobalLayout><PhotochromicPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/transition" element={<PageTransition><GlobalLayout><PhotochromicPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/photochromic" element={<PageTransition><GlobalLayout><PhotochromicPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/anti-reflective" element={<PageTransition><GlobalLayout><AntiGlarePage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/anti-glare" element={<PageTransition><GlobalLayout><AntiGlarePage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/anti-glare" element={<PageTransition><GlobalLayout><AntiGlarePage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/computer" element={<PageTransition><GlobalLayout><ComputerGlassesPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/computer-lenses" element={<PageTransition><GlobalLayout><ComputerGlassesPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/computer-glasses" element={<PageTransition><GlobalLayout><ComputerGlassesPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/blue-light" element={<PageTransition><GlobalLayout><BlueLightLensesPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/lenses/blue-cut" element={<PageTransition><GlobalLayout><BlueLightLensesPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/blue-light" element={<PageTransition><GlobalLayout><BlueLightLensesPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/:category" element={<PageTransition><GlobalLayout><CategoryPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/:category/:subcategory" element={<PageTransition><GlobalLayout><CategoryPage /></GlobalLayout></PageTransition>} />
        <Route path="/search" element={<PageTransition><GlobalLayout><SearchResultsPage /></GlobalLayout></PageTransition>} />
        <Route path="/product/:slug" element={<PageTransition><GlobalLayout><ProductDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/product/:slug/select-lenses" element={<PageTransition><GlobalLayout><SelectLensesPage /></GlobalLayout></PageTransition>} />
        <Route path="/virtual-try-on" element={<PageTransition><GlobalLayout><VirtualTryOnPage /></GlobalLayout></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><GlobalLayout><WishlistPage /></GlobalLayout></PageTransition>} />
        <Route path="/compare" element={<PageTransition><GlobalLayout><ComparePage /></GlobalLayout></PageTransition>} />
        <Route path="/recently-viewed" element={<PageTransition><GlobalLayout><RecentlyViewedPage /></GlobalLayout></PageTransition>} />
        <Route path="/cart" element={<PageTransition><GlobalLayout><CartPage /></GlobalLayout></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><GlobalLayout><CheckoutPage /></GlobalLayout></PageTransition>} />
        <Route path="/order-details" element={<PageTransition><GlobalLayout><OrderDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/order-details/:id" element={<PageTransition><GlobalLayout><AccountOrderDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><GlobalLayout><TrackOrderPage /></GlobalLayout></PageTransition>} />
        <Route path="/invoice" element={<PageTransition><InvoicePage /></PageTransition>} />
        <Route path="/account" element={<PageTransition><GlobalLayout><DashboardPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/orders" element={<PageTransition><GlobalLayout><MyOrdersPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/orders/:id" element={<PageTransition><GlobalLayout><AccountOrderDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/order-details" element={<PageTransition><GlobalLayout><AccountOrderDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/order-details/:id" element={<PageTransition><GlobalLayout><AccountOrderDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/wishlist" element={<PageTransition><GlobalLayout><AccountWishlistPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/addresses" element={<PageTransition><GlobalLayout><SavedAddressesPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/reviews" element={<PageTransition><GlobalLayout><ReviewsPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/notifications" element={<PageTransition><GlobalLayout><NotificationsPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/settings" element={<PageTransition><GlobalLayout><AccountSettingsPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/edit-profile" element={<PageTransition><GlobalLayout><EditProfilePage /></GlobalLayout></PageTransition>} />
        <Route path="/account/change-password" element={<PageTransition><GlobalLayout><ChangePasswordPage /></GlobalLayout></PageTransition>} />
        <Route path="/auth/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/auth/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/auth/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/auth/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
        <Route path="/auth/email-verification" element={<PageTransition><EmailVerificationPage /></PageTransition>} />
        <Route path="/auth/otp-verification" element={<PageTransition><OTPVerificationPage /></PageTransition>} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/design-system/*" element={<DesignSystemRoutes />} />
        <Route path="/404" element={<PageTransition><NotFoundPage /></PageTransition>} />
        <Route path="/500" element={<PageTransition><ErrorPage /></PageTransition>} />
        <Route path="/offline" element={<PageTransition><OfflinePage /></PageTransition>} />
        <Route path="/maintenance" element={<PageTransition><MaintenancePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><GlobalLayout><AboutPage /></GlobalLayout></PageTransition>} />
        <Route path="/story" element={<PageTransition><GlobalLayout><StoryPage /></GlobalLayout></PageTransition>} />
        <Route path="/craftsmanship" element={<PageTransition><GlobalLayout><CraftsmanshipPage /></GlobalLayout></PageTransition>} />
        <Route path="/careers" element={<PageTransition><GlobalLayout><CareersPage /></GlobalLayout></PageTransition>} />
        <Route path="/press" element={<PageTransition><GlobalLayout><PressPage /></GlobalLayout></PageTransition>} />
        <Route path="/contact" element={<PageTransition><GlobalLayout><ContactPage /></GlobalLayout></PageTransition>} />
        <Route path="/faq" element={<PageTransition><GlobalLayout><FAQPage /></GlobalLayout></PageTransition>} />
        <Route path="/faqs" element={<PageTransition><GlobalLayout><FAQPage /></GlobalLayout></PageTransition>} />
        <Route path="/size-guide" element={<PageTransition><GlobalLayout><SizeGuidePage /></GlobalLayout></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><GlobalLayout><PrivacyPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/privacy/*" element={<PageTransition><GlobalLayout><PrivacyPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><GlobalLayout><PrivacyPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/privacy-policy/*" element={<PageTransition><GlobalLayout><PrivacyPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/terms" element={<PageTransition><GlobalLayout><TermsOfServicePage /></GlobalLayout></PageTransition>} />
        <Route path="/terms/*" element={<PageTransition><GlobalLayout><TermsOfServicePage /></GlobalLayout></PageTransition>} />
        <Route path="/terms-of-service" element={<PageTransition><GlobalLayout><TermsOfServicePage /></GlobalLayout></PageTransition>} />
        <Route path="/terms-of-service/*" element={<PageTransition><GlobalLayout><TermsOfServicePage /></GlobalLayout></PageTransition>} />
        <Route path="/terms-and-conditions" element={<PageTransition><GlobalLayout><TermsOfServicePage /></GlobalLayout></PageTransition>} />
        <Route path="/terms-and-conditions/*" element={<PageTransition><GlobalLayout><TermsOfServicePage /></GlobalLayout></PageTransition>} />
        <Route path="/eye-care-tips" element={<PageTransition><GlobalLayout><EyeCareTipsPage /></GlobalLayout></PageTransition>} />
        <Route path="/eye-care-tips/*" element={<PageTransition><GlobalLayout><EyeCareTipsPage /></GlobalLayout></PageTransition>} />
        <Route path="/eye-care" element={<PageTransition><GlobalLayout><EyeCareTipsPage /></GlobalLayout></PageTransition>} />
        <Route path="/eye-care/*" element={<PageTransition><GlobalLayout><EyeCareTipsPage /></GlobalLayout></PageTransition>} />
        <Route path="/blog" element={<PageTransition><GlobalLayout><BlogPage /></GlobalLayout></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><GlobalLayout><BlogPostPage /></GlobalLayout></PageTransition>} />
        <Route path="/shipping-policy" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/shipping-policy/*" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/shipping" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/shipping/*" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/shipping-info" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/shipping-info/*" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/cms/shipping-policy" element={<PageTransition><GlobalLayout><ShippingPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/return-policy" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/return-policy/*" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/returns" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/returns/*" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/refund-policy" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/refund-policy/*" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/return" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/return/*" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/cms/return-policy" element={<PageTransition><GlobalLayout><ReturnPolicyPage /></GlobalLayout></PageTransition>} />
        <Route path="/page/:slug" element={<PageTransition><GlobalLayout><CMSPageContainer /></GlobalLayout></PageTransition>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useAdminStore } from "@/lib/stores/admin-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useCartStore } from "@/lib/stores/cart-store";

export default function App() {
  const checkCustomerAuth = useAuthStore((s) => s.checkAuth);
  const checkAdminAuth = useAdminStore((s) => s.checkAuth);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const fetchPromotions = useCartStore((s) => s.fetchPromotions);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    checkCustomerAuth();
    checkAdminAuth();
    fetchPromotions();
  }, [checkCustomerAuth, checkAdminAuth, fetchPromotions]);

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated, fetchWishlist]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
