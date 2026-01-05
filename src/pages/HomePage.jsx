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
import Testimonials from '../components/Testimonials'
import WaveDivider from '../components/WaveDivider'

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
      console.error('Error fetching cart:', err);
    } finally {
    }
  };

  console.log(cartCount, "cartCount")

  const fetchNotifications = async () => {
    try {
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

    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
    }
  };

  useEffect(() => {
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
      } finally {
      }
    };

    fetchWishlist();
  }, [token]);

  return (
    <div className='mx-auto'>
      <ImageCarousel />
      <WhyChooseUs />

      <OurProducts />

      {/* Story Banner and Video Section with SVG Wave Divider */}

      <StoryBanner />



      <div className="mt-30">
        <img
          src="/shape1.png"
          alt=""
          className="w-full block"
        />
      </div>

      <ProductVideoSection />
      
      <div className="mt-30">
        <img
          src="/shape1.png"
          alt=""
          className="w-full block"
        />
      </div>

      <Testimonials />
    </div>
  )
}

export default HomePage