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
import ContactUs from "./components/ContactUs";
import { useEffect } from "react";
import WishlistPage from "./components/WishlistPage";
import { useHeader } from "./context/HeaderContext";
import ShippingPolicy from "./pages/ShippingPolicy";
import RefundCancellationPolicy from "./components/RefundCancellationPolicy";
import AboutUs from "./pages/AboutUs";
import { useState } from "react";


function App() {
  const token = localStorage.getItem("token");
  const { setList } = useHeader();
  useEffect(() => {


    const fetchWishlist = async () => {
      // setLoading(true);
      // setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/wishlist/getWishlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch wishlist");
        }

        // adjust if your field is different
        // setItems(data.data || []);

        setList(data.data.length)
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const [countryCurrency, setCountryCurrency] = useState(null);
  useEffect(() => {

    getCountryCode()
  }, [])

  async function getCountryCode() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      console.log(data, "geocoding")
      setCountryCurrency(data.currency
      );
      return data.country_code; // IN, US, GB
    } catch (error) {
      console.error('Failed to get country code:', error);
      return null; // fallback
    }
  }


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

          <Route path="/homePage" element={<HomePage countryCurrency={countryCurrency} />} />
          <Route path="/products" element={<ProductsPage countryCurrency={countryCurrency} />} />
          <Route path="/product/:id" element={<ProductDetailPage countryCurrency={countryCurrency} />} />
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
          <Route path="/wishlist" element={<WishlistPage />} />
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
          <Route path="/about-us" element={<AboutUs />} />
          {/* <Route path="/about-us" element={<AboutUsPage />} /> */}
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-cancellation-policy" element={<RefundCancellationPolicy />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
