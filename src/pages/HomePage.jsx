import React from 'react'
import HeroSection from '../components/HeroSection'
import OurProducts from '../components/OurProducts'
import DownloadAppSection from '../components/DownloadAppSection'
import ManifestationPenHero from '../components/ManifestationPenHero'
import ManifestationBenefits from '../components/ManifestationBenefits'
import HowToUseManifestationPen from '../components/HowToUseManifestationPen'
import ManifestationFeatures from '../components/ManifestationFeatures'
import CustomerReviews from '../components/CustomerReviews'
import ManifestationStory from '../components/ManifestationStory'
import ImageCarousel from '../components/ImageCarousel'
import { useEffect } from 'react'
import { useHeader } from '../context/HeaderContext'
import WhyChooseUs from '../components/WhyChooseUs'
import StoryBanner from '../components/StoryBanner'
import ProductVideoSection from '../components/ProductVideoSection'
import FAQPage from './FAQPage'

const HomePage = () => {

  const { setCount, cartCount, setList, setUnreadCount, wishlistCount } = useHeader();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchCartData();
      fetchNotifications()
    } else {
      setCount(localStorage.getItem("cart"))
    }

  }, []);

  const fetchCartData = async () => {
    try {
      // setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cart data');

      const data = await response.json();
      if (data.cart) {
        localStorage.setItem("cart", 0)
      }
      localStorage.setItem("cart", data?.data?.length || 0)
      setCount(data?.data?.length)
    } catch (err) {
      // setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      // setLoading(false);
    }
  };

console.log(cartCount,"cartCount")

  const fetchNotifications = async () => {
    try {
      // setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/notifications/get`,
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await res.json();
      const allNotifications = data.data || [];
      const unreadCount = allNotifications.filter(n => !n.isRead).length;
      localStorage.setItem("unreadCount", unreadCount)
      setUnreadCount(unreadCount)
      // setNotifications(allNotifications);

    } catch (err) {
      console.error("Error fetching notifications:", err);
      // setNotifications([]);
    } finally {
      // setLoading(false);
    }
  };





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



  return (
    <div className=' mx-auto'>



      {/* <HeroSection /> */}
      <ImageCarousel />
      <WhyChooseUs/>
      {/* <ManifestationPenHero /> */}
      
      <OurProducts />
      <StoryBanner/>
      <ProductVideoSection/>
      {/* <ManifestationBenefits /> */}
      {/* <HowToUseManifestationPen /> */}
      {/* <ManifestationFeatures /> */}
      <CustomerReviews />
      <FAQPage/>
      {/* <ManifestationStory /> */}
      {/* <OurProducts /> */}
      {/* <DownloadAppSection/> */}
    </div>
  )
}

export default HomePage