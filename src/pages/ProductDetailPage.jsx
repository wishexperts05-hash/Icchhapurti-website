import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, Share2, X, Copy, ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zap } from 'lucide-react';
import { useHeader } from '../context/HeaderContext';
import AddReviewModal from '../components/AddReviewModal';
import { Box } from 'lucide-react';

import { ChevronDown } from 'lucide-react';
import ProductImageGallery from '../components/ProductImageGallery';
import CartSidebar from '../components/CartSidebar';
import PaymentModal from './PaymentModal';
import { BsFacebook, BsInstagram, BsWhatsapp } from 'react-icons/bs';
import { PiPinterestLogo } from 'react-icons/pi';
import Review from '../components/Review';

export default function ProductDetails({ countryCurrency , country }) {
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
        "This pen is specially charged and activated with multiple processes and rituals like  Mantra Jaap, Herbs and Minerals Smudging Mantras , Chanting, Moon Charging, and many more rituals."
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



  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/v1/products/productById/${productId}?currencyCode=${countryCurrency || "INR"}`, {
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
        openPayment && <PaymentModal country_name={country} countryCurrency={countryCurrency} isOpen={openPayment} onClose={() => setOpenPayment(false)} />
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





          <Review
            // StarRating={StarRating}
            reviewData={reviewData}
            totalPages={totalPages}
            fetchProductReviews={fetchProductReviews}
            reviews={reviews}
            setOpenReview={setOpenReview}
            orderedReviews={orderedReviews}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            reviewsError={reviewsError}
            reviewsLoading={reviewsLoading}
            hasReviewed={hasReviewed}
          />


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