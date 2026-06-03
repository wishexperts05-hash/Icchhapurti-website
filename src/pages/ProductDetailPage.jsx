import { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import {
  Star, ShoppingCart, Eye, Share2, X, Copy, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Package, Truck, ShieldCheck, RefreshCw, ChevronDown, Zap, Box
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useHeader } from '../context/HeaderContext';
import AddReviewModal from '../components/AddReviewModal';
import ProductImageGallery from '../components/ProductImageGallery';
import CartSidebar from '../components/CartSidebar';

const PaymentModal = lazy(() => import('./PaymentModal'));

import Review from '../components/Review';
const RefferalPaymentModal = lazy(() => import('./RefferalPaymentModal'));

import {
  GoldDivider, Badge, TrustItem, CheckItem, ChakraCard, HowCard,
  StarDisplay, LoadingState, ErrorState, ProductDetailsAccordion, ShareModal
} from '../components/ProductDetailPage/ProductDetailComponents';
import {
  GOLD, GOLD_LIGHT, DEEP, INK, MUTED, CREAM, GREEN, RED, BORDER,
  CHAKRAS, HOW_TO_STEPS, COMPARE_ROWS
} from '../components/ProductDetailPage/constants';

/* ─── Main Component ─── */
export default function ProductDetails({ countryCurrency, country }) {
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
  const { id, name } = useParams();
  const productId = id;
  const Navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [openReview, setOpenReview] = useState(false);

  const [searchParams] = useSearchParams();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const referralCode = searchParams.get('ref');
  const price = searchParams.get('price');
  const productImg = searchParams.get('productImg');
  const autoPay = searchParams.get('pay');

  useEffect(() => { if (autoPay) setOpenPaymentModal(true); }, [autoPay]);

  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const toggleFAQ = useCallback((id) => setOpenFAQ(prev => prev === id ? null : id), []);

  useEffect(() => { fetchProductDetails(); fetchProductReviews(); }, [productId]);
  useEffect(() => { if (product) fetchProductReviews(currentPage); }, [currentPage]);

  const fetchProductDetails = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/v1/products/productById/${productId}?currencyCode=${countryCurrency || 'INR'}`, {
        method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success && data.product) setProduct(data.product);
      else if (data.success && data.data) setProduct(data.data);
      else if (data.id || data._id) setProduct(data);
      else throw new Error('Invalid product data');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchProductReviews = async (page = 1) => {
    setReviewsLoading(true); setReviewsError(null);
    try {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/user`;
      const apiPath = token ? '' : '/v1';
      const res = await fetch(`${baseUrl}${apiPath}/reviews/getProductReviews/${productId}?page=${page}&limit=4`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setReviewsData(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (Array.isArray(data)) setReviews(data);
      else throw new Error('Invalid reviews data');
    } catch (err) { setReviewsError(err.message); }
    finally { setReviewsLoading(false); }
  };

  const handlePageChange = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  const extractPrice = (p) => {
    if (typeof p === 'number') return p;
    if (typeof p === 'string') return Number(p.replace(/[^0-9.]/g, ''));
    return 0;
  };

  const handleAddToCart = async ({ product, e, isBuyNow }) => {
    if (isBuyNow) setBuyingNow(true); else setAddingToCart(true);
    try {
      if (!token) {
        const cartItem = { productId: product._id || product.id, product: { _id: product._id || product.id, name: product.name, price: product.price, images: product.images, image: product.images?.[0] }, quantity: 1, totalAmount: product.price || 0, currencySymbol: product.currencySymbol || '₹' };
        const existing = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const idx = existing.findIndex(i => (i.productId || i.product._id) === cartItem.productId);
        if (idx > -1) { existing[idx].quantity += 1; existing[idx].totalAmount = existing[idx].quantity * Number(extractPrice(product.price)); }
        else existing.push(cartItem);
        localStorage.setItem('cartItems', JSON.stringify(existing));
        const total = existing.reduce((s, i) => s + i.quantity, 0);
        localStorage.setItem('cart', existing.length);
        setCount(existing.length);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: existing, count: total } }));
        setCartSidebarOpen(true);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/addToCart?currencyCode=${countryCurrency || 'INR'}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId: product._id || product.id, quantity: qty, totalAmount: (product.price || 0) * qty })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to add to cart');
        if (result.success) {
          setCount(result.data?.products?.length);
          if (isBuyNow) setOpenPayment(true);
          else { setCartSuccess(true); setTimeout(() => setCartSuccess(false), 2000); setCartSidebarOpen(true); }
        }
      }
    } catch { setCartSidebarOpen(true); }
    finally { setAddingToCart(false); setBuyingNow(false); }
  };

  const handleBuyNow = async (product) => {
    if (token) { await handleAddToCart({ product, isBuyNow: true }); return; }
    const cartItem = { productId: product._id || product.id, product: { _id: product._id || product.id, name: product.name, price: product.price, images: product.images, image: product.images?.[0] }, quantity: 1, totalAmount: product.price || 0 };
    const existing = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const idx = existing.findIndex(i => (i.productId || i.product._id) === cartItem.productId);
    if (idx > -1) { existing[idx].quantity += 1; existing[idx].totalAmount = existing[idx].quantity * product.price; }
    else existing.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(existing));
    const total = existing.reduce((s, i) => s + i.quantity, 0);
    localStorage.setItem('cart', total);
    setCount(total);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: existing, count: total } }));
    setOpenPayment(true);
  };

  const getUserData = () => { try { const u = localStorage?.getItem('user'); return u ? JSON.parse(u) : null; } catch { return null; } };
  const user = getUserData();
  const refferalCode = localStorage.getItem('referralCode');
  const shareUrl = product
    ? user
      ? `${window.location.origin}/product/${product?._id}/${product?.name}?pay=true&ref=${refferalCode}&price=${product?.price}&productImg=${product?.images[0]}`
      : `${window.location.origin}/product/${product?._id}/${product?.name}`
    : window.location.href;
  const shareTitle = product?.name || 'Check this product';

  const currentUserReview = reviews?.find(r => r.isCurrentUser);
  const hasReviewed = Boolean(currentUserReview);
  const orderedReviews = hasReviewed ? [currentUserReview, ...reviews.filter(r => !r.isCurrentUser)] : reviews;

  const getProductCategory = (productName) => {
    if (!productName) return 'pen';
    const lower = productName.toLowerCase();
    if (lower.includes('kit')) return 'kit';
    if (lower.includes('bracelet')) return 'bracelet';
    if (lower.includes('anklet')) return 'anklet';
    if (lower.includes('journal')) return 'journal';
    return 'pen';
  };

  const productCategory = getProductCategory(product?.name);
  const isSevenChakra = product?.name?.toLowerCase().includes('seven chakra');
  const isPyrite = product?.name?.toLowerCase().includes('pyrite');

  // "What you're getting" check items mapping
  const getWhatYouGet = (category, name) => {
    const isSeven = name?.toLowerCase().includes('seven chakra');
    const isPy = name?.toLowerCase().includes('pyrite');

    if (category === 'bracelet') {
      return [
        { strong: "100% authentic crystals", rest: "handpicked and polished to feel exceptionally premium and hold pure vibrational energy." },
        { strong: "Specially charged & energized", rest: "through Vedic Mantra Jaap, pure Herbs smudging, and powerful full moon rituals." },
        { strong: isSeven ? "7 Chakra alignment" : isPy ? "Pyrite abundance flow" : "High vibrational frequency", rest: isSeven ? "with seven unique gemstones acting as active energy receptors." : isPy ? "to attract wealth, luck, and block negative electromagnetic waves." : "to balance your aura and bring deep emotional calm." },
        { strong: "Comes with a Cleansing Plate", rest: name?.toLowerCase().includes('salenite') || name?.toLowerCase().includes('selenite') ? "to keep your bracelet constantly clear, purified, and at peak vibration." : "and a sacred ritual card to activate and program your crystal." },
        { strong: "Comfort-stretch design", rest: "handcrafted with high-durability elastic that fits most wrists comfortably." }
      ];
    }
    if (category === 'anklet') {
      return [
        { strong: "Genuine Pyrite Gemstone beads", rest: "known as the ultimate stone of wealth, luck, and protective energy shield." },
        { strong: "Energized & Blessed", rest: "through intense Vedic fire rituals and positive intention charging." },
        { strong: "Continuous Aura Defense", rest: "worn on the ankle to connect with the Root Chakra, providing ultimate grounding and protection." },
        { strong: "Spiritual & Elegant accessory", rest: "designed to match any outfit while working silently as your energy protector." },
        { strong: "Adjustable premium design", rest: "strong and durable clasp that sits comfortably on your ankle all day." }
      ];
    }
    if (category === 'journal') {
      return [
        { strong: "Premium 100+ GSM paper", rest: "luxuriously smooth sheets that prevent gel or ink bleed, letting your hand glide effortlessly." },
        { strong: "Sacred energetic blessing", rest: "individually blessed to serve as a pure, high-vibe container for your intentions and thoughts." },
        { strong: "Intention & Gratitude templates", rest: "comes with built-in daily prompts, Vedic mantras, and manifestation frameworks." },
        { strong: "Elegant cover with gold engravings", rest: "sacred design that turns journaling from a chore into a gorgeous, magical ritual." },
        { strong: "Lies completely flat", rest: "thread-bound spine opens up fully, giving you the best, stress-free writing experience." }
      ];
    }
    if (category === 'kit') {
      return [
        { strong: "Complete Manifestation System", rest: "combines writing, crystal energy, and sacred smudging in one stunning box." },
        { strong: "Vedic ritual-charged components", rest: "every item is smudged and blessed under specific astrological timings." },
        { strong: "Spiritual toolkit", rest: "includes premium pen, sacred crystal anchor, ritual card instructions, and cleansing tools." },
        { strong: "Step-by-step guidebook", rest: "makes high-level manifestation rituals easy and actionable for beginners." },
        { strong: "Exquisite keepsake packaging", rest: "perfectly organized and packed to make the ultimate self-care or spiritual gift." }
      ];
    }

    // Default: 'pen'
    return [
      { strong: "Specially charged & energized", rest: "through Mantra Jaap, Herbs & Minerals Smudging, and Moon rituals." },
      { strong: "Premium body", rest: "with spiritual engravings — feels incredibly sacred in your hand." },
      { strong: "Smooth-flow refillable ink", rest: "writes effortlessly, ensuring your hand never gets tired during rituals." },
      { strong: "Comes with a Manifestation Ritual Card", rest: "your detailed, step-by-step daily practice guide." },
      { strong: "Handcrafted, limited edition", rest: name?.toLowerCase().includes('seven chakra') ? "featuring 7 genuine, polished chakra crystals." : "crafted with elite materials so no two pens are identical." }
    ];
  };

  const whatYouGetItems = getWhatYouGet(productCategory, product?.name);

  // Manifestation Story (Below fold)
  const getStoryDetails = (category, name) => {
    const isSeven = name?.toLowerCase().includes('seven chakra');
    const isPy = name?.toLowerCase().includes('pyrite');

    if (category === 'bracelet' || category === 'anklet') {
      return {
        title: "A wearable shield of positive energy",
        subtitle: isPy ? "Ground your energy & attract pure abundance" : "A shield of light you wear every day",
        p1: isPy
          ? "Most people struggle to maintain an abundance mindset in stressful environments. Pyrite acts as a financial and energetic catalyst, constant contact keeping your mind focused on success."
          : "Every second, your environment bombards you with low-vibrational energy. Keeping premium, natural crystals in direct contact with your pulse points helps shield your aura from these leaks.",
        p2: "In ancient spiritual sciences, gemstones act as natural resonators. They do not create energy out of nothing; rather, they serve as cosmic tuning forks to align your personal vibrational rate.",
        p3: `This ${category} is not an ornament. It is an intentional tool — a physical and spiritual reminder of who you are, keeping you grounded and aligned throughout your day.`,
        boxTitle: isSeven ? "The 7 Gemstone Centres" : isPy ? "Pyrite: Stone of Fire" : "Crystal Energy Flow",
        boxContent: isSeven ? "seven_chakras" : isPy ? "pyrite_specs" : "crystal_specs"
      };
    }
    if (category === 'journal') {
      return {
        title: "A sacred space for your innermost dreams",
        subtitle: "The bridge between your thoughts and reality",
        p1: "A dream in your head is just a wish. Written down with focus, it becomes an instruction to your subconscious and the universe. Journaling is the first step of physical manifestation.",
        p2: "In Vedic traditions, the written word is called Akshara — that which is imperishable. Putting ink to paper forms a neurological and spiritual feedback loop that anchors your desires.",
        p3: "This journal is built to be your sacred space. Energized under auspicious hours, it holds the frequency of gratitude and creation, inviting you to write your own destiny daily.",
        boxTitle: isSeven ? "7 Chakras of Creativity" : "Daily Spiritual Focus",
        boxContent: isSeven ? "seven_chakras" : "journal_specs"
      };
    }
    if (category === 'kit') {
      return {
        title: "A complete system for ritual manifestation",
        subtitle: "A complete toolkit to activate your manifestations",
        p1: "True manifestation requires alignment of all levels — purification of your space, grounding of your body, clarity of your mind, and active projection of your intentions.",
        p2: "This kit combines the clearing power of sage/incense with the focusing power of the manifestation pen and the amplifier properties of natural crystals to create a complete ritual.",
        p3: "Stop trying to manifest in a cluttered environment. Cleanse your aura, light the sacred wood, write your intentions, and let the energized crystals hold your goals in place.",
        boxTitle: "Sacred Kit Elements",
        boxContent: "kit_specs"
      };
    }

    // Default: 'pen'
    return {
      title: "A tool that holds your energy while you write",
      subtitle: "Why this product is different",
      p1: "Most people set intentions once and forget. This pen changes the ritual. Every time you hold it, you return to presence — to your deepest desires.",
      p2: "In Vedic tradition, every act of writing is sacred — a conversation between your mind and the universe. Charged through multiple rituals, this pen becomes your daily anchor.",
      p3: "This is not a novelty item. This is a daily practice tool — the same way a mala is for chanting or a singing bowl is for meditation.",
      boxTitle: "The 7 Energy Centres",
      boxContent: "seven_chakras"
    };
  };

  const storyDetails = getStoryDetails(productCategory, product?.name);

  // Daily Ritual Instructions (How to Use)
  const getHowToSteps = (category) => {
    if (category === 'bracelet' || category === 'anklet') {
      return [
        { num: 1, title: 'Cleanse & Connect', body: `Before wearing, hold the ${category} in your hands. Breathe deeply and create a quiet, mindful space around you.` },
        { num: 2, title: 'Activate Intention', body: "Close your eyes and declare your intention in the present tense. E.g., 'I am surrounded by abundance and protection.'" },
        { num: 3, title: 'Wear with Presence', body: `Slip the ${category} onto your left side for receiving energy, or right side for action. Feel it anchor your intention.` },
        { num: 4, title: 'Recharge Regularly', body: "Place it on a Selenite plate or under moonlight once a week to clear accumulated negative energies and restore its natural vibration." },
      ];
    }
    if (category === 'kit') {
      return [
        { num: 1, title: 'Purify the Space', body: 'Light your sage or incense. Let the smoke cleanse your space, the crystals, and your mind of any stale energy.' },
        { num: 2, title: 'Hold & Align', body: 'Hold your manifestation pen and crystal. Take 3 deep breaths, aligning your energy with your highest desires.' },
        { num: 3, title: 'Write the Ritual', body: 'Use your manifestation card to write your intentions 3 times in your journal with absolute belief and focus.' },
        { num: 4, title: 'Integrate & Wear', body: 'Wear the crystal or place it on your altar. Express gratitude to the universe and let your manifestations manifest.' },
      ];
    }
    // Default / pen / journal
    return [
      { num: 1, title: 'Pause & Breathe', body: 'Hold the tool gently in both hands. Close your eyes. Take 3 deep breaths. Feel the weight and the warmth of its sacred energy.' },
      { num: 2, title: 'Set Your Intention', body: 'Before you write, clearly define what you want. Speak it in present tense as if it has already arrived.' },
      { num: 3, title: 'Write with Belief', body: 'Write your intention 3 times, slowly. Feel each word as truth. Present tense. Absolute certainty.' },
      { num: 4, title: 'Express Gratitude', body: 'End with gratitude. Then release. Don\'t obsess. Trust the process and take aligned action.' },
    ];
  };

  const howToSteps = getHowToSteps(productCategory);

  // Price comparison lasts value
  const getProductLastsValue = (category) => {
    if (category === 'pen') return 'Years (refillable)';
    if (category === 'journal') return 'Till full (premium pages)';
    if (category === 'bracelet' || category === 'anklet') return 'Lifetime (durable)';
    return 'Years of practice';
  };

  const productLastsValue = getProductLastsValue(productCategory);

  // Bottom CTA Mappings
  const getBottomCtaDetails = (category) => {
    if (category === 'pen') {
      return {
        title: "Ready to Write Your Reality?",
        sub: "Join thousands who have made intentional writing part of their daily practice.\nOrder today and receive your pen within 3–5 business days."
      };
    }
    if (category === 'journal') {
      return {
        title: "Ready to Journal Your Journey?",
        sub: "Join thousands who have unlocked clarity and abundance through energized journaling.\nOrder today and receive your journal within 3–5 business days."
      };
    }
    if (category === 'bracelet' || category === 'anklet') {
      return {
        title: "Ready to Wear Your Intentions?",
        sub: `Join thousands who protect their energy and align their aura with natural crystals.\nOrder today and receive your ${category} within 3–5 business days.`
      };
    }
    if (category === 'kit') {
      return {
        title: "Ready to Upgrade Your Spiritual Ritual?",
        sub: "Take your manifestation practice to the next level with our complete sacred system.\nOrder today and receive your kit within 3–5 business days."
      };
    }
    return {
      title: "Ready to Align Your Energy?",
      sub: "Join thousands who have integrated sacred tools into their daily practice.\nOrder today and receive yours within 3–5 business days."
    };
  };

  const bottomCtaDetails = getBottomCtaDetails(productCategory);

  const heroSubtext = (productCategory === 'bracelet' || productCategory === 'anklet')
    ? "Wear your intentions. Align your energy. Manifest with belief."
    : "Write your intentions. Align your energy. Manifest with belief.";


  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchProductDetails} onBack={() => Navigate(-1)} />;
  if (!product) return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <Package size={40} color={MUTED} style={{ marginBottom: 16 }} />
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: DEEP }}>Product Not Found</h3>
        <button onClick={() => Navigate(-1)} style={{ marginTop: 16, background: GOLD, color: DEEP, border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  );

  const savings = product.originalPrice ? product.originalPrice - extractPrice(product.price) : 0;
  const savePct = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
     
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: ${CREAM}; color: ${INK}; }
        .pd-product-wrap > div { min-width: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pd-btn-cart:hover { background: #2e1f0f !important; }
        .pd-btn-buy:hover { background: #b8952e !important; }
        .pd-btn-buy-big:hover { background: #b8952e !important; }
        .pd-faq-q:hover { color: ${GOLD} !important; }
        .pd-thumb:hover { opacity: 1 !important; border-color: ${GOLD} !important; }
        @media(max-width: 768px) {
          .pd-product-wrap { grid-template-columns: 1fr !important; gap: 28px !important; padding: 20px 16px !important; }
          .pd-story-block { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pd-how-grid { grid-template-columns: 1fr 1fr !important; }
          .pd-chakra-grid { grid-template-columns: repeat(4,1fr) !important; }
          .pd-compare-section { padding: 24px 16px !important; }
          .pd-review-grid { grid-template-columns: 1fr !important; }
          .pd-bottom-cta { padding: 28px 16px !important; }
          .pd-sticky-bar { display: flex !important; }
          .pd-trust-row { grid-template-columns: repeat(3,1fr) !important; }
          .pd-ann-bar { font-size: 11px !important; }
        }
        @media(min-width: 769px) { .pd-sticky-bar { display: none !important; } }
      `}</style>

      {/* Modals */}
      {openPaymentModal && (
        <Suspense fallback={null}>
          <RefferalPaymentModal productId={productId} refferalCode={referralCode} onClose={() => setOpenPaymentModal(false)}
            isOpen={openPaymentModal} productName={name} price={price} productImg={productImg}
            country_name={country} countryCurrency={countryCurrency} />
        </Suspense>
      )}
      {shareOpen && <ShareModal shareUrl={shareUrl} shareTitle={shareTitle} onClose={() => setShareOpen(false)} />}
      <CartSidebar isOpen={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} onCheckout={() => { setCartSidebarOpen(false); setOpenPayment(true); }} />
      {cartSidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(1px)', zIndex: 40 }} />}
      {openPayment && (
        <Suspense fallback={null}>
          <PaymentModal country_name={country} countryCurrency={countryCurrency} isOpen={openPayment} onClose={() => setOpenPayment(false)} />
        </Suspense>
      )}
      <AddReviewModal isOpen={openReview} onClose={() => setOpenReview(false)} productId={productId} fetchProductReviews={fetchProductReviews} />

      {/* Announcement Bar */}
      {/* <div className="pd-ann-bar" style={{ background: DEEP, color: GOLD_LIGHT, textAlign: 'center', fontSize: 12, letterSpacing: '.06em', padding: '9px 16px', fontWeight: 500 }}>
        🌟 FREE SHIPPING on prepaid orders &nbsp;·&nbsp; <span style={{ color: '#fff' }}>Use code CHAKRA10 for 10% off your first order</span>
      </div> */}

      {/* Back button */}
      {/* <div style={{ maxWidth: 1360, margin: '32px auto 0', padding: '0 24px' }}>
        <button onClick={() => Navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: GOLD, fontSize: 13, fontWeight: 500 }}>
          <ChevronLeft size={15} /> Back to Products
        </button>
      </div> */}

      {/* ─── Product Hero (2-col grid) ─── */}
      <div className="pd-product-wrap" style={{ maxWidth: 1360, backgroundColor: '#f5f4f1', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52, alignItems: 'start' }}>


        {/* LEFT: Images */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden', padding: 8 }}>
            <ProductImageGallery images={product.images || [product.image]} videos={product.videos || []} />
          </div>
          {/* Trust badges row */}
          <div className="pd-trust-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 16 }}>
            <TrustItem icon="🚚" label="Fast Delivery" />
            <TrustItem icon="🔒" label="Secure Payment" />
            <TrustItem icon="💎" label="Quality Product" />
          </div>
        </div>

        {/* RIGHT: Copy */}
        <div>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <Badge variant="gold">✦ Premium Spiritual Tool</Badge>
            <Badge variant="green">✔ 1000+ Trusted Users</Badge>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, lineHeight: 1.25, color: DEEP, marginBottom: 8 }}>
            {product.name || 'Untitled Product'}
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: MUTED, marginBottom: 16 }}>
            {heroSubtext}
          </p>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <StarDisplay rating={reviewData?.overallRating || 0} />
            <span style={{ fontSize: 13, color: MUTED }}>
              {reviewData?.overallRating || 0} · <a href="#reviews" style={{ color: GOLD, textDecoration: 'underline', textUnderlineOffset: 2 }}>{reviewData?.totalReviews || 0} verified reviews</a>
            </span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, color: DEEP }}>{product.price || 0}</span>
            {product.originalPrice && (
              <>
                <span style={{ fontSize: 18, color: MUTED, textDecoration: 'line-through', marginLeft: 8 }}>₹{product.originalPrice}</span>
                <span style={{ fontSize: 13, color: GREEN, fontWeight: 500, marginLeft: 6 }}>Save ₹{savings} ({savePct}% off)</span>
              </>
            )}
          </div>
          <p style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>MRP inclusive of all taxes</p>

          {/* Urgency inline */}
          <div style={{ background: '#FFF8E6', border: '1px solid #F0C040', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#7A5C00', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, flexShrink: 0, animation: 'blink 1.2s infinite', display: 'inline-block' }} />
            <span>Limited stock available · Order today, ships tomorrow</span>
          </div>

          {/* What you're getting */}
          <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: MUTED, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>What you're getting</div>
            {whatYouGetItems.map((item, idx) => (
              <CheckItem key={idx}><strong>{item.strong}</strong> {item.rest}</CheckItem>
            ))}
          </div>

          {/* Share */}
          <div style={{ marginBottom: 16 }}>
            <button onClick={() => setShareOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: GOLD, fontSize: 13, fontWeight: 500 }}>
              <Share2 size={14} /> Share this product
            </button>
          </div>

          {/* Product details accordion (desktop) */}
          {product?.productDetails?.length > 0 && (
            <div style={{ maxHeight: '42vh', overflowY: 'auto', marginBottom: 20, paddingRight: 4 }}>
              <ProductDetailsAccordion productDetails={product.productDetails} openFAQ={openFAQ} toggleFAQ={toggleFAQ} />
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <button
              className="pd-btn-cart"
              onClick={(e) => handleAddToCart({ product, e, isBuyNow: false })}
              disabled={addingToCart || cartSuccess || buyingNow}
              style={{ flex: 1, background: DEEP, color: GOLD_LIGHT, border: 'none', borderRadius: 8, padding: '16px 20px', fontSize: 15, fontWeight: 500, cursor: 'pointer', letterSpacing: '.03em', transition: 'background .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (addingToCart || buyingNow) ? 0.6 : 1 }}
            >
              {addingToCart ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Adding…</> : cartSuccess ? <><ShieldCheck size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
            </button>
            <button
              className="pd-btn-buy"
              onClick={() => handleBuyNow(product)}
              disabled={addingToCart || cartSuccess || buyingNow}
              style={{ flex: 1, background: GOLD, color: DEEP, border: 'none', borderRadius: 8, padding: '16px 20px', fontSize: 15, fontWeight: 500, cursor: 'pointer', letterSpacing: '.03em', transition: 'background .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: buyingNow ? 0.6 : 1 }}
            >
              {buyingNow ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</> : <><Zap size={16} /> Buy Now</>}
            </button>
          </div>

          {/* Payment trust */}
          <div style={{ fontSize: 12, color: MUTED, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
            {['UPI / Cards ', '100% Secure Checkout', 'Fast Delivery'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: GREEN, fontSize: 14 }}>✔</span> {t}
              </span>
            ))}
          </div>
        </div>
      </div>



      {/* ─── Banner ─── */}
      {product?.banner && (
        <div style={{ maxWidth: 1360, margin: '0 auto', overflow: 'hidden', marginBottom: 0 }}>
          <img src={product.banner} alt={`${product.name} banner`} style={{ height: 'auto', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* ─── Below-fold sections ─── */}
      <div style={{ maxWidth: 1360, margin: '0 auto', backgroundColor: '#FDFBF7', padding: '0 24px 60px' }}>



        {/* Manifestation Story */}
        <div className="pd-story-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 60 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 10 }}>{storyDetails.subtitle}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: DEEP, lineHeight: 1.3, marginBottom: 16 }}>
              {storyDetails.title}
            </h2>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 12, lineHeight: 1.8 }}>
              {storyDetails.p1}
            </p>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 12, lineHeight: 1.8 }}>
              {storyDetails.p2}
            </p>
            <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.8 }}>
              {storyDetails.p3}
            </p>
          </div>
          <div style={{ background: DEEP, borderRadius: 16, padding: '40px 32px', color: GOLD_LIGHT, textAlign: 'center' }}>
            <div style={{ fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>{storyDetails.boxTitle}</div>

            {storyDetails.boxContent === 'seven_chakras' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', margin: '16px 0' }}>
                {CHAKRAS.map(c => (
                  <div key={c.label} title={c.label} style={{ width: 28, height: 28, borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 500, color: '#fff' }}>
                    {c.label.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            )}

            {storyDetails.boxContent === 'pyrite_specs' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
                {["Wealth", "Protection", "Willpower", "Action", "Vitality"].map(attr => (
                  <div key={attr} style={{ background: 'rgba(201,168,76,0.15)', border: `1px solid ${GOLD}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, color: GOLD_LIGHT, fontWeight: 500 }}>
                    ✦ {attr}
                  </div>
                ))}
              </div>
            )}

            {storyDetails.boxContent === 'crystal_specs' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
                {["Selenite Cleanse", "Aura Healing", "Vibrational Shift", "Moon rituals"].map(attr => (
                  <div key={attr} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#fff', fontWeight: 500 }}>
                    ✦ {attr}
                  </div>
                ))}
              </div>
            )}

            {storyDetails.boxContent === 'journal_specs' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
                {["Daily Prompting", "Gratitude flow", "Clear Intentions", "Divine Anchor"].map(attr => (
                  <div key={attr} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#fff', fontWeight: 500 }}>
                    ✦ {attr}
                  </div>
                ))}
              </div>
            )}

            {storyDetails.boxContent === 'kit_specs' && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
                {["Pure Sage", "Intention Pen", "Power Crystal", "Ritual Cards"].map(attr => (
                  <div key={attr} style={{ background: 'rgba(251,246,227,0.1)', border: `1px solid ${GOLD}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, color: GOLD_LIGHT, fontWeight: 500 }}>
                    ✦ {attr}
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: 'italic', lineHeight: 1.5, marginTop: 16, color: GOLD_LIGHT }}>
              {productCategory === 'bracelet' && `"जैसे भीतर, वैसे बाहर —\nऊर्जा ही सब कुछ है।"`}
              {productCategory === 'anklet' && `"कदम जहाँ पड़ेंगे, वहाँ समृद्धि होगी।"`}
              {productCategory === 'kit' && `"संकल्प ही सृष्टि है।"`}
              {productCategory !== 'bracelet' && productCategory !== 'anklet' && productCategory !== 'kit' && `"जो लिखोगे, वो मिलेगा —\nबशर्ते यकीन हो।"`}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 8, fontStyle: 'italic' }}>
              {productCategory === 'bracelet' && '"As within, so without — energy is everything."'}
              {productCategory === 'anklet' && '"Wherever your feet tread, prosperity will follow."'}
              {productCategory === 'kit' && '"Your resolve is the creation of your reality."'}
              {productCategory !== 'bracelet' && productCategory !== 'anklet' && productCategory !== 'kit' && '"What you write, you shall receive — if you believe."'}
            </div>
          </div>
        </div>

        {isSevenChakra && (
          <>
            <GoldDivider />
            {/* Chakra Grid */}
            <div style={{ marginBottom: 60 }}>
              <div className="text-label" style={{ color: GOLD, marginBottom: 8 }}>The gemstones in your {productCategory}</div>
              <h2 className="text-h2" style={{ color: DEEP, marginBottom: 6 }}>7 Chakras. 7 Crystals. One {productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}.</h2>
              <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>Each stone is carefully selected for its vibrational frequency. When you {productCategory === 'bracelet' || productCategory === 'anklet' ? 'wear' : 'use'} it, all 7 align your energy centers.</p>
              <div className="pd-chakra-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10 }}>
                {CHAKRAS.map(c => <ChakraCard key={c.label} {...c} />)}
              </div>
            </div>
          </>
        )}

        {isPyrite && (
          <>
            <GoldDivider />
            <div style={{ marginBottom: 60 }}>
              <div className="text-label" style={{ color: GOLD, marginBottom: 8 }}>
                The Stone of Abundance
              </div>
              <h2 className="text-h2" style={{ color: DEEP, marginBottom: 6 }}>
                Pyrite. Power. Wealth. Protection.
              </h2>
              <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>
                Often called the 'Stone of Fire', Pyrite is a powerhouse of abundance and defensive shielding.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 16,
                }}
              >
                {[
                  { title: "Wealth Magnet", desc: "Attracts financial opportunities, lucky coincidences, and professional growth.", bg: "#F4D03F" },
                  { title: "Root Activation", desc: "Stimulates the Root and Solar Plexus chakras, grounding your presence and personal power.", bg: "#E67E22" },
                  { title: "Shielding", desc: "Formidably blocks negative vibes, emotional drainage, and environmental smog.", bg: "#C9A84C" },
                  { title: "Mental Focus", desc: "Fosters focus, drive, and the self-confidence needed to execute your biggest dreams.", bg: "#7A6F60" },
                ].map(p => (
                  <div
                    key={p.title}
                    style={{
                      background: '#fff',
                      border: `1px solid ${BORDER}`,
                      borderRadius: 12,
                      padding: '20px 16px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: p.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        margin: '0 auto 12px',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    >
                      ✦
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: DEEP,
                        marginBottom: 6,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <GoldDivider />

        {/* How to Use */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="text-label" style={{ color: GOLD, marginBottom: 8 }}>Your daily ritual</div>
          <h2 className="text-h2" style={{ color: DEEP, marginBottom: 6 }}>How to Use</h2>
          <p className="text-body" style={{ color: MUTED, marginBottom: 32 }}>A mindful 4-step process. Takes 5 minutes. Changes everything.</p>
          <div className="pd-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {howToSteps.map(s => <HowCard key={s.num} {...s} />)}
          </div>
        </div>

        <GoldDivider />

        {/* Price Comparison */}
        <div className="pd-compare-section" style={{ background: DEEP, borderRadius: 16, padding: '40px', marginBottom: 60 }}>
          <h2 className="text-h2" style={{ color: GOLD_LIGHT, marginBottom: 8 }}>Is it worth it?</h2>
          <p className="text-body" style={{ color: "rgba(255,255,255,.55)", marginBottom: 28 }}>Compare it with other spiritual tools and decide for yourself.</p>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr>{['Tool', 'Price', 'Daily use?', 'Ritual charged?', 'Lasts how long?'].map(h => (
                  <th key={h} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: GOLD, padding: '8px 12px', textAlign: 'left', borderBottom: `1px solid rgba(201,168,76,.25)` }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(r => (
                  <tr key={r.tool}>
                    <td style={{ padding: '12px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.07)', color: 'rgba(255,255,255,.45)' }}>{r.tool}</td>
                    <td style={{ padding: '12px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.07)', color: 'rgba(255,255,255,.45)' }}>{r.price}</td>
                    <td style={{ padding: '12px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.07)' }}><span style={{ color: r.daily ? '#5DB07A' : 'rgba(255,255,255,.3)' }}>{r.daily ? '✓' : '✗'}</span></td>
                    <td style={{ padding: '12px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.07)' }}><span style={{ color: r.chakra ? '#5DB07A' : 'rgba(255,255,255,.3)' }}>{r.chakra ? '✓' : '✗'}</span></td>
                    <td style={{ padding: '12px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,.07)', color: 'rgba(255,255,255,.45)' }}>{r.lasts}</td>
                  </tr>
                ))}
                <tr style={{ background: 'rgba(201,168,76,.1)' }}>
                  <td style={{ padding: '12px', fontSize: 13, color: GOLD_LIGHT, fontWeight: 500 }}>✦ {product.name}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: GOLD_LIGHT, fontWeight: 500 }}>{product.price}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#5DB07A', fontWeight: 500 }}>✓ daily</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#5DB07A', fontWeight: 500 }}>✓ fully</td>
                  <td style={{ padding: '12px', fontSize: 13, color: GOLD_LIGHT, fontWeight: 500 }}>{productLastsValue}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <GoldDivider />

        {/* ─── FAQ ─── */}
        {product?.faqs?.length > 0 && (
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: DEEP, marginBottom: 24 }}>Frequently Asked Questions</h2>
            {product.faqs.map((faq, index) => (
              <div key={index} style={{ borderBottom: `1px solid ${BORDER}`, padding: '16px 0' }}>
                <button
                  className="pd-faq-q"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{ width: '100%', background: 'none', border: 'none', fontWeight: 500, fontSize: 14, color: DEEP, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'left', transition: 'color .2s' }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={18} color={GOLD} style={{ flexShrink: 0, transform: openIndex === index ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>
                {openIndex === index && (
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, marginTop: 10 }}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── Bottom CTA ─── */}
        <div className="pd-bottom-cta" style={{ background: DEEP, borderRadius: 16, padding: '48px 40px', textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: GOLD_LIGHT, marginBottom: 8 }}>{bottomCtaDetails.title}</h2>
          <p className="text-body" style={{ color: "rgba(255,255,255,.55)", marginBottom: 28, whiteSpace: 'pre-line' }}>
            {bottomCtaDetails.sub}
          </p>
          <button
            className="pd-btn-buy-big"
            onClick={() => handleBuyNow(product)}
            style={{ display: 'inline-block', background: GOLD, color: DEEP, padding: '18px 48px', borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: 'pointer', border: 'none', letterSpacing: '.03em', marginBottom: 14, transition: 'background .2s' }}
          >
            ⚡ Buy Now — {product.price}
          </button>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={(e) => handleAddToCart({ product, e, isBuyNow: false })}
              style={{ background: 'transparent', border: `1px solid rgba(201,168,76,.4)`, color: GOLD_LIGHT, borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginLeft: 12 }}
            >
              🛒 Add to Cart
            </button>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            ✔ Secure Checkout &nbsp;·&nbsp; ✔ Ships in 24 hrs
          </div>
        </div>


        {/* ─── Reviews ─── */}
        <div id="reviews" style={{ marginBottom: 60 }}>
          {/* <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: DEEP, marginBottom: 28 }}>What Our Customers Say</h2> */}
          <Review
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
          {/* {!hasReviewed && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>Bought the product? Share your manifestation story ↓</p>
              <button onClick={() => setOpenReview(true)} style={{ background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '.04em' }}>
                Write a Review
              </button>
            </div>
          )} */}
        </div>


      </div >

      {/* ─── Sticky Mobile Bar ─── */}
      < div className="pd-sticky-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '12px 16px', zIndex: 100, gap: 10 }
      }>
        <button
          onClick={(e) => handleAddToCart({ product, e, isBuyNow: false })}
          disabled={addingToCart || buyingNow}
          style={{ flex: 1, background: DEEP, color: GOLD_LIGHT, border: 'none', borderRadius: 8, padding: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          🛒 Add to Cart
        </button>
        <button
          onClick={() => handleBuyNow(product)}
          disabled={addingToCart || buyingNow}
          style={{ flex: 1, background: GOLD, color: DEEP, border: 'none', borderRadius: 8, padding: 14, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
        >
          ⚡ Buy Now
        </button>
      </div >
    </>
  );
}