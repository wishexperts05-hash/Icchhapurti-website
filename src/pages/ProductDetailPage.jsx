import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, Share2, X, Copy, ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zap } from 'lucide-react';
import { useHeader } from '../context/HeaderContext';
import AddReviewModal from '../components/AddReviewModal';
import { Box } from 'lucide-react';
import FAQPage from './FAQPage';
import { ChevronDown } from 'lucide-react';
import ProductImageGallery from '../components/ProductImageGallery';
import CartSidebar from '../components/CartSidebar';
import PaymentModal from './PaymentModal';
import { BsFacebook, BsInstagram, BsWhatsapp } from 'react-icons/bs';
import { PiPinterestLogo } from 'react-icons/pi';

export default function ProductDetails({countryCurrency}) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewsData] = useState();
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const { setCount } = useHeader();
  const { id } = useParams();
  const productId = id;
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [openReview, setOpenReview] = useState(false);


  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: "How does the Seven Chakra Pen work?",
      answer:
        "Charged with multiple rituals like Havans, Mantra Jaap, Mantras Chanting, Moon Charging, and many more rituals that align the energy of the pen to support your emotional balance, clarity, and vibrational alignment with your desires."
    },
    // {
    //   question: "Can I use the pen for journaling or planning?",
    //   answer:
    //     "Yes, the pen is perfect for journaling, scripting, planning goals, or writing manifestation statements."
    // },
    {
      question: "Is the Seven Chakra Pen suitable for beginners in manifestation?",
      answer:
        "Absolutely. It is designed to be simple, practical, and easy to incorporate into daily routines."
    },
    {
      question: "How often should I use the Seven Chakra Pen?",
      answer:
        "Daily use is recommended, but even using it a few times a week with focused intention can be effective."
    },
    {
      question: "Can the pen help with emotional balance?",
      answer:
        "Yes, consistent intention-based writing can support emotional clarity, grounding, and inner balance."
    },
    {
      question: "Is the pen spiritually charged or energized?",
      answer:
        "This pen is specially charged and activated with multiple processes and rituals like  Mantra Jaap, Mantras Chanting, Moon Charging, and many more rituals."
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Manifestation is a personal journey. Some users notice shifts in mindset quickly, while deeper results develop with consistent practice."
    },
    {
      question: "Can I gift the Seven Chakra Pen to someone?",
      answer:
        "Yes, it makes a thoughtful gift for anyone interested in mindfulness, spirituality, or personal growth."
    }
  ];

  const faq1 = [
    {
      question: "Who is this Manifestation Pen best suited for?",
      answer:
        "The pen is ideal for students, professionals, corporate users, and anyone who values elegant design and purposeful writing."
    },
    {
      question: "How does this pen support manifestation?",
      answer:
        "Writing goals, plans, and affirmations with intention helps improve focus, confidence, and clarity, supporting personal and professional achievement."
    },
    {
      question: "Is this Manifestation Pen suitable for daily professional use?",
      answer:
        "Yes, it is designed for regular use in offices, meetings, classrooms, and study sessions."
    },
    {
      question: "Is the Manifestation Pen comfortable for long writing sessions?",
      answer:
        "Yes, the balanced metal body and smooth ink flow help reduce hand fatigue during extended writing."
    },
    {
      question: "Can students use this Manifestation Pen for studying and exams?",
      answer:
        "Yes, it is perfect for note-taking, goal setting, revision planning, and exam preparation."
    },
    {
      question: "Can this Manifestation Pen help build positive writing habits?",
      answer:
        "Yes, a high-quality pen encourages regular writing, planning, and disciplined daily habits."
    },
    {
      question: "How can this Manifestation Pen help students stay motivated?",
      answer:
        "Writing goals, study plans, and positive affirmations with this pen helps students stay focused and motivated toward their academic targets."
    }
  ];


  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
  }, [productId]);

  useEffect(() => {
    if (product) {
      fetchProductReviews(currentPage)

    }

    // fetchFaqs();
  }, [currentPage]);




  // const fetchFaqs = async () => {
  //   try {
  //     const res = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/user/faq/list`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch FAQs");
  //     }

  //     const json = await res.json();
  //     setFaqs(json.data || []);
  //   } catch (err) {
  //     console.error("Error fetching FAQs:", err);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/v1/products/productById/${productId}?countryCode=${countryCurrency ||"INR"}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.product) {
        setProduct(data.product);
      } else if (data.success && data.data) {
        setProduct(data.data);
      } else if (data.id || data._id) {
        setProduct(data);
      } else {
        throw new Error('Invalid product data');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (page = 1) => {
    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/user`;
      const apiPath = token ? "" : "/v1";

      const response = await fetch(
        `${baseUrl}${apiPath}/reviews/getProductReviews/${productId}?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setReviewsData(data.data);
        setTotalPages(data.pagination.totalPages || 1);
      } else if (data.success && data.data) {
        setReviews(data.data.reviews);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (Array.isArray(data)) {
        setReviews(data);
      } else {
        throw new Error('Invalid reviews data');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviewsError(err.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const StarRating = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
  //  const [addedToCart, setAddedToCart] = useState(false);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async ({ product, e, isBuyNow }) => {
    // e.stopPropagation();

    if (isBuyNow) {
      setBuyingNow(true);
    } else {
      setAddingToCart(true);
    }

    try {
      if (!token) {
        const cartItem = {
          productId: product._id || product.id,
          product: {
            _id: product._id || product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            image: product.images?.[0],
          },
          quantity: 1,
          totalAmount: product.price || 0,
        };

        const existingCart = JSON.parse(
          localStorage.getItem("cartItems") || "[]"
        );
        const existingItemIndex = existingCart.findIndex(
          (item) => (item.productId || item.product._id) === cartItem.productId
        );

        if (existingItemIndex > -1) {
          existingCart[existingItemIndex].quantity += 1;
          existingCart[existingItemIndex].totalAmount =
            existingCart[existingItemIndex].quantity * product.price;
        } else {
          existingCart.push(cartItem);
        }

        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        const totalItems = existingCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        localStorage.setItem("cart", totalItems);
        setCount(totalItems);
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cart: existingCart, count: totalItems },
          })
        );
        setCartSidebarOpen(true)

      } else {
        const cartData = {
          productId: product._id || product.id,
          quantity: qty,
          totalAmount: (product.price || 0) * qty
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/addToCart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(cartData)
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to add to cart');
        }

        if (result.success) {
          setCount(prev => prev + 1)
          if (isBuyNow) {
            setOpenPayment(true)
          } else {
            setCartSuccess(true);
            setTimeout(() => setCartSuccess(false), 2000);
            setCartSidebarOpen(true)

          }
        }




      }
    } catch (error) {
      setCartSidebarOpen(true)
    } finally {
      setAddingToCart(false);
      setBuyingNow(false);
    }
  };
  const [openPayment, setOpenPayment] = useState(false)

  const handleBuyNow = async (product) => {
    // e.stopPropagation();
    // alert("buy now")

    if (token) {
      await handleAddToCart({ product, isBuyNow: true });
    } else {


      const cartItem = {
        productId: product._id || product.id,
        product: {
          _id: product._id || product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          image: product.images?.[0],
        },
        quantity: 1,
        totalAmount: product.price || 0,
      };

      const existingCart = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      const existingItemIndex = existingCart.findIndex(
        (item) => (item.productId || item.product._id) === cartItem.productId
      );

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += 1;
        existingCart[existingItemIndex].totalAmount =
          existingCart[existingItemIndex].quantity * product.price;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(existingCart));
      const totalItems = existingCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      localStorage.setItem("cart", totalItems);
      setCount(totalItems);
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cart: existingCart, count: totalItems },
        })
      );
      // Navigate("/payments");
      setOpenPayment(true)
    }

  };



  // share option 
  const [shareOpen, setShareOpen] = useState(false);
  const shareUrl = window.location.href;
  const shareTitle = product?.name || "Check this product";
  const handleShare = async () => {
    setShareOpen(true);
  };



  // find current user's review (API gives isCurrentUser)
  const currentUserReview = reviews?.find(r => r.isCurrentUser);
  const hasReviewed = Boolean(currentUserReview);

  const orderedReviews = hasReviewed
    ? [currentUserReview, ...reviews.filter(r => !r.isCurrentUser)]
    : reviews;

  const parsedDescription = (() => {
    try {
      return typeof product?.description === "string"
        ? JSON.parse(product.description)
        : product?.description;
    } catch {
      return [];
    }
  })();


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-base sm:text-lg mt-4 sm:mt-6 font-medium">Loading product details...</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-red-500/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchProductDetails}
              className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => Navigate(-1)}
              className="px-6 py-3 rounded-lg text-white font-medium bg-slate-700 hover:bg-slate-600 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-700">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Product Not Found</h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => Navigate(-1)}
            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen 
 relative overflow-hidden py-4 sm:py-8">


      {shareOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">

            {/* Close */}
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Share this product
            </h3>

            {/* Copy link */}
            <div className="flex items-center gap-2 mb-4">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied!");
                }}
                className="p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
              >
                <Copy size={16} />
              </button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-4 gap-4 text-center">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                target="_blank"
                className="flex flex-col items-center gap-1 text-green-600 hover:scale-105 transition"
              >
                {/* <img src="/icons/whatsapp.svg" className="w-8 h-8" /> */}
                <BsWhatsapp />
                <span className="text-xs">WhatsApp</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="flex flex-col items-center gap-1 text-pink-600 hover:scale-105 transition"
              >
                {/* <img src="/icons/instagram.svg" className="w-8 h-8" /> */}
                <BsInstagram />
                <span className="text-xs">Instagram</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 text-blue-600 hover:scale-105 transition"
              >
                <BsFacebook />
                <span className="text-xs">Facebook</span>
              </a>

              {/* Pinterest */}
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                className="flex flex-col items-center gap-1 text-red-600 hover:scale-105 transition"
              >
                {/* <img src="/icons/pinterest.svg" className="w-8 h-8" /> */}
                <PiPinterestLogo />
                <span className="text-xs">Pinterest</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => setCartSidebarOpen(false)}
        onCheckout={() => {

          setCartSidebarOpen(false);
          setOpenPayment(true);
        }}

      />

      {cartSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/15  backdrop-blur-[1px] z-51 animate-fadeIn"
        // onClick={() => setMenuOpen(false)}
        />
      )}
      {
        openPayment && <PaymentModal isOpen={openPayment} onClose={() => setOpenPayment(false)} />
      }
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-64 sm:h-64 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <AddReviewModal
        isOpen={openReview}
        onClose={() => setOpenReview(false)}
        productId={productId}
        fetchProductReviews={fetchProductReviews}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => Navigate(-1)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Products
          </button>
        </div>

        {/* Main Content */}
        <div className=" backdrop-blur-lg rounded-xl bg-white sm:rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="space-y-3 sm:space-y-6">
              <div className="bg-white rounded-lg sm:rounded-2xl p-2 sm:p-6 shadow-xl">
                {/* <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  spaceBetween={10}
                  className="product-swiper rounded-md sm:rounded-xl overflow-hidden"
                >
                  {(product.images?.length > 0 ? product.images : [product.image]).map(
                    (img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img || "https://via.placeholder.com/400x400?text=No+Image"}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-[220px] xs:h-[260px] sm:h-[350px] md:h-[400px] object-contain"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                          }}
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper> */}

                <ProductImageGallery images={product.images || [product.image]} videos={product.videos || []} />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-slate-600/50">
                  <Truck className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-1 sm:mb-2" />
                  <p className="text-black text-[10px] sm:text-xs font-medium">
                    Fast Delivery
                  </p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-slate-600/50">
                  <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                  <p className="text-black text-[10px] sm:text-xs font-medium">
                    Secure Payment
                  </p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-slate-600/50">
                  <Box className="w-5 h-5 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-1 sm:mb-2" />
                  <p className="text-black text-[10px] sm:text-xs font-medium">
                    Quality Product
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-black mb-2 sm:mb-3">
                  {product.name || "Untitled Product"}
                </h1>

                {/* Rating Summary */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <span className="font-bold text-sm sm:text-base">
                      {reviewData?.overallRating || 0}
                    </span>
                    <Star size={12} className="fill-white sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    ({reviewData?.totalReviews || 0} Reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                  <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-black">
                    {product.price || 0} <p className='text-sm text-gray-600'>( MRP Incl. of All Taxes )</p>
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm sm:text-lg lg:text-xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) *
                          100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>
              </div>



              {/* Share Button */}
              <div className="flex justify-start mb-3">
                <button
                  onClick={handleShare}
                  className="flex items-center cursor-pointer gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>





              {/* Description */}
              <div className="space-y-2 max-h-[50vh] overflow-y-scroll mb-10 hidden lg:block">
                {product?.productDetails?.map((faq, index) => {
                  const faqId = faq._id || index;
                  const isOpen = openFAQ === faqId;

                  return (
                    <div
                      key={faqId}
                      className={`bg-white rounded-xl overflow-hidden border transition-colors ${isOpen
                        ? "border-blue-500/50 shadow-md"
                        : "border-slate-300 hover:border-slate-400"
                        }`}
                    >
                      <button
                        onClick={() => toggleFAQ(faqId)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <h3
                          className="text-sm font-semibold text-black pr-3"
                          dangerouslySetInnerHTML={{ __html: faq.title }}
                        />
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-blue-500 rotate-180" : "bg-slate-500"
                            }`}
                        >
                          <ChevronDown className="w-4 h-4 text-white" />
                        </div>
                      </button>

                      {/* Grid-based animation - Most performant */}
                      <div
                        className="grid transition-all duration-200 ease-in-out"
                        style={{
                          gridTemplateRows: isOpen ? '1fr' : '0fr'
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 pb-3">
                            <div
                              className="bg-gray-100 rounded-lg p-3 text-sm text-black"
                              dangerouslySetInnerHTML={{ __html: faq.detail }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart({ product, e, isBuyNow: false })}
                  disabled={addingToCart || cartSuccess || buyingNow}
                  className="flex items-center cursor-pointer justify-center gap-1 sm:gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Adding...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : cartSuccess ? (
                    <>
                      <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={() => handleBuyNow(product)}
                  disabled={addingToCart || cartSuccess || buyingNow}
                  className="flex items-center cursor-pointer justify-center gap-1 sm:gap-2 bg-[#D3AF37] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                >
                  {buyingNow ? (
                    <>
                      <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Buy Now</span>
                      <span className="sm:hidden">Buy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2 mb-10 lg:hidden block">
              {product?.productDetails?.map((faq, index) => {
                const faqId = faq._id || index;
                const isOpen = openFAQ === faqId;

                return (
                  <div
                    key={faqId}
                    className={`bg-white rounded-xl overflow-hidden border transition-colors ${isOpen
                      ? "border-blue-500/50 shadow-md"
                      : "border-slate-300 hover:border-slate-400"
                      }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faqId)}
                      className="w-full px-4 py-2 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h3
                        className="text-sm font-semibold text-black pr-3"
                        dangerouslySetInnerHTML={{ __html: faq.title }}
                      />
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-blue-500 rotate-180" : "bg-slate-500"
                          }`}
                      >
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                    </button>

                    {/* Grid-based animation - Most performant */}
                    <div
                      className="grid transition-all duration-200 ease-in-out"
                      style={{
                        gridTemplateRows: isOpen ? '1fr' : '0fr'
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 pb-3">
                          <div
                            className="bg-gray-100 rounded-lg p-3 text-sm text-black"
                            dangerouslySetInnerHTML={{ __html: faq.detail }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* faq section  */}


          <section className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Frequently Asked Questions
            </h2>
            {
              product?.name.includes("Elegant Metal Roller") &&

              <div className="space-y-4">
                {faq1.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl shadow-sm bg-white"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className="w-full flex justify-between items-center px-5 py-4 text-left"
                    >
                      <span className="font-semibold text-gray-800">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openIndex === index && (
                      <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            }

            {
              product?.name.includes("Seven Chakra") &&
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl shadow-sm bg-white"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? null : index)
                      }
                      className="w-full flex justify-between items-center px-5 py-4 text-left"
                    >
                      <span className="font-semibold text-gray-800">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openIndex === index && (
                      <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            }

          </section>



          {/* Reviews Section */}
          <div className="border-t border-slate-700/50 p-4 sm:p-6 lg:p-8">
            <h2 className="text-black font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              Customer Reviews
            </h2>

            {/* Rating Bars */}
            {reviewData?.starDistribution && (
              <div className="bg-white rounded-lg p-3 mb-3 border border-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Overall Rating */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-black leading-none">
                      {reviewData?.overallRating || 0}
                    </div>
                    <StarRating
                      rating={Math.round(reviewData?.overallRating || 0)}
                      size={14}
                    />
                    <p className="text-black text-[11px] mt-1">
                      {reviewData?.totalReviews || 0} reviews
                    </p>
                  </div>

                  {/* Distribution */}
                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const percent = reviewData?.starDistribution?.[stars] || 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="w-8 text-[11px] text-black font-medium">
                            {stars}★
                          </span>

                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <span className="w-8 text-[11px] text-black text-right">
                            {percent}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="text-center py-8 sm:py-12">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-3 sm:mb-4 text-cyan-400" />
                <p className="text-Black text-base sm:text-lg">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 sm:p-6 text-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-red-400 mb-3 sm:mb-4 font-medium text-sm sm:text-base">Error loading reviews: {reviewsError}</p>
                <button
                  onClick={() => fetchProductReviews(currentPage)}
                  className="px-4 sm:px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="w-full flex justify-center py-10">
                {/* Outer glow wrapper */}
                <div
                  className="
      relative rounded-xl w-full
      shadow-[0_0_80px_30px_rgba(245,158,11,0.35)]
    "
                >
                  {/* Inner white card */}
                  <div
                    className="
        bg-white rounded-xl
        px-8 py-6
      
        text-center
      "
                  >
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Customer Reviews
                    </h2>

                    <div className="flex justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-400 mb-4">
                      Be the first to write a review
                    </p>

                    <button className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition">
                      Write a review
                    </button>
                  </div>
                </div>
              </div>

            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {!hasReviewed && (
                    <div
                  className="
      relative rounded-xl w-full
      shadow-[0_0_80px_30px_rgba(245,158,11,0.35)]
    "
                >
                  {/* Inner white card */}
                  <div
                    className="
        bg-white rounded-xl
        px-8 py-6
      
        text-center
      "
                  >
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Customer Reviews
                    </h2>

                    <div className="flex justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* <p className="text-sm text-gray-400 mb-4">
                      Be the first to write a review
                    </p> */}

                    <button className="px-6 py-2 mt-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition">
                      Write a review
                    </button>
                  </div>
                </div>
                  )}

                  {orderedReviews?.map((review, index) => {
                    const media =
                      review.images ||

                      [];

                    return (
                      <div
                        key={review.id || review._id || index}
                        className="bg-white rounded-lg p-3 border border-slate-300 hover:border-cyan-400/40 transition"
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {(review.reviewerName || "U")[0].toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-1 gap-2">
                              <div className="min-w-0">
                                <h4 className="text-black font-semibold text-sm truncate">
                                  {review.reviewerName || "Anonymous"}
                                  {/* {review.isCurrentUser && (
                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                      You
                                    </span>
                                  )} */}
                                </h4>
                                <p className="text-black text-[11px]">
                                  {review.date || review.createdAt
                                    ? new Date(
                                      review.date || review.createdAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                    : "—"}
                                </p>
                              </div>

                              <StarRating rating={review.stars || 0} size={12} />
                            </div>
                            <h1 className="text-lg font-bold my-1">{review.title}</h1>
                            {/* Review text */}
                            <p className="text-black text-xs leading-snug mb-2">
                              {review.text ||
                                review.comment ||
                                review.review ||
                                "No review provided"}
                            </p>

                            {/* 🖼️ Media Section (Images / Videos) */}
                            {media.length > 0 && (
                              <div className="flex gap-2 mt-2 overflow-x-auto">
                                {media.map((url, i) =>
                                  url.endsWith(".mp4") ? (
                                    <video
                                      key={i}
                                      src={url}
                                      className="w-20 h-20 rounded-lg border object-cover"
                                      controls
                                    />
                                  ) : (
                                    <img
                                      key={i}
                                      src={url}
                                      alt="review"
                                      className="w-20 h-20 rounded-lg border object-cover cursor-pointer hover:scale-105 transition"
                                    />
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}


                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all font-bold shadow-lg text-sm sm:text-base
                            ${pageNum === currentPage
                              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white scale-105 sm:scale-110'
                              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400 px-1 sm:px-2 text-sm sm:text-base">...</span>
                        <button
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors font-bold bg-slate-700 text-gray-300 hover:bg-slate-600 shadow-lg text-sm sm:text-base"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>


      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          .product-swiper {
            height: 400px;
          }
        }
        @media (max-width: 639px) {
          .product-swiper {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}