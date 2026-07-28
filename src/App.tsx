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
        <Route path="/" element={<GlobalLayout><LandingPage /></GlobalLayout>} />
        <Route path="/shop" element={<GlobalLayout><ShopPage /></GlobalLayout>} />
        <Route path="/shop/:category" element={<GlobalLayout><CategoryPage /></GlobalLayout>} />
        <Route path="/search" element={<GlobalLayout><SearchResultsPage /></GlobalLayout>} />
        <Route path="/product/:slug" element={<GlobalLayout><ProductDetailsPage /></GlobalLayout>} />
        <Route path="/virtual-try-on" element={<GlobalLayout><VirtualTryOnPage /></GlobalLayout>} />
        <Route path="/wishlist" element={<GlobalLayout><WishlistPage /></GlobalLayout>} />
        <Route path="/compare" element={<GlobalLayout><ComparePage /></GlobalLayout>} />
        <Route path="/recently-viewed" element={<GlobalLayout><RecentlyViewedPage /></GlobalLayout>} />
        <Route path="/cart" element={<GlobalLayout><CartPage /></GlobalLayout>} />
        <Route path="/checkout" element={<GlobalLayout><CheckoutPage /></GlobalLayout>} />
        <Route path="/order-details" element={<GlobalLayout><OrderDetailsPage /></GlobalLayout>} />
        <Route path="/track-order" element={<GlobalLayout><TrackOrderPage /></GlobalLayout>} />
        <Route path="/invoice" element={<GlobalLayout><InvoicePage /></GlobalLayout>} />
        <Route path="/account" element={<GlobalLayout><DashboardPage /></GlobalLayout>} />
        <Route path="/account/orders" element={<GlobalLayout><MyOrdersPage /></GlobalLayout>} />
        <Route path="/account/order-details" element={<GlobalLayout><AccountOrderDetailsPage /></GlobalLayout>} />
        <Route path="/account/wishlist" element={<GlobalLayout><AccountWishlistPage /></GlobalLayout>} />
        <Route path="/account/addresses" element={<GlobalLayout><SavedAddressesPage /></GlobalLayout>} />
        <Route path="/account/reviews" element={<GlobalLayout><ReviewsPage /></GlobalLayout>} />
        <Route path="/account/notifications" element={<GlobalLayout><NotificationsPage /></GlobalLayout>} />
        <Route path="/account/settings" element={<GlobalLayout><AccountSettingsPage /></GlobalLayout>} />
        <Route path="/account/edit-profile" element={<GlobalLayout><EditProfilePage /></GlobalLayout>} />
        <Route path="/account/change-password" element={<GlobalLayout><ChangePasswordPage /></GlobalLayout>} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/email-verification" element={<EmailVerificationPage />} />
        <Route path="/auth/otp-verification" element={<OTPVerificationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
        <Route path="/admin/products/add" element={<AdminLayout><AddEditProductPage /></AdminLayout>} />
        <Route path="/admin/products/:id/edit" element={<AdminLayout><AddEditProductPage /></AdminLayout>} />
        <Route path="/admin/products/:id" element={<AdminLayout><AddEditProductPage /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesPage /></AdminLayout>} />
        <Route path="/admin/brands" element={<AdminLayout><AdminBrandsPage /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrdersListPage /></AdminLayout>} />
        <Route path="/admin/orders/:id" element={<AdminLayout><AdminOrderDetailsPage /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><AdminPaymentVerificationPage /></AdminLayout>} />
        <Route path="/admin/inventory" element={<AdminLayout><AdminInventoryPage /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><AdminCustomersListPage /></AdminLayout>} />
        <Route path="/admin/customers/:id" element={<AdminLayout><AdminCustomerDetailPage /></AdminLayout>} />
        <Route path="/admin/reviews" element={<AdminLayout><AdminReviewsManagePage /></AdminLayout>} />
        <Route path="/admin/testimonials" element={<AdminLayout><AdminTestimonialsPage /></AdminLayout>} />
        <Route path="/admin/cms" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/design-system/*" element={<DesignSystemRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
