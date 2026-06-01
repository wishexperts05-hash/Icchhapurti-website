import axios from 'axios';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

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

// Extracted Hooks & Components
import useInlineAuth from '../hooks/useInlineAuth';
import useAddressForm from '../hooks/useAddressForm';
import usePaymentApi from '../hooks/usePaymentApi';

import InlinePhoneAuth from '../components/Payment/InlinePhoneAuth';
import InlineAddressForm from '../components/Payment/InlineAddressForm';
import CheckoutOverlays from '../components/Payment/CheckoutOverlays';
import CheckoutButton from '../components/Payment/CheckoutButton';

export default function PaymentModal({ isOpen, onClose, country_name = 'India', countryCurrency = 'INR' }) {
    const { pathname } = useLocation();
    const { setCount } = useHeader();
    const Navigate = useNavigate();

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);

    const scrollToTop = useCallback(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    /* ── Orchestration State ── */
    const [referralCode, setReferralCode] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('razorpay');
    const [couponCode, setCouponCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addressIndex, setAddressesIndex] = useState(0);
    const [localCartItems, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [registerModal, setRegisterModal] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showWarning, setWarning] = useState(false);
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

    /* ── Helper: navigate to ThankYou ── */
    const goToThankYou = useCallback((paymentMethodLabel) => {
        setCount(0);
        onClose();
        Navigate('/thank-you', {
            state: {
                orderNumber: sessionStorage.getItem('orderNumber') || '',
                pinCode: payment.addresses[addressIndex ?? 0]?.pinCode || '',
                address: [
                    payment.addresses[addressIndex ?? 0]?.address,
                    payment.addresses[addressIndex ?? 0]?.city,
                    payment.addresses[addressIndex ?? 0]?.state,
                    payment.addresses[addressIndex ?? 0]?.pinCode,
                ].filter(Boolean).join(', '),
                paymentMethod: paymentMethodLabel || selectedMethod,
                grandTotal: payment.checkoutDetails?.grandTotal
                    ? `${payment.checkoutDetails.grandTotal}`
                    : '',
            },
            replace: true,
        });
        sessionStorage.removeItem('orderNumber');
    }, [Navigate, onClose, setCount, selectedMethod, addressIndex, () => payment?.addresses, () => payment?.checkoutDetails]);

    /* ── Hooks Wiring ── */
    const auth = useInlineAuth({
        setIsAuthenticated,
        onVerifySuccess: (data) => {
            if (data.refferralCode) {
                localStorage.setItem("referralCode", data.refferralCode);
                setReferralCode(data.refferralCode);
            }
        }
    });

    const payment = usePaymentApi({
        countryCurrency,
        country_name,
        cartItems,
        setCartItems,
        addressIndex,
        goToThankYou,
        onClose,
        scrollToTop,
        couponCode,
        setCouponCode,
        referralCode,
        setReferralCode,
        isAuthenticated,
        setShowAuthModal,
        selectedMethod,
        setSelectedMethod,
        setCurrentStep
    });

    const address = useAddressForm({
        fetchAddresses: payment.fetchAddresses,
        setAddressesIndex,
        setAuthStage: auth.setAuthStage,
        authStage: auth.authStage
    });

    /* ── Derived ── */
    const totalItems = useMemo(() =>
        cartItems.reduce((sum, item) => sum + Number(item.quantity), 0), [cartItems]);

    const paymentMethods = useMemo(() => [
        { id: 'wallet', name: "Wallet", balance: payment.balance, icon: 'wallet' },
        { id: 'razorpay', name: 'Online (Card/UPI/Netbanking)', icon: 'razorpay' },
    ], [payment.balance]);

    const displayItems = isAuthenticated ? cartItems : localCartItems || [];

    /* ── Page-Specific Effects ── */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            initializePaymentPage();
        } else {
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            setItems(cart);
            setIsAuthenticated(false);
            setInitialLoading(false);
        }
    }, [isAuthenticated]);

    const initializePaymentPage = async () => {
        setInitialLoading(true);
        setError(null);
        try {
            await Promise.all([payment.fetchBalance(), payment.fetchAddresses(), fetchCartData()]);
        } catch (err) {
            console.error('Initialization error:', err);
            setError('Failed to load payment page. Please try again.');
        } finally {
            setInitialLoading(false);
        }
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

    useEffect(() => {
        const script = document.createElement("script");
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            if (payment.addresses && payment.addresses.length > 0) {
                auth.setAuthStage('checkout');
            } else {
                auth.setAuthStage('add_address');
            }
        } else {
            auth.setAuthStage('phone');
        }
    }, [isAuthenticated, payment.addresses]);

    useEffect(() => {
        if (cartItems.length > 0) payment.fetchOffers();
    }, [cartItems]);

    useEffect(() => {
        if (isAuthenticated && cartItems.length > 0 && payment.addresses.length > 0) {
            payment.fetchCheckOutDetails();
        }
    }, [isAuthenticated, cartItems, couponCode, referralCode, addressIndex, payment.addresses]);

    useEffect(() => {
        if (!Array.isArray(payment.addresses) || payment.addresses.length === 0) return;
        const pinCode = payment.addresses[addressIndex ?? 0]?.pinCode;
        if (isAuthenticated && pinCode) payment.checkPincodeServiceability(pinCode);
    }, [addressIndex, payment.addresses, isAuthenticated]);

    useEffect(() => {
        setCurrentStep(payment.addresses?.length > 0 ? 2 : 1);
    }, [payment.addresses]);

    useEffect(() => { payment.fetchAddresses(); }, [addressIndex]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    /* ── Render ── */
    if (!isOpen) return null;

    if ((error || payment.error) && !payment.checkoutDetails && !isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-lg text-center">
                    <div className="w-10 h-10 text-red-500 mx-auto mb-3">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Error</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-5">{error || payment.error}</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={initializePaymentPage} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition cursor-pointer">
                            Try Again
                        </button>
                        <button onClick={() => { onClose(); Navigate('/cart'); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer">
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

            {/* Overlays */}
            <CheckoutOverlays
                initialLoading={initialLoading}
                checkoutLoading={payment.checkoutLoading}
                showWarning={showWarning}
                setWarning={setWarning}
                onWarningContinue={() => setWarning(false)}
                onWarningLeave={() => { payment.cancelledOrder(); setWarning(false); setCartSidebarOpen(true); onClose(); }}
                showCouponPopup={payment.showCouponPopup}
                setshowCouponPopup={payment.setshowCouponPopup}
                couponCode={couponCode}
                couponDiscount={payment.couponDiscount}
            />

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
                                        couponDiscount={payment.couponDiscount}
                                        isAuthenticated={isAuthenticated}
                                        setCartItems={setCartItems}
                                        setItems={setItems}
                                    />
                                )}

                                {/* Auth modals */}
                                <RegistrationModal isOpen={registerModal} onClose={() => setRegisterModal(false)} setIsAuthenticated={setIsAuthenticated} />
                                <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} setIsAuthenticated={setIsAuthenticated} />
                                <AddressModal
                                    addresses={payment.addresses}
                                    fetchAddresses={payment.fetchAddresses}
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    addressId={editAddressId}
                                    setAddressesIndex={setAddressesIndex}
                                />

                                {/* Inline Auth Flow (Guest) */}
                                {!isAuthenticated && (
                                    <InlinePhoneAuth
                                        authPhone={auth.authPhone}
                                        setAuthPhone={auth.setAuthPhone}
                                        authOtp={auth.authOtp}
                                        setAuthOtp={auth.setAuthOtp}
                                        authStage={auth.authStage}
                                        setAuthStage={auth.setAuthStage}
                                        authLoading={auth.authLoading}
                                        authError={auth.authError}
                                        setAuthError={auth.setAuthError}
                                        handleSendOtp={auth.handleSendOtp}
                                        handleVerifyOtp={auth.handleVerifyOtp}
                                    />
                                )}

                                {/* Inline Address Form Onboarding */}
                                {isAuthenticated && auth.authStage === 'add_address' && (
                                    <InlineAddressForm
                                        addressForm={address.addressForm}
                                        setAddressForm={address.setAddressForm}
                                        addressErrors={address.addressErrors}
                                        setAddressErrors={address.setAddressErrors}
                                        locationDropdown={address.locationDropdown}
                                        setLocationDropdown={address.setLocationDropdown}
                                        searchTerms={address.searchTerms}
                                        setSearchTerms={address.setSearchTerms}
                                        loadingStates={address.loadingStates}
                                        addressSaving={address.addressSaving}
                                        dropdownRefs={address.dropdownRefs}
                                        handleSelectCountryCode={address.handleSelectCountryCode}
                                        handleSelectCountry={address.handleSelectCountry}
                                        handleSelectState={address.handleSelectState}
                                        handleSelectCity={address.handleSelectCity}
                                        handleSaveAddress={address.handleSaveAddress}
                                        filteredCountryCodes={address.filteredCountryCodes}
                                        filteredCountries={address.filteredCountries}
                                        filteredStates={address.filteredStates}
                                        filteredCities={address.filteredCities}
                                    />
                                )}

                                {/* Address Section */}
                                {isAuthenticated && auth.authStage === 'checkout' && (
                                    <AddressSection
                                        addresses={payment.addresses}
                                        addressIndex={addressIndex}
                                        pincodeChecking={payment.pincodeChecking}
                                        pincodeServiceable={payment.pincodeServiceable}
                                        onChangeAddress={() => setIsModalOpen(true)}
                                        onAddAddress={() => setIsModalOpen(true)}
                                    />
                                )}

                                {/* Offers */}
                                {isAuthenticated && auth.authStage === 'checkout' && ((payment.offers?.length ?? 0) > 0 || (payment.spinOffers?.length ?? 0) > 0) && (payment.addresses?.length ?? 0) > 0 && (
                                    <OfferDisplay
                                        offers={payment.offers}
                                        spinOffers={payment.spinOffers}
                                        referralCode={referralCode}
                                        setCouponCode={setCouponCode}
                                        couponCode={couponCode}
                                        isAuthenticated={isAuthenticated}
                                    />
                                )}

                                {/* Checkout flow */}
                                {isAuthenticated && auth.authStage === 'checkout' && payment.checkoutDetails && payment.addresses.length > 0 && (
                                    <>
                                        <ReferralCode referralCode={referralCode} setReferralCode={setReferralCode} couponCode={couponCode} />

                                        {payment.referralCoins > 0 && (
                                            <div className="flex items-start gap-2 p-3 mt-2 border border-green-200 rounded-md bg-green-50">
                                                <div className="mt-0.5 text-lg">🪙</div>
                                                <div className="text-sm text-green-700">
                                                    <span className="font-semibold">Referral code <span className="uppercase">{referralCode}</span> applied.</span>{' '}
                                                    You'll earn <span className="font-semibold">{payment.referralCoins}</span> coins after completing this purchase.
                                                </div>
                                            </div>
                                        )}

                                        <PaymentMethods
                                            paymentMethods={paymentMethods}
                                            selectedMethod={selectedMethod}
                                            onSelect={setSelectedMethod}
                                        />

                                        <PriceBreakdown
                                            checkoutDetails={payment.checkoutDetails}
                                            totalItems={totalItems}
                                            couponDiscount={payment.couponDiscount}
                                        />

                                        {/* Checkout Button */}
                                        <CheckoutButton
                                            handleCheckout={payment.handleCheckout}
                                            isAuthenticated={isAuthenticated}
                                            checkoutLoading={payment.checkoutLoading}
                                            pincodeServiceable={payment.pincodeServiceable}
                                            selectedMethod={selectedMethod}
                                        />

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
                    <ErrorModal error={error || payment.error} onClose={() => { setError(''); payment.setError(''); }} />
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