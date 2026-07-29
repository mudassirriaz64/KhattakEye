import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GlobalLayout } from "@/components/global/GlobalLayout";
import { PageTransition } from "@/components/shared/PageTransition";
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
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminProductsPage } from "@/pages/admin/ProductsPage";
import { AddEditProductPage } from "@/pages/admin/AddEditProductPage";
import { AdminCategoriesPage } from "@/pages/admin/CategoriesPage";
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
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><GlobalLayout><LandingPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop" element={<PageTransition><GlobalLayout><ShopPage /></GlobalLayout></PageTransition>} />
        <Route path="/shop/:category" element={<PageTransition><GlobalLayout><CategoryPage /></GlobalLayout></PageTransition>} />
        <Route path="/search" element={<PageTransition><GlobalLayout><SearchResultsPage /></GlobalLayout></PageTransition>} />
        <Route path="/product/:slug" element={<PageTransition><GlobalLayout><ProductDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/virtual-try-on" element={<PageTransition><GlobalLayout><VirtualTryOnPage /></GlobalLayout></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><GlobalLayout><WishlistPage /></GlobalLayout></PageTransition>} />
        <Route path="/compare" element={<PageTransition><GlobalLayout><ComparePage /></GlobalLayout></PageTransition>} />
        <Route path="/recently-viewed" element={<PageTransition><GlobalLayout><RecentlyViewedPage /></GlobalLayout></PageTransition>} />
        <Route path="/cart" element={<PageTransition><GlobalLayout><CartPage /></GlobalLayout></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><GlobalLayout><CheckoutPage /></GlobalLayout></PageTransition>} />
        <Route path="/order-details" element={<PageTransition><GlobalLayout><OrderDetailsPage /></GlobalLayout></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><GlobalLayout><TrackOrderPage /></GlobalLayout></PageTransition>} />
        <Route path="/invoice" element={<PageTransition><GlobalLayout><InvoicePage /></GlobalLayout></PageTransition>} />
        <Route path="/account" element={<PageTransition><GlobalLayout><DashboardPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/orders" element={<PageTransition><GlobalLayout><MyOrdersPage /></GlobalLayout></PageTransition>} />
        <Route path="/account/order-details" element={<PageTransition><GlobalLayout><AccountOrderDetailsPage /></GlobalLayout></PageTransition>} />
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
        <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminLayout><AdminDashboardPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/products" element={<PageTransition><AdminLayout><AdminProductsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/products/add" element={<PageTransition><AdminLayout><AddEditProductPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/products/:id/edit" element={<PageTransition><AdminLayout><AddEditProductPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/products/:id" element={<PageTransition><AdminLayout><AddEditProductPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/categories" element={<PageTransition><AdminLayout><AdminCategoriesPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/brands" element={<PageTransition><AdminLayout><AdminBrandsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/orders" element={<PageTransition><AdminLayout><AdminOrdersListPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/orders/:id" element={<PageTransition><AdminLayout><AdminOrderDetailsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/payments" element={<PageTransition><AdminLayout><AdminPaymentVerificationPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/inventory" element={<PageTransition><AdminLayout><AdminInventoryPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/customers" element={<PageTransition><AdminLayout><AdminCustomersListPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/customers/:id" element={<PageTransition><AdminLayout><AdminCustomerDetailPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/reviews" element={<PageTransition><AdminLayout><AdminReviewsManagePage /></AdminLayout></PageTransition>} />
        <Route path="/admin/testimonials" element={<PageTransition><AdminLayout><AdminTestimonialsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms" element={<PageTransition><AdminLayout><AdminHomepageCMSPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/hero-slides" element={<PageTransition><AdminLayout><HeroSlidesPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/banners" element={<PageTransition><AdminLayout><AdminBannerManagementPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/pages" element={<PageTransition><AdminLayout><AdminPagesCMSPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/coupons" element={<PageTransition><AdminLayout><AdminCouponsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/newsletter" element={<PageTransition><AdminLayout><AdminNewsletterPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/media" element={<PageTransition><AdminLayout><AdminMediaLibraryPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/cms/settings" element={<PageTransition><AdminLayout><AdminWebsiteSettingsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/reports" element={<PageTransition><AdminLayout><AdminReportsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/analytics" element={<PageTransition><AdminLayout><AdminAnalyticsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/roles" element={<PageTransition><AdminLayout><AdminRolesPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/admin-users" element={<PageTransition><AdminLayout><AdminAdminUsersPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/activity-logs" element={<PageTransition><AdminLayout><AdminActivityLogsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/notifications" element={<PageTransition><AdminLayout><AdminSystemNotificationsPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/security" element={<PageTransition><AdminLayout><AdminSecurityPage /></AdminLayout></PageTransition>} />
        <Route path="/admin/audit-logs" element={<PageTransition><AdminLayout><AdminAuditLogsPage /></AdminLayout></PageTransition>} />
        <Route path="/design-system/*" element={<DesignSystemRoutes />} />
        <Route path="/404" element={<PageTransition><NotFoundPage /></PageTransition>} />
        <Route path="/500" element={<PageTransition><ErrorPage /></PageTransition>} />
        <Route path="/offline" element={<PageTransition><OfflinePage /></PageTransition>} />
        <Route path="/maintenance" element={<PageTransition><MaintenancePage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
