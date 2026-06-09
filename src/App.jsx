import { Routes, Route, Link } from "react-router-dom";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import { useHeader } from "./context/HeaderContext";
import { checkAndHandleExpiredSession } from "./utils/auth";
import ThankYou from "./components/Payment/ThankYou";

const Login = lazy(() => import("./pages/LoginPage"));
const Register = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const RedeemPage = lazy(() => import("./pages/ReedemPage"));
const RedeemHistory = lazy(() => import("./pages/RedeemHistory"));
const Notification = lazy(() => import("./pages/NotificationPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const EditProfile = lazy(() => import("./pages/EditProfilePage"));
const ViewProfile = lazy(() => import("./pages/ViewProfile"));
const ShippingAddressPage = lazy(() => import("./pages/ShippingAddressPage"));
const AddressForm = lazy(() => import("./pages/AddressForm"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const OrderReturnPage = lazy(() => import("./pages/OrderReturnPage"));
const AddReviewPage = lazy(() => import("./pages/AddReviewPage"));
const ReferProgramPage = lazy(() => import("./pages/ReferProgramPage"));
const BuyCoinsPage = lazy(() => import("./pages/BuyCoinsPage"));
const LuckyDrawPage = lazy(() => import("./pages/LuckyDrawPage"));
const LanguagePage = lazy(() => import("./pages/LanguagePage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const CosmicChatSupport = lazy(() => import("./pages/CosmicChatSupport"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const RefundCancellationPolicy = lazy(() => import("./components/RefundCancellationPolicy"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const SpinToWin = lazy(() => import("./components/spinner/SpinToWin"));


function App() {
  const token = localStorage.getItem("token");
  const { setList } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {

    const isSessionValid = checkAndHandleExpiredSession();

    if (isSessionValid) {
      fetchWishlist();

      const intervalId = setInterval(() => {
        const stillValid = checkAndHandleExpiredSession();
        if (!stillValid) {
          clearInterval(intervalId);
          navigate("/login");
        }
      }, 60000); // Check every minute

      return () => clearInterval(intervalId);
    }

  }, [token, navigate]);


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
  const [showSplash, setShowSplash] = useState(
    !sessionStorage.getItem("splashShown")
  );

  useEffect(() => {
    if (!showSplash) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem("splashShown", "true");
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSplash]);

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-[9999] bg-[#1a1a1a]">
          <SplashScreen />
        </div>
      )}
      <ScrollToTop />
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div></div>}>
        <SpinToWin />

        <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/" element={<SplashScreen />} /> */}
          {/* Routes with layout */}
          <Route element={<Layout countryCurrency={countryCurrency} />}>

            <Route path="/" element={<HomePage countryCurrency={countryCurrency} country={country} />} />
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
            <Route path="/thank-you" element={<ThankYou />} />
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
                    to="/"
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Go back to Home
                  </Link>
                </div>
              }
            />


          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
