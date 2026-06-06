// Add this to your HomePage.jsx

import React, { useEffect, useCallback } from 'react'
import OurProducts from '../components/OurProducts'
import ImageCarousel from '../components/ImageCarousel'
import { useHeader } from '../context/HeaderContext'
import WhyChooseUs from '../components/WhyChooseUs'
import { Suspense, lazy } from 'react'
// import { messaging, getToken, onMessage } from '../utils/firebaseConfig' // ✅ Import Firebase
const StoryBanner = lazy(() => import('../components/StoryBanner'));
const ProductVideoSection = lazy(() => import('../components/ProductVideoSection'));
import Testimonials from '../components/Testimonials'
import { Star } from 'lucide-react'
import ManifestationInfo from '../components/ManifestationInfo'
import HowToUseManifestation from '../components/HowToUseManifestation'




const HomePage = ({ countryCurrency, country }) => {


  const { setCount, setList, setUnreadCount } = useHeader();
  const token = localStorage.getItem("token");
  const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache



  const fetchCartData = useCallback(async () => {
    // Check cache first
    const cachedCart = localStorage.getItem('cart_data');
    const cacheTime = localStorage.getItem('cart_data_time');

    if (cachedCart && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
      setCount(Number(cachedCart));
      return; // Use cached data
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems?currencyCode=${countryCurrency}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cart data');

      const data = await response.json();
      const cartLength = data?.data?.length || 0;

      localStorage.setItem("cart", cartLength);
      localStorage.setItem("cart_data", cartLength);
      localStorage.setItem("cart_data_time", Date.now().toString());

      setCount(cartLength);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }, [token, setCount, countryCurrency, CACHE_DURATION]);


  const fetchNotifications = useCallback(async () => {
    // Check cache first
    const cachedUnread = localStorage.getItem('unreadCount');
    const cacheTime = localStorage.getItem('notifications_cache_time');

    if (cachedUnread && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
      setUnreadCount(Number(cachedUnread));
      return; // Use cached data
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/notifications/get`,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) throw new Error('Failed to fetch notifications');

      const data = await res.json();
      const allNotifications = data.data || [];
      const unreadCount = allNotifications.filter(n => !n.isRead).length;

      localStorage.setItem("unreadCount", unreadCount);
      // localStorage.setItem("unread_count", unreadCount);
      localStorage.setItem("notifications_cache_time", Date.now().toString());

      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [token, setUnreadCount]);


  const fetchWishlist = useCallback(async () => {

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/wishlist/getWishlist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch wishlist");

      const wishlistLength = data.data.length;

      localStorage.setItem("wishlist_count", wishlistLength);
      localStorage.setItem("wishlist_cache_time", Date.now().toString());

      setList(wishlistLength);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  }, [token, setList]);




  useEffect(() => {
    if (token) {
      // ✅ Fetch everything in parallel (including notifications setup)
      Promise.all([
        fetchCartData(),
        fetchNotifications(),
        fetchWishlist(),

      ]);
    } else {
      setCount(localStorage.getItem("cart") || 0);
    }
  }, [token, fetchCartData, fetchNotifications, fetchWishlist, setCount]);


  return (
    <div className='mx-auto'>


      <ImageCarousel countryCurrency={countryCurrency} />
      <WhyChooseUs />
      <OurProducts countryCurrency={countryCurrency} country={country} />

      <ManifestationInfo />
      <HowToUseManifestation />
      <Suspense
        fallback={
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400 text-lg">Loading story...</p>
          </div>
        }
      >
        <StoryBanner />
      </Suspense>


      <div className="text-center py-3 my-5">
        <h1
          className="text-2xl md:text-4xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
            backgroundSize: "200% 200%",
            animation: "goldShine 3s linear infinite",
          }}
        >
          See How World Is Manifesting With Icchhapurti
        </h1>

        <p className="text-md font-bold sm:text-xl text-[#a17b0a] px-4">
          Experience the Manifestation Pen in short, powerful reels
        </p>
      </div>

      <div className="">
        <img src="/shape1.png" alt="" className="w-full block" loading="lazy" />
      </div>

      <Suspense
        fallback={
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-400 text-lg">Loading Videos...</p>
          </div>
        }
      >
        <ProductVideoSection />
      </Suspense>



      <div className="text-center mt-2">
        <div className="flex justify-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500" />
          ))}
        </div>

        <h1
          className="text-2xl my-2 md:text-4xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
            backgroundSize: "200% 200%",
            animation: "goldShine 3s linear infinite",
          }}
        >
          What Our Customer Says
        </h1>
        <p className="text-base sm:text-xl text-[#a17b0a]">
          Real stories from real customers
        </p>
      </div>

      <Testimonials />
    </div>
  )
}

export default HomePage