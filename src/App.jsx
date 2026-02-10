import { Routes, Route, Link } from "react-router-dom";
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

// import PaymentPage from "./pages/PaymentPage";
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
import { useNavigate } from "react-router-dom";
import { checkAndHandleExpiredSession } from "./utils/auth";
import SpinToWin from "./components/spinner/SpinToWin";


function App() {
  const token = localStorage.getItem("token");
  const { setList } = useHeader();
 

  /* ================= Check Session Expiry on App Load ================= */
  useEffect(() => {



  }, []);

  useEffect(() => {

    const isSessionValid = checkAndHandleExpiredSession();

    if (isSessionValid) {
      fetchWishlist();
    }

  }, [token]);


  const fetchWishlist = async () => {
   
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

      

      setList(data.data.length)
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      // setError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  const [countryCurrency, setCountryCurrency] = useState("INR");
  const [country, setCountry] = useState("India");
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
      setCountry(data.country_name)
      return data.country_code; // IN, US, GB
    } catch (error) {
      console.error('Failed to get country code:', error);
      return null; // fallback
    }
  }


  return (
    <>
      <ScrollToTop />
      <SpinToWin />
      <Routes>
        {/* Public routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<SplashScreen />} />
        {/* Routes with layout */}
        <Route element={<Layout countryCurrency={countryCurrency} />}>

          <Route path="/homePage" element={<HomePage countryCurrency={countryCurrency} country={country} />} />
          <Route path="/products" element={<ProductsPage countryCurrency={countryCurrency} country={country} />} />
          <Route path="/product/:id/:name" element={<ProductDetailPage countryCurrency={countryCurrency} country={country} />} />
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
          {/* <Route path="/cart" element={<CartPage />} /> */}
          <Route path="/wishlist" element={<WishlistPage />} />
          {/* <Route path="/payments" element={<PaymentPage />} /> */}
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
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-5xl text-white font-bold">404</h1>
                <p className="text-gray-200 mt-2">Page Not Found</p>
                <Link
                  to="/homePage"
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Go back to Home
                </Link>
              </div>
            }
          />


        </Route>
      </Routes>
    </>
  );
}

export default App;
