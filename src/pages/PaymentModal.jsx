import axios from 'axios';
import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Loader2, Lock, AlertCircle, CheckCircle, Package,
    CreditCard, Wallet, ArrowLeft, ArrowRight, ShieldCheck, Truck
} from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { X, Gift } from 'lucide-react';

const Confetti = lazy(() => import('react-confetti'));

import RegistrationModal from '../components/RegistrationModal';
import LoginModal from '../components/LoginModal';
import AddressModal from '../components/AddressModal';
import ErrorModal from '../components/ErrorModal';
import ProgressOfferBar from '../components/ProgressOfferBar';
import CartSidebar from '../components/CartSidebar';
import OfferDisplay from '../components/OfferDisplay';
import ReferralCode from '../components/RefferalcodeBox';

import OrderSummary from '../components/Payment/OrderSummary';
import PriceBreakdown from '../components/Payment/PriceBreakdown';
import PaymentMethods from '../components/Payment/PaymentMethods';
import AddressSection from '../components/Payment/AddressSection';

import { useHeader } from '../context/HeaderContext';

export default function PaymentModal({ isOpen, onClose, country_name = 'India', countryCurrency = 'INR' }) {
    const { pathname } = useLocation();
    const { setCount } = useHeader();
    const Navigate = useNavigate();

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);

    const scrollToTop = useCallback(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    const user = useMemo(() => JSON.parse(localStorage.getItem('user') || '{}'), []);

    /* ── State ── */
    const [referralCode, setReferralCode] = useState('');
    const [referralCoins, setRefferalCoin] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState('razorpay');
    const [couponCode, setCouponCode] = useState('');
    const [balance, setBalance] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [checkoutDetails, setDetails] = useState(null);
    const [couponDiscount, setDiscount] = useState(0);
    const [showCouponPopup, setshowCouponPopup] = useState(false);
    const [offers, setOffers] = useState([]);
    const [spinOffers, setspinOffers] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [addressIndex, setAddressesIndex] = useState(0);
    const [pincodeServiceable, setPincodeServiceable] = useState(null);
    const [pincodeChecking, setPincodeChecking] = useState(false);
    const [localCartItems, setItems] = useState([]);
    const [orderToken, setOrderToken] = useState();
    const [registerModal, setRegisterModal] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showWarning, setWarning] = useState(false);
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

    /* ── Derived ── */
    const totalItems = useMemo(() =>
        cartItems.reduce((sum, item) => sum + Number(item.quantity), 0), [cartItems]);

    const paymentMethods = useMemo(() => [
        { id: 'wallet', name: "Wallet", balance, icon: 'wallet' },
        { id: 'razorpay', name: 'Online (Card/UPI/Netbanking)', icon: 'razorpay' },
    ], [balance]);

    /* ── Helper: navigate to ThankYou ── */
    const goToThankYou = useCallback((paymentMethodLabel) => {
        setCount(0);
        onClose();
        Navigate('/thank-you', {
            state: {
                orderNumber: sessionStorage.getItem('orderNumber') || '',
                pinCode: addresses[addressIndex ?? 0]?.pinCode || '',
                address: [
                    addresses[addressIndex ?? 0]?.address,
                    addresses[addressIndex ?? 0]?.city,
                    addresses[addressIndex ?? 0]?.state,
                    addresses[addressIndex ?? 0]?.pinCode,
                ].filter(Boolean).join(', '),
                paymentMethod: paymentMethodLabel || selectedMethod,
                grandTotal: checkoutDetails?.grandTotal
                    ? `${checkoutDetails.grandTotal}`
                    : '',
            },
            replace: true,
        });
        sessionStorage.removeItem('orderNumber');
    }, [addresses, addressIndex, selectedMethod, checkoutDetails, Navigate, onClose, setCount]);

    /* ── Effects ── */
    useEffect(() => {
        const referralValue = Number(String(couponDiscount).replace(/[₹,]/g, ''));
        if (referralValue > 0) {
            setshowCouponPopup(true);
            const timer = setTimeout(() => setshowCouponPopup(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [couponDiscount]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            initializePaymentPage();
        } else {
            const cart = JSON.parse(localStorage.getItem('cartItems'));
            setItems(cart);
            setIsAuthenticated(false);
            setShowAuthModal(true);
            setInitialLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (cartItems.length > 0) fetchOffers();
    }, [cartItems]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    useEffect(() => {
        if (isAuthenticated && cartItems.length > 0 && addresses.length > 0) {
            fetchCheckOutDetails();
        }
    }, [isAuthenticated, cartItems, couponCode, referralCode, addressIndex, addresses]);

    useEffect(() => {
        if (!Array.isArray(addresses) || addresses.length === 0) return;
        const pinCode = addresses[addressIndex ?? 0]?.pinCode;
        if (isAuthenticated && pinCode) checkPincodeServiceability(pinCode);
    }, [addressIndex, addresses, isAuthenticated]);

    useEffect(() => {
        setCurrentStep(addresses?.length > 0 ? 2 : 1);
    }, [addresses]);

    useEffect(() => { fetchAddresses(); }, [addressIndex]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    /* ── API calls ── */
    const initializePaymentPage = async () => {
        setInitialLoading(true);
        setError(null);
        try {
            await Promise.all([fetchBalance(), fetchAddresses(), fetchCartData()]);
        } catch (err) {
            console.error('Initialization error:', err);
            setError('Failed to load payment page. Please try again.');
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchBalance = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            };
            const balanceRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
                { headers }
            );
            if (!balanceRes.ok) throw new Error('Failed to fetch balance');
            const balanceData = await balanceRes.json();
            setBalance(balanceData.data || 0);
        } catch (err) { console.error('Balance fetch failed:', err); }
    };

    const fetchCartData = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/cart/cartItems?currencyCode=${countryCurrency || 'INR'}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response.ok) throw new Error('Failed to fetch cart data');
            const data = await response.json();
            if (!data?.data || data.data?.length === 0) throw new Error('Your cart is empty');
            setCartItems(data.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching cart:', err);
            throw err;
        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/address/getAllAddress`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await res.json();
            setAddresses(data.data);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            setError(error.message);
            throw error;
        }
    };

    const checkPincodeServiceability = async (pinCode) => {
        if (!pinCode) return;
        setPincodeChecking(true);
        setPincodeServiceable(null);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/shipping/check-pincode/${pinCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await res.json();
            setPincodeServiceable(data.serviceable === true);
        } catch (err) {
            console.error('Pincode check failed:', err);
            setPincodeServiceable(null);
        } finally {
            setPincodeChecking(false);
        }
    };

    const fetchCheckOutDetails = async () => {
        try {
            setCheckoutLoading(true);
            const items = cartItems.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
            }));
            const body = {
                items,
                shippingAddress: addresses[addressIndex || 0],
                ...(couponCode && { couponCode }),
                ...(referralCode && { referralCode }),
            };
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/orders/checkout?currency=${countryCurrency}&country_name=${country_name}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }
            );
            const data = await res.json();
            if (data.success) {
                setDiscount(data.data.discountOff);
                setDetails(data.data);
                setRefferalCoin(data.data.referralCoinEarn);
                setOrderToken(data.orderToken);
                if (data.data.referralCode) setReferralCode(data.data.referralCode);
            } else {
                throw new Error(data.message || 'Failed to load checkout details');
            }
        } catch (error) {
            console.error('Error fetching checkout details:', error);
            setError(error.message);
        } finally {
            setCheckoutLoading(false);
        }
    };

    const createRazorpayOrder = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder?currency=${countryCurrency}&country_name=${country_name}`,
            { orderToken, paymentMethod: 'Online' },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
        );
        if (res.data.success) {
            sessionStorage.setItem('orderNumber', res.data.razorpayDetails.orderNumber);
            return res.data.razorpayDetails;
        }
        throw new Error(res.data.message || 'Failed to create Razorpay order');
    };

    const createWalletpayOrder = async () => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder?currency=${countryCurrency}&country_name=${country_name}`,
            { orderToken, paymentMethod: 'Wallet' },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
        );
        if (res.data.success) {
            setCurrentStep(3);
            // ── Navigate to ThankYou page instead of showing success modal ──
            goToThankYou('Wallet');
        } else {
            throw new Error(res.data.message || 'Failed to create order');
        }
    };

    const verifyRazorpayPayment = async (paymentData) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/orders/verifyPayment`,
                paymentData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            return res.data.success;
        } catch (error) {
            console.error('Payment verification failed:', error);
            return false;
        }
    };

    const handleRazorpayPayment = useCallback(async () => {
        const razorpayOrder = await createRazorpayOrder();
        const options = {
            key: razorpayOrder.key_id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'ICCHHAPURTI',
            description: 'Order Payment',
            image: 'https://res.cloudinary.com/dld5dqpz8/image/upload/v1767092536/icchhaPurti_2_onw6az.png',
            order_id: razorpayOrder.razorpayOrderId,
            handler: async (response) => {
                try {
                    const isVerified = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: razorpayOrder.orderId
                    });
                    if (isVerified) {
                        setCheckoutLoading(false);
                        scrollToTop();
                        // ── Navigate to ThankYou page instead of showing success modal ──
                        goToThankYou('Online (Card / UPI)');
                    } else {
                        throw new Error('Payment verification failed');
                    }
                } catch (err) {
                    setCheckoutLoading(false);
                    setError(err.message || 'Payment verification failed');
                    scrollToTop();
                    setTimeout(() => setError(null), 5000);
                }
            },
            prefill: { name: user.name || '', email: user.email || '', contact: user.phone || '' },
            notes: { address: addresses[addressIndex || 0]?.address || '' },
            theme: { color: '#F59E0B' },
            modal: { ondismiss: () => setCheckoutLoading(false) }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }, [orderToken, addresses, addressIndex, user, scrollToTop, goToThankYou]);

    const handleCheckout = useCallback(async () => {
        if (!isAuthenticated) { setShowAuthModal(true); return; }
        if (!cartItems.length) { alert("Cart is empty!"); return; }
        if (!addresses[addressIndex || 0]) { alert("Please select a delivery address"); scrollToTop(); return; }

        setCheckoutLoading(true);
        setError(null);
        try {
            if (selectedMethod === 'razorpay') {
                await handleRazorpayPayment();
            } else if (selectedMethod === 'wallet') {
                const finalAmount = (checkoutDetails?.grandTotal || 0) - (couponDiscount || 0);
                if (balance < finalAmount) {
                    setError('Insufficient wallet balance');
                    setCheckoutLoading(false);
                    scrollToTop();
                    return;
                }
                await createWalletpayOrder();
            }
        } catch (error) {
            console.error('Checkout Error:', error);
            setError(error.response?.data?.message || error.message || "Something went wrong!");
            setTimeout(() => setError(null), 4000);
            setCheckoutLoading(false);
            scrollToTop();
        }
    }, [isAuthenticated, cartItems, addresses, addressIndex, selectedMethod, balance, checkoutDetails, couponDiscount, scrollToTop, handleRazorpayPayment]);

    const fetchOffers = async () => {
        try {
            const productIds = cartItems.map(item => item.product._id);
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/orders/offers`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ productIds }),
                }
            );
            if (!res.ok) throw new Error('Failed to fetch offers');
            const data = await res.json();
            setOffers(data.data.offers || []);
            setspinOffers(data.data.spinRewards || []);
        } catch (err) {
            console.error('Error fetching offers:', err.message);
            setOffers([]);
        }
    };

    const cancelledOrder = useCallback(async () => {
        const orderId = sessionStorage.getItem('orderNumber');
        if (!orderId) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/orders/order-cancelled`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ orderId }),
            });
            const data = await res.json();
            if (data.success) sessionStorage.removeItem('orderNumber');
        } catch (error) { console.error('Cancel order error:', error.message); }
    }, []);

    /* ── Early returns ── */
    if (!isOpen) return null;

    if (error && !checkoutDetails && !isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-lg text-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment Error</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-5">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={initializePaymentPage} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition">
                            Try Again
                        </button>
                        <button onClick={() => { onClose(); Navigate('/cart'); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const displayItems = isAuthenticated ? cartItems : localCartItems || [];

    return (
        <div className="fixed inset-0 z-[9999] h-screen backdrop-blur-[2px] scroll-smooth bg-black/20">

            <CartSidebar isOpen={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />

            {/* Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="relative flex items-center px-4 h-16 max-w-2xl mx-auto">
                    <button onClick={() => setWarning(true)} className="absolute left-4 text-black cursor-pointer hover:text-amber-400 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="mx-auto">
                        <img src="/logo.png" alt="Ichhapurti" className="h-12 md:h-14" />
                    </div>
                    <div className="absolute right-4">
                        <img src="/newyear2026ani.gif" alt="" className="h-20" />
                    </div>
                </div>
            </div>

            {/* Loading overlay */}
            {(initialLoading || checkoutLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-transparent" />
                    <div className="relative z-10 bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                        <span className="text-sm font-semibold text-gray-900">
                            {initialLoading ? 'Loading...' : 'Processing...'}
                        </span>
                    </div>
                </div>
            )}

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Leave Checkout?</h3>
                                <p className="text-gray-600 text-sm">Your order is not complete yet. If you leave now, your items will remain in your cart.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setWarning(false)} className="flex-1 px-4 py-2.5 bg-purple-900 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors">
                                Continue Checkout
                            </button>
                            <button
                                onClick={() => { cancelledOrder(); setWarning(false); setCartSidebarOpen(true); onClose(); }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupon Popup */}
            {showCouponPopup && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-2">
                    <Suspense fallback={null}>
                        <Confetti numberOfPieces={100} recycle={false} />
                    </Suspense>
                    <div className="relative w-full max-w-xs bg-white rounded-xl shadow-lg p-4 text-center">
                        <button onClick={() => setshowCouponPopup(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black"><X /></button>
                        <div className="flex justify-center mb-2">
                            <div className="bg-green-100 text-green-600 p-3 rounded-full animate-bounce"><Gift size={24} /></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">🎉 Coupon {couponCode} Applied!</h2>
                        <p className="text-gray-600 text-sm mb-2">You just unlocked a special discount</p>
                        <div className="text-2xl font-extrabold text-green-600 mb-2">{couponDiscount} OFF</div>
                        <button onClick={() => setshowCouponPopup(false)} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-sm transition">
                            Continue Checkout 🚀
                        </button>
                    </div>
                </div>
            )}

            {/* Main scroll area */}
            <div className="relative z-10 h-[calc(100vh-4rem)] overflow-y-auto pt-[env(safe-area-inset-top)]">
                <div className="max-w-xl mx-auto">
                    <div className="bg-gray-50">
                        <div className="mx-auto px-2 py-6">
                            <div className="bg-white rounded-lg px-1 shadow-sm overflow-hidden">

                                <ProgressOfferBar confettiOrigin={{ x: 0.5, y: 0.2 }} currentStep={currentStep} />

                                {/* Order Summary */}
                                {displayItems.length > 0 && (
                                    <OrderSummary
                                        items={displayItems}
                                        couponDiscount={couponDiscount}
                                        isAuthenticated={isAuthenticated}
                                        setCartItems={setCartItems}
                                        setItems={setItems}
                                    />
                                )}

                                {/* Auth modals */}
                                <RegistrationModal isOpen={registerModal} onClose={() => setRegisterModal(false)} setIsAuthenticated={setIsAuthenticated} />
                                <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} setIsAuthenticated={setIsAuthenticated} />
                                <AddressModal
                                    addresses={addresses}
                                    fetchAddresses={fetchAddresses}
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    addressId={editAddressId}
                                    setAddressesIndex={setAddressesIndex}
                                />

                                {/* Unauthenticated CTA */}
                                {!isAuthenticated && (
                                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
                                        <div className="text-center space-y-2">
                                            <h2 className="text-2xl font-bold text-gray-900">Continue to Checkout</h2>
                                            <p className="text-gray-600 text-sm">Choose how you'd like to proceed. It only takes a few seconds ✨</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { icon: <ShieldCheck className="w-7 h-7 text-green-500 mx-auto mb-1" />, label: 'Secure Payment' },
                                                { icon: <Truck className="w-7 h-7 text-blue-500 mx-auto mb-1" />, label: 'Fast Delivery' },
                                                { icon: <Package className="w-7 h-7 text-amber-500 mx-auto mb-1" />, label: 'Quality Product' },
                                            ].map(({ icon, label }) => (
                                                <div key={label} className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                                                    {icon}
                                                    <p className="text-gray-800 text-xs font-medium">{label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setRegisterModal(true)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md hover:shadow-lg">
                                            Add Delivery Address &amp; Continue
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-gray-200"></div>
                                            <span className="text-gray-400 text-xs uppercase">or</span>
                                            <div className="flex-1 h-px bg-gray-200"></div>
                                        </div>
                                        <button onClick={() => setIsLoginModalOpen(true)} className="w-full border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-4 rounded-xl transition-all hover:bg-gray-50">
                                            I'm Already a Customer — Login
                                        </button>
                                        <p className="text-center text-xs text-gray-500">100% secure checkout • Easy returns • Trusted by thousands</p>
                                    </div>
                                )}

                                {/* Address Section */}
                                {isAuthenticated && (
                                    <AddressSection
                                        addresses={addresses}
                                        addressIndex={addressIndex}
                                        pincodeChecking={pincodeChecking}
                                        pincodeServiceable={pincodeServiceable}
                                        onChangeAddress={() => setIsModalOpen(true)}
                                        onAddAddress={() => setIsModalOpen(true)}
                                    />
                                )}

                                {/* Offers */}
                                {((offers?.length ?? 0) > 0 || (spinOffers?.length ?? 0) > 0) && (addresses?.length ?? 0) > 0 && (
                                    <OfferDisplay
                                        offers={offers}
                                        spinOffers={spinOffers}
                                        referralCode={referralCode}
                                        setCouponCode={setCouponCode}
                                        couponCode={couponCode}
                                        isAuthenticated={isAuthenticated}
                                    />
                                )}

                                {/* Checkout flow (authenticated + checkout details ready) */}
                                {isAuthenticated && checkoutDetails && addresses.length > 0 && (
                                    <>
                                        <ReferralCode referralCode={referralCode} setReferralCode={setReferralCode} couponCode={couponCode} />

                                        {referralCoins > 0 && (
                                            <div className="flex items-start gap-2 p-3 mt-2 border border-green-200 rounded-md bg-green-50">
                                                <div className="mt-0.5 text-lg">🪙</div>
                                                <div className="text-sm text-green-700">
                                                    <span className="font-semibold">Referral code <span className="uppercase">{referralCode}</span> applied.</span>{' '}
                                                    You'll earn <span className="font-semibold">{referralCoins}</span> coins after completing this purchase.
                                                </div>
                                            </div>
                                        )}

                                        <PaymentMethods
                                            paymentMethods={paymentMethods}
                                            selectedMethod={selectedMethod}
                                            onSelect={setSelectedMethod}
                                        />

                                        <PriceBreakdown
                                            checkoutDetails={checkoutDetails}
                                            totalItems={totalItems}
                                            couponDiscount={couponDiscount}
                                        />

                                        {/* Checkout Button */}
                                        <button
                                            onClick={handleCheckout}
                                            disabled={!isAuthenticated || checkoutLoading || pincodeServiceable === false}
                                            className="w-full max-w-md mx-auto cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {checkoutLoading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>{selectedMethod === 'razorpay' ? 'Opening Payment Gateway...' : 'Processing Payment...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{selectedMethod === 'razorpay' ? 'Proceed To Payment' : 'Pay Now'}</span>
                                                    {selectedMethod === 'razorpay' && (
                                                        <div className="flex items-center ml-1">
                                                            {[
                                                                { src: '/paytm.png', alt: 'Paytm' },
                                                                { src: '/phonepay.jpg', alt: 'PhonePe' },
                                                                { src: '/gpay.jpg', alt: 'GPay' },
                                                            ].map((logo, i) => (
                                                                <div key={i} className={`w-6 h-6 rounded-full bg-white border border-white flex items-center justify-center ${i !== 0 ? '-ml-2' : ''}`}>
                                                                    <img src={logo.src} alt={logo.alt} className="w-4 h-4 object-contain" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-gray-400 text-sm mt-4">
                                            By placing this order, you agree to our terms and conditions
                                        </p>

                                        {selectedMethod === 'razorpay' && (
                                            <div className="text-center mt-3 flex items-center justify-center gap-2">
                                                <ShieldCheck size={16} className="text-green-400" />
                                                <p className="text-gray-400 text-xs">Secured by Razorpay – All major cards, UPI &amp; Netbanking accepted</p>
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Error / Success alerts */}
                    <ErrorModal error={error} onClose={() => setError('')} />
                    {successMsg && (
                        <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-green-300 text-sm">{successMsg}</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down { animation: slide-down 0.3s ease-out; }
            `}</style>
        </div>
    );
}