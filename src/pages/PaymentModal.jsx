import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCashCoin } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Lock, AlertCircle, CheckCircle, Package, CreditCard, Wallet, ArrowLeft, ArrowRight, ShieldCheck, Truck } from 'lucide-react';


import RegistrationModal from '../components/RegistrationModal';
import LoginModal from '../components/LoginModal';
import AddressModal from '../components/AddressModal';
import { AlertTriangle } from 'lucide-react';
import ErrorModal from '../components/ErrorModal';
import { useHeader } from '../context/HeaderContext';
import Confetti from "react-confetti";
import { X, Gift } from "lucide-react";
import ProgressOfferBar from '../components/ProgressOfferBar';
import CartSidebar from '../components/CartSidebar';
import OfferDisplay from '../components/OfferDisplay';
import ReferralCode from '../components/RefferalcodeBox';


export default function PaymentModal({ isOpen, onClose, country_name = "India", countryCurrency = "INR" }) {
    const { pathname } = useLocation();
    const { setCount } = useHeader();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // refferal section 
    const [referralCode, setReferralCode] = useState('');
    const [referralCoins, setRefferalCoin] = useState(0)
    const [selectedMethod, setSelectedMethod] = useState('razorpay');
    const [couponCode, setCouponCode] = useState("");
    const [balance, setBalance] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [checkoutDetails, setDetails] = useState(null);
    const [couponDiscount, setDiscount] = useState(0);
    const [showCouponPopup, setshowCouponPopup] = useState(false);
    const [offers, setOffers] = useState([])


    useEffect(() => {
        const referralValue = Number(
            String(couponDiscount).replace(/[₹,]/g, "")
        );


        if (referralValue > 0

        ) {
            setshowCouponPopup(true);

            const timer = setTimeout(() => {
                setshowCouponPopup(false);
            }, 10000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [couponDiscount,]);



    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);


    // Loading states
    const [initialLoading, setInitialLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);


    // Error and success states
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    const { t } = useTranslation();
    const Navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [addressIndex, setAddressesIndex] = useState(0)

    const paymentMethods = [
        { id: 'wallet', name: t('payment.methods.wallet'), balance: balance, icon: 'wallet' },
        { id: 'razorpay', name: 'Online (Card/UPI/Netbanking)', icon: 'razorpay' },
    ];


    const [localCartItems, setItems] = useState([])


    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            initializePaymentPage();
        } else {
            const cart = JSON.parse(localStorage.getItem("cartItems"))
            setItems(cart)
            setIsAuthenticated(false);
            setShowAuthModal(true);
            setInitialLoading(false);
        }
    }, [isAuthenticated]);


    useEffect(() => {
        if (cartItems.length > 0) {
            fetchOffers()
        }

    }, [cartItems])


    // Load Razorpay Script
    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const [orderToken, setOrderToken] = useState();
    const [registerModal, setRegisterModal] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);


    useEffect(() => {
        if (isAuthenticated && cartItems.length > 0 && addresses.length > 0) {
            fetchCheckOutDetails();
        }

    }, [isAuthenticated, cartItems, couponCode, referralCode, addressIndex])



    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        if (addresses.length > 0) {
            setCurrentStep(2);
        } else {
            setCurrentStep(1);
        }
    }, [addresses]);

    const initializePaymentPage = async () => {
        setInitialLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchBalance(),
                fetchCartData(),
                fetchAddresses()
            ]);
        } catch (err) {
            console.error("Initialization error:", err);
            setError("Failed to load payment page. Please try again.");
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchBalance = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            };

            const balanceRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
                { headers }
            );

            if (!balanceRes.ok) throw new Error('Failed to fetch balance');

            const balanceData = await balanceRes.json();
            setBalance(balanceData.data || 0);
        } catch (err) {
            console.error("Balance fetch failed:", err);
        }
    };

    const fetchCartData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems?currencyCode=${countryCurrency || "INR"}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch cart data');

            const data = await response.json();

            if (!data?.data || data.data?.length === 0) {
                throw new Error('Your cart is empty');
            }

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
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (data.success && data.data && data.data.length > 0) {
                setAddresses(data.data);
            } else {
                throw new Error('No delivery address found. Please add an address.');
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
            setError(error.message);
            throw error;
        }
    };

    const fetchCheckOutDetails = async () => {
        try {
            setCheckoutLoading(true)
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
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await res.json();

            if (data.success) {
                setDiscount(data.data.discountOff);
                setDetails(data.data);
                setRefferalCoin(data.data.referralCoinEarn)
                setOrderToken(data.orderToken);
                if (data.data.referralCode) {
                    setReferralCode(data.data.referralCode);
                }
            } else {
                throw new Error(data.message || "Failed to load checkout details");
            }
        } catch (error) {
            console.error("Error fetching checkout details:", error);
            setError(error.message);
        } finally {
            setCheckoutLoading(false);
        }
    };



    const createRazorpayOrder = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder?currency=${countryCurrency}&country_name=${country_name}`,
                {
                    orderToken,
                    paymentMethod: "Online"
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.data.success) {
                return res.data.razorpayDetails;
            } else {
                throw new Error(res.data.message || "Failed to create Razorpay order");
            }
        } catch (error) {
            console.error("Razorpay order creation failed:", error);
            throw error;
        }
    };

    const createWalletpayOrder = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder?currency=${countryCurrency}&country_name=${country_name}`,
                {
                    orderToken,
                    paymentMethod: "Wallet"
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.data.success) {
                setCurrentStep(3)
                setCheckoutSuccess(true);

                setCount(0);
                setTimeout(() => {
                    setCheckoutSuccess(false);
                    onClose();
                    Navigate('/orders');
                }, 5000);
            } else {
                throw new Error(res.data.message || "Failed to create order");
            }
        } catch (error) {
            console.error("Wallet order creation failed:", error);
            setError(error.response?.data?.message || error.message);
            throw error;
        }
    };

    const verifyRazorpayPayment = async (paymentData) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/orders/verifyPayment`,
                paymentData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.data.success;
        } catch (error) {
            console.error("Payment verification failed:", error);
            return false;
        }
    };

    const handleRazorpayPayment = async () => {
        try {
            const razorpayOrder = await createRazorpayOrder();

            const options = {
                key: razorpayOrder.key_id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'ICCHHAPURTI',
                description: 'Order Payment',
                image: "https://res.cloudinary.com/dld5dqpz8/image/upload/v1767092536/icchhaPurti_2_onw6az.png",
                order_id: razorpayOrder.razorpayOrderId,
                handler: async function (response) {
                    try {
                        const isVerified = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: razorpayOrder.orderId
                        });

                        if (isVerified) {
                            setCheckoutLoading(false);
                            setCheckoutSuccess(true);
                            setCount(0);
                            scrollToTop();
                            setTimeout(() => {
                                setCheckoutSuccess(false);
                                onClose();
                                Navigate('/orders');
                            }, 2000);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        setCheckoutLoading(false);
                        setError(err.message || 'Payment verification failed');
                        scrollToTop();
                        setTimeout(() => setError(null), 4000);
                    }
                },
                prefill: {
                    name: user.name || '',
                    email: user.email || '',
                    contact: user.phone || ''
                },
                notes: {
                    address: addresses[addressIndex || 0]?.address || ''
                },
                theme: {
                    color: '#F59E0B'
                },
                modal: {
                    ondismiss: function () {
                        setCheckoutLoading(false);
                        // setError('Payment cancelled by You');
                        // setTimeout(() => setError(null), 3000);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Razorpay payment error:", error);
            setError(error.message || 'Failed to initiate payment');
            setTimeout(() => setError(null), 4000);
            setCheckoutLoading(false);
            scrollToTop();
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        if (!cartItems.length) {
            alert(t('payment.alerts.cart_empty'));
            return;
        }

        if (!addresses[addressIndex || 0]) {
            alert('Please select a delivery address');
            scrollToTop();
            return;
        }

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
            console.error("Checkout Error:", error);
            const errorMsg = error.response?.data?.message || error.message || t('payment.alerts.something_wrong');
            setError(errorMsg);
            setTimeout(() => setError(null), 4000);
            setCheckoutLoading(false);
            scrollToTop();
        }
    };

    const fetchOffers = async () => {
        try {
            const productIds = cartItems.map(item => item.product._id)
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/orders/offers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ productIds }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch offers");
            }

            const data = await res.json();
            setOffers(data.data || []);
        } catch (err) {
            console.error("Error fetching offers:", err.message);
            setOffers([]);
        }
    };




    const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

    const [showWarning, setWarning] = useState()

    // Icon Components
    const WalletIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
    );

    const RazorpayIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3395FF">
            <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902z" />
        </svg>
    );

    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);


    if (!isOpen) return null;

    // Show critical error modal only for initialization errors
    if (error && !checkoutDetails && !isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-lg text-center">

                    {/* Icon */}
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900">
                        Payment Error
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 mt-2 mb-5">
                        {error}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={initializePaymentPage}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => {
                                onClose();
                                Navigate("/cart");
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                            Back to Cart
                        </button>
                    </div>

                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 z-[9999] h-screen backdrop-blur-[2px] bg-black/20  ">


            <CartSidebar
                isOpen={cartSidebarOpen}
                onClose={() => setCartSidebarOpen(false)}
            />

            {/* Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="relative flex items-center px-4 h-16 max-w-2xl mx-auto">
                    <button
                        onClick={() => setWarning(true)}
                        className="absolute left-4 text-black cursor-pointer hover:text-amber-400 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="mx-auto">
                        <img
                            src="/logo.png"
                            alt="Ichhapurti"
                            className="h-12 md:h-14"
                        />
                    </div>

                    <div className="absolute right-4">
                        <img src="/newyear2026ani.gif" alt="" className="h-20" />
                    </div>
                </div>
            </div>

            {/* Loading Modal - Fixed condition */}
            {(initialLoading || checkoutLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-transparent" />
                    <div className="relative z-10 bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                        <span className="text-sm font-semibold text-gray-900">
                            {initialLoading ? "Loading..." : "Processing..."}
                        </span>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {checkoutSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-4 max-w-xs w-full text-center shadow-md border border-green-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Payment completed!</h3>
                        <p className="text-gray-600 text-sm">Thank you for your purchase. Redirecting...</p>
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
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Leave Checkout?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your order is not complete yet. If you leave now, your items will remain in your cart.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setWarning(false)}
                                className="flex-1 px-4 py-2.5 bg-purple-900 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
                            >
                                Continue Checkout
                            </button>
                            <button
                                onClick={() => {
                                    setWarning(false);
                                    setCartSidebarOpen(true);
                                    onClose();
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Referral Popup */}
            {showCouponPopup && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-2">
                    <Confetti numberOfPieces={200} recycle={false} />

                    <div className="relative w-full max-w-xs bg-white rounded-xl shadow-lg p-4 text-center animate-scaleIn">
                        <button
                            onClick={() => setshowCouponPopup(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                        >
                            <X />
                        </button>

                        <div className="flex justify-center mb-2">
                            <div className="bg-green-100 text-green-600 p-3 rounded-full animate-bounce">
                                <Gift size={24} />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            🎉 Coupon {couponCode} Applied!
                        </h2>

                        <p className="text-gray-600 text-sm mb-2">
                            You just unlocked a special discount
                        </p>

                        <div className="text-2xl font-extrabold text-green-600 mb-2">
                            {couponDiscount} OFF
                        </div>

                        <button
                            onClick={() => setshowCouponPopup(false)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-sm transition"
                        >
                            Continue Checkout 🚀
                        </button>
                    </div>
                </div>
            )}


            <div className="relative z-10 h-[calc(100vh-4rem)] overflow-y-auto pt-[env(safe-area-inset-top)]">
                <div className="max-w-xl mx-auto">
                    <div className="bg-gray-50">
                        {/* Order Summary Section */}
                        <div className="mx-auto px-2 py-6">
                            <div className="bg-white rounded-lg px-1 shadow-sm overflow-hidden">

                                {<ProgressOfferBar confettiOrigin={{ x: 0.5, y: 0.2 }} currentStep={currentStep} />}

                                {(() => {
                                    let items = isAuthenticated ? cartItems : localCartItems || [];

                                    if (!items?.length) return null;

                                    const parseAmount = (amount) => Number(String(amount || 0).replace(/[^0-9.]/g, ""));
                                    const referral = Number(couponDiscount) || 0;

                                    const totalAmount = Math.max(
                                        items.reduce((sum, item) => sum + parseAmount(item.totalAmount), 0) - referral,
                                        0
                                    );

                                    const handleQuantityChange = (itemId, delta) => {
                                        const updatedItems = items.map((item) => {
                                            if (item._id === itemId) {
                                                const newQty = Math.max(item.quantity + delta, 1);
                                                return { ...item, quantity: newQty, totalAmount: newQty * parseAmount(item.product.price) };
                                            }
                                            return item;
                                        });
                                        if (isAuthenticated) setCartItems(updatedItems);
                                        else setItems(updatedItems);
                                    };

                                    return (
                                        <div className="border-b border-gray-50 bg-white text-sm">
                                            <div className="p-2">
                                                <div className="rounded-lg w-full overflow-hidden shadow-sm">
                                                    <div className="flex items-center justify-between p-2 border-b border-gray-100">
                                                        <h3 className="font-bold text-gray-900">
                                                            Order Details <span className="font-normal ml-1">({items.length} Items)</span>
                                                        </h3>
                                                    </div>

                                                    <div className="overflow-y-auto max-h-[35vh] p-2">
                                                        {items.map((item) => (
                                                            <div key={item._id} className="flex gap-2 p-2 border border-gray-100 rounded hover:shadow transition-shadow">
                                                                <img
                                                                    src={item.product?.image || item.product?.images?.[0]}
                                                                    alt={item.name}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                                                                    <div className="flex items-center justify-between mt-1">
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                onClick={() => handleQuantityChange(item._id, -1)}
                                                                                className="px-2 py-0.5 bg-gray-200 rounded"
                                                                            >−</button>
                                                                            <span className="px-2">{item.quantity}</span>
                                                                            <button
                                                                                onClick={() => handleQuantityChange(item._id, 1)}
                                                                                className="px-2 py-0.5 bg-gray-200 rounded"
                                                                            >+</button>
                                                                        </div>
                                                                        <p className="font-medium text-gray-900">{item?.totalAmount?.toLocaleString("en-IN")}</p>
                                                                    </div>
                                                                    {item.discount > 0 && <p className="text-green-600 font-medium">{item.discount}% OFF</p>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="border-t p-2 bg-gray-50">
                                                        {referral > 0 && (
                                                            <div className="flex justify-between text-green-600 text-xs">
                                                                <span>Discount</span>
                                                                <span>-{referral.toLocaleString("en-IN")}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between font-bold mt-1">
                                                            <span>Total</span>
                                                            <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Savings Banner */}
                                {/* {(() => {
                                    let savings = 0;
                                    const parseAmount = (amount) => {
                                        if (!amount) return 0;
                                        return Number(String(amount).replace(/[^0-9.]/g, ""));
                                    };

                                    const formatCurrency = (value) => `₹${value.toFixed(2)}`;
                                    if (isAuthenticated && checkoutDetails) {
                                        const referral = parseAmount(checkoutDetails.couponDiscount);
                                        savings = referral;
                                    }

                                    if (savings <= 0) return null;

                                    return (
                                        <div className="text-amber-500 border-l-4 border-amber-500 px-6 py-4 rounded-lg shadow-sm mb-4">
                                            <p className="text-amber-500 font-bold text-sm sm:text-base">
                                                🎉 Yay! You've saved{" "}
                                                <span className="font-bold">
                                                    {formatCurrency(savings)}
                                                </span>{" "}
                                                so far
                                            </p>
                                            <p className="text-amber-500 font-semibold text-xs mt-1">
                                                Extra savings applied automatically at checkout
                                            </p>
                                        </div>
                                    );
                                })()} */}

                                <RegistrationModal
                                    isOpen={registerModal}
                                    onClose={() => setRegisterModal(false)}
                                    setIsAuthenticated={setIsAuthenticated}
                                />
                                <LoginModal
                                    isOpen={isLoginModalOpen}
                                    onClose={() => setIsLoginModalOpen(false)}
                                    setIsAuthenticated={setIsAuthenticated}
                                />

                                <AddressModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    addressId={editAddressId}
                                    setAddressesIndex={setAddressesIndex}
                                />

                                {!isAuthenticated && (
                                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
                                        <div className="text-center space-y-2">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Continue to Checkout
                                            </h2>
                                            <p className="text-gray-600 text-sm">
                                                Choose how you'd like to proceed. It only takes a few seconds ✨
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                                                <ShieldCheck className="w-7 h-7 text-green-500 mx-auto mb-1" />
                                                <p className="text-gray-800 text-xs font-medium">Secure Payment</p>
                                            </div>

                                            <div className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                                                <Truck className="w-7 h-7 text-blue-500 mx-auto mb-1" />
                                                <p className="text-gray-800 text-xs font-medium">Fast Delivery</p>
                                            </div>

                                            <div className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                                                <Package className="w-7 h-7 text-amber-500 mx-auto mb-1" />
                                                <p className="text-gray-800 text-xs font-medium">Quality Product</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setRegisterModal(true)}
                                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                                        >
                                            Add Delivery Address & Continue
                                        </button>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-gray-200"></div>
                                            <span className="text-gray-400 text-xs uppercase">or</span>
                                            <div className="flex-1 h-px bg-gray-200"></div>
                                        </div>

                                        <button
                                            onClick={() => setIsLoginModalOpen(true)}
                                            className="w-full border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-4 rounded-xl transition-all hover:bg-gray-50"
                                        >
                                            I'm Already a Customer — Login
                                        </button>

                                        <p className="text-center text-xs text-gray-500">
                                            100% secure checkout • Easy returns • Trusted by thousands
                                        </p>
                                    </div>
                                )}

                                {isAuthenticated && addresses[addressIndex] && (
                                    <div className="mt-1 mb-3 rounded-lg border border-slate-300 p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 text-sm text-gray-800 leading-snug">
                                                <p>
                                                    <span className="text-gray-600">{t("cart.deliveryAddress.deliverTo")} </span>
                                                    <span className="font-semibold">
                                                        {addresses[addressIndex]?.fullName}
                                                    </span>
                                                </p>

                                                <p className="text-xs mt-0.5">
                                                    {addresses[addressIndex]?.street},{" "}
                                                    {addresses[addressIndex]?.city},{" "}
                                                    {addresses[addressIndex]?.state} –{" "}
                                                    {addresses[addressIndex]?.pinCode}
                                                </p>

                                                <p className="text-xs">
                                                    {addresses[addressIndex]?.country} ·{" "}
                                                    {t("cart.deliveryAddress.mobileNumber")}{" "}
                                                    {addresses[addressIndex]?.phoneNumber}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="shrink-0 text-xs font-medium cursor-pointer px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors whitespace-nowrap"
                                            >
                                                {t("cart.deliveryAddress.changeAddress")}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {
                                    offers.length > 0 && <OfferDisplay offers={offers}
                                        referralCode={referralCode}
                                        setCouponCode={setCouponCode}
                                        couponCode={couponCode}
                                        isAuthenticated={isAuthenticated} />
                                }

                                {isAuthenticated && checkoutDetails && (
                                    <>
                                        {/* <div className="my-2">
                                            {!showCoupon ? (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setCoupon(true)}
                                                        className="text-sm text-orange-400 hover:underline"
                                                    >
                                                        Enter a Coupon
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                        placeholder="Enter coupon code"
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                                                    />

                                                    <button
                                                        onClick={applyCoupon}
                                                        disabled={!couponCode.trim()}
                                                        className={`px-4 py-2 text-sm font-semibold rounded
          ${couponCode.trim()
                                                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            }
        `}
                                                    >
                                                        Apply
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setCoupon(false);
                                                            setCouponCode("");
                                                        }}
                                                        className="text-xs text-gray-400 hover:text-gray-600"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div> */}


                                        <ReferralCode
                                            referralCode={referralCode}
                                            setReferralCode={setReferralCode}
                                            couponCode={couponCode}
                                        />

                                        {/* refferal code applied */}

                                        {
                                            referralCoins > 0 && <div className="flex items-start gap-2 p-3 mt-2 border border-green-200 rounded-md bg-green-50">
                                                <div className="mt-0.5 text-lg">🪙</div>
                                                <div className="text-sm text-green-700">
                                                    <span className="font-semibold">
                                                        Referral code <span className="uppercase">{referralCode}</span> applied.
                                                    </span>{" "}
                                                    You’ll earn <span className="font-semibold">{referralCoins}</span> coins
                                                    after completing this purchase.
                                                </div>
                                            </div>

                                        }
                                        {/* Payment Methods */}
                                        <div className="my-4">
                                            <h3 className="text-black font-medium mb-2 flex items-center gap-2 text-sm">
                                                <CreditCard size={16} className="text-amber-400" />
                                                Payment Method
                                            </h3>

                                            <div className="rounded-lg overflow-hidden border border-slate-300">
                                                {paymentMethods.map((method, index) => (
                                                    <div
                                                        key={method.id}
                                                        onClick={() => setSelectedMethod(method.id)}
                                                        className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all hover:bg-slate-100
                                                                   ${index !== paymentMethods.length - 1 ? "border-b border-slate-200" : ""}
                                                                   ${selectedMethod === method.id ? "bg-amber-500/10" : ""}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center
                                                                       ${selectedMethod === method.id ? "bg-amber-500/20" : "bg-gray-100"}`}>
                                                                {method.icon === "wallet" && <WalletIcon className="w-4 h-4" />}
                                                                {method.icon === "razorpay" && <RazorpayIcon className="w-4 h-4" />}
                                                            </div>

                                                            <div className="leading-tight">
                                                                <span className="text-black text-sm font-medium">
                                                                    {method.name}
                                                                </span>

                                                                {method.balance !== undefined && (
                                                                    <div className="text-xs text-gray-500">
                                                                        ₹ {method.balance.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                                                                   ${selectedMethod === method.id ? "border-amber-500" : "border-gray-400"}`}>
                                                            {selectedMethod === method.id && (
                                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-slate-300 p-3 mb-4">
                                            <h3 className="text-black font-semibold text-base mb-2.5 flex items-center gap-2">
                                                <Package size={16} className="text-amber-400" />
                                                {t("payment.price_details.title")}
                                            </h3>

                                            <div className="space-y-1.5 text-sm">
                                                {/* Total Items */}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>{t("payment.price_details.total_items")}</span>
                                                    <span className="text-black font-medium">{totalItems}</span>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-dashed border-slate-200 my-1.5"></div>

                                                {/* Price */}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>{t("payment.price_details.price")}</span>
                                                    <span className="text-black font-medium">
                                                        {checkoutDetails?.totalAmount?.toLocaleString("en-IN") || 0}
                                                    </span>
                                                </div>

                                                {/* Discount Off */}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Discount Off</span>
                                                    <span className="text-green-600 font-medium">
                                                        -{checkoutDetails?.discountOff?.toLocaleString("en-IN") || 0}
                                                    </span>
                                                </div>

                                                {/* Referral Discount */}
                                                {/* <div className="flex justify-between text-gray-600">
                                                    <span>Referral Discount</span>
                                                    <span className="text-green-600 font-medium">
                                                        {(Number(String(couponDiscount || checkoutDetails?.couponDiscount || 0).replace(/[₹,\s]/g, ''))) > 0 && "-"}
                                                        {(couponDiscount || checkoutDetails?.couponDiscount || 0).toLocaleString("en-IN")}
                                                    </span>
                                                </div> */}

                                                {/* Divider */}
                                                <div className="border-t border-dashed border-slate-200 my-1.5"></div>

                                                {/* Price After Discount */}
                                                <div className="flex justify-between text-gray-700 font-medium">
                                                    <span>Price After Discount</span>
                                                    <span className="text-black">
                                                        {(() => {
                                                            const currencySymbol = String(checkoutDetails?.totalAmount || '').replace(/[\d,.\s]/g, '') || '';
                                                            const totalAmount = Number(String(checkoutDetails?.totalAmount || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                            const discountOff = Number(String(checkoutDetails?.discountOff || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                            // const couponDiscountAmount = Number(String(couponDiscount || checkoutDetails?.discountOff || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                            const afterDiscount = totalAmount - discountOff;
                                                            return `${currencySymbol}${afterDiscount.toFixed(2)}`;
                                                        })()}
                                                    </span>
                                                </div>

                                                {/* Base Price & GST Breakdown */}
                                                <div className="bg-slate-50 rounded-md p-2 space-y-1 text-xs">
                                                    <div className="flex justify-between text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-slate-400">├</span> Base Price
                                                        </span>
                                                        <span className="text-gray-700 font-medium">
                                                            {(() => {
                                                                const currencySymbol = String(checkoutDetails?.totalAmount || '').replace(/[\d,.\s]/g, '') || '';
                                                                const totalAmount = Number(String(checkoutDetails?.totalAmount || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                                const discountOff = Number(String(checkoutDetails?.discountOff || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                                // const couponDiscountAmount = Number(String(couponDiscount || checkoutDetails?.couponDiscount || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                                const afterDiscount = totalAmount - discountOff
                                                                const basePrice = afterDiscount - (afterDiscount * 18 / 118);
                                                                return `${currencySymbol}${basePrice.toFixed(2)}`;
                                                            })()}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-slate-400">└</span> GST (18%)
                                                        </span>
                                                        <span className="text-gray-700 font-medium">
                                                            {(() => {
                                                                const currencySymbol = String(checkoutDetails?.totalAmount || '').replace(/[\d,.\s]/g, '') || '';
                                                                const totalAmount = Number(String(checkoutDetails?.totalAmount || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                                const discountOff = Number(String(checkoutDetails?.discountOff || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                                // const couponDiscountAmount = Number(String(couponDiscount || checkoutDetails?.couponDiscount || 0).replace(/[₹$€£¥,\s]/g, ''));
                                                                const afterDiscount = totalAmount - discountOff
                                                                const gstAmount = (afterDiscount * 18) / 118;
                                                                return `${currencySymbol}${gstAmount.toFixed(2)}`;
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-dashed border-slate-200 my-1.5"></div>

                                                {/* Shipping */}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>{t("payment.price_details.shipping")}</span>
                                                    <span className="text-black font-medium">
                                                        +{checkoutDetails?.shippingCharge?.toLocaleString("en-IN") || 0}
                                                    </span>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-slate-300 my-2"></div>

                                                {/* Total Amount */}
                                                <div className="pt-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-black font-bold text-base">
                                                            {t("payment.price_details.total_amount")}
                                                        </span>
                                                        <span className="text-amber-500 font-bold text-lg">
                                                            {checkoutDetails?.grandTotal?.toLocaleString("en-IN") || 0}
                                                        </span>
                                                    </div>
                                                    {/* <div className="flex justify-end mt-0.5">
                <span className="text-xs text-gray-500 italic">
                    (GST 18% inclusive)
                </span>
            </div> */}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Checkout Button */}
                                        <button
                                            onClick={handleCheckout}
                                            disabled={!isAuthenticated || checkoutLoading}
                                            className="
    w-full max-w-md mx-auto cursor-pointer
    bg-gradient-to-r from-amber-500 to-orange-500
    hover:from-amber-600 hover:to-orange-600
    text-white font-semibold
    py-3 px-5
    rounded-lg
    flex items-center justify-center gap-2
    transition-all duration-300
    hover:shadow-md hover:shadow-amber-500/40
    disabled:opacity-50 disabled:cursor-not-allowed
    text-sm
  "
                                        >
                                            {checkoutLoading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>
                                                        {selectedMethod === "razorpay"
                                                            ? "Opening Payment Gateway..."
                                                            : "Processing Payment..."}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        {selectedMethod === "razorpay"
                                                            ? "Proceed To Payment"
                                                            : "Pay Now"}
                                                    </span>

                                                    {/* Payment Logos */}

                                                    {
                                                        selectedMethod === "razorpay" &&

                                                        <div className="flex items-center ml-1">
                                                            {[
                                                                { src: "/paytm.png", alt: "Paytm" },
                                                                { src: "/phonepay.jpg", alt: "PhonePe" },
                                                                { src: "/gpay.jpg", alt: "GPay" },
                                                            ].map((logo, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`w-6 h-6 rounded-full bg-white border border-white
              flex items-center justify-center
              ${index !== 0 ? "-ml-2" : ""}`}
                                                                >
                                                                    <img
                                                                        src={logo.src}
                                                                        alt={logo.alt}
                                                                        className="w-4 h-4 object-contain"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }


                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>


                                        {/* Additional Info */}
                                        <p className="text-center text-gray-400 text-sm mt-4">
                                            By placing this order, you agree to our terms and conditions
                                        </p>

                                        {selectedMethod === 'razorpay' && (
                                            <div className="text-center mt-3 flex items-center justify-center gap-2">
                                                <ShieldCheck size={16} className="text-green-400" />
                                                <p className="text-gray-400 text-xs">
                                                    Secured by Razorpay - All major cards, UPI & Netbanking accepted
                                                </p>
                                            </div>
                                        )}


                                    </>)

                                }




                            </div>
                        </div>
                    </div>



                    {/* Alert Messages */}
                    <ErrorModal
                        error={error}
                        onClose={() => setError("")}
                    />

                    {successMsg && (
                        <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-green-300 text-sm">{successMsg}</p>
                        </div>
                    )}


                </div>


            </div>

            <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}