import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Layout from "./layout/Layout";
import ProductsPage from "./pages/ProductsPage";
import ScrollToTop from "./components/ScrollToTop";
import ProductDetailPage from "./pages/ProductDetailPage";
import WalletPage from "./pages/WalletPage";
import RedeemPage from "./pages/ReedemPage";
import RedeemHistory from "./pages/RedeemHistory";
import Notification from "./pages/NotificationPage";
import AccountPage from "./pages/AccountPage";
import EditProfile from "./pages/EditProfilePage";
import ViewProfile from "./pages/ViewProfile";
import ShippingAddressPage from "./pages/ShippingAddressPage";
import AddressForm from "./pages/AddressForm";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrderReturnPage from "./pages/OrderReturnPage";
import AddReviewPage from "./pages/AddReviewPage";
import ReferProgramPage from "./pages/ReferProgramPage";
import BuyCoinsPage from "./pages/BuyCoinsPage";
import LuckyDrawPage from "./pages/LuckyDrawPage";
import LanguagePage from "./pages/LanguagePage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CosmicChatSupport from "./pages/CosmicChatSupport";
import AboutUsPage from "./pages/AboutUsPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import FAQPage from "./pages/FAQPage";
import SplashScreen from "./components/SplashScreen";

function App() {
  return (
    <>
        <ScrollToTop />
      <Routes>
        {/* Public routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/" element={<SplashScreen />} />
        {/* Routes with layout */}
        <Route element={<Layout />}>
        
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/reedem" element={<RedeemPage />} />
          <Route path="/reedem-history" element={<RedeemHistory />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/addresses" element={<ShippingAddressPage />} />
          <Route path="/address-form" element={<AddressForm />} />
          <Route path="/address-form/:id" element={<AddressForm />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/orders/return/:id" element={<OrderReturnPage />} />
          <Route path="/add/review/:id" element={<AddReviewPage />} />
          <Route path="/refer-programme" element={<ReferProgramPage />} />
          <Route path="/buy-coins" element={<BuyCoinsPage />} />
          <Route path="/lucky-draw" element={<LuckyDrawPage />} />
          <Route path="/languages" element={<LanguagePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/chat-support" element={<CosmicChatSupport />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
