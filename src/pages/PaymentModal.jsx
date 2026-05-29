import axios from 'axios';
import { useEffect, useState, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Loader2, Lock, AlertCircle, CheckCircle, Package,
    CreditCard, Wallet, ArrowLeft, ArrowRight, ShieldCheck, Truck,
    Search, ChevronDown
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

const SearchableDropdown = ({
    field, label, placeholder, options, value,
    onSelect, disabled, renderOption, getOptionValue, isLoading,
    openDropdown, setOpenDropdown, searchTerms, setSearchTerms, dropdownRefs, errors
}) => (
    <div ref={el => dropdownRefs.current[field] = el} className="relative">
        <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">{label} *</label>
        <div className={disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
            <div
                onClick={() => !disabled && !isLoading && setOpenDropdown(openDropdown === field ? null : field)}
                className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 cursor-pointer flex items-center justify-between hover:border-gray-900 focus:outline-none transition-all ${errors[field] ? 'ring-2 ring-red-500' : ''}`}
            >
                <span className={value ? 'text-gray-900 text-sm' : 'text-gray-400 text-sm'}>
                    {isLoading ? 'Loading...' : (value || placeholder)}
                </span>
                {isLoading
                    ? <div className="w-4 h-4 border-2 border-gray-400/40 border-t-gray-600 rounded-full animate-spin" />
                    : <ChevronDown className="w-4 h-4 text-gray-500" />
                }
            </div>

            {openDropdown === field && !disabled && !isLoading && (
                <div
                    className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-hidden"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative flex items-center bg-gray-50 rounded-lg px-2 border border-gray-200">
                            <Search className="w-4 h-4 text-gray-400 pointer-events-none mr-2" />
                            <input
                                type="text"
                                value={searchTerms[field] || ''}
                                onChange={(e) => setSearchTerms(prev => ({ ...prev, [field]: e.target.value }))}
                                placeholder={`Search ${label.toLowerCase()}...`}
                                className="w-full bg-transparent py-1.5 text-xs text-gray-900 outline-none focus:ring-0"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-gray-500 text-center">No results found</div>
                        ) : (
                            options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onMouseDown={(e) => { e.preventDefault(); onSelect(getOptionValue(option)); }}
                                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-xs text-gray-900 transition-colors"
                                >
                                    {renderOption(option)}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        {errors[field] && <p className="text-red-500 text-[10px] mt-1">{errors[field]}</p>}
    </div>
);

export default function PaymentModal({ isOpen, onClose, country_name = 'India', countryCurrency = 'INR' }) {
    const { pathname } = useLocation();
    const { setCount } = useHeader();
    const Navigate = useNavigate();

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);

    const scrollToTop = useCallback(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    const user = useMemo(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {};
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return {};
        }
    }, []);

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

    /* ── State for Inline Authentication & Onboarding ── */
    const [authPhone, setAuthPhone] = useState('');
    const [authOtp, setAuthOtp] = useState('');
    const [authStage, setAuthStage] = useState('phone'); // 'phone', 'otp', 'add_address', 'checkout'
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const [addressForm, setAddressForm] = useState({
        fullName: '',
        mobileNumber: '',
        countryCode: '+91',
        countryIsoCode: 'IN',
        stateIsoCode: '',
        country: 'India',
        state: '',
        city: '',
        street: '',
        pinCode: ''
    });
    const [addressErrors, setAddressErrors] = useState({});
    const [locationDropdown, setLocationDropdown] = useState(null); // 'countryCode' | 'country' | 'state' | 'city' | null
    const [searchTerms, setSearchTerms] = useState({ countryCode: '', country: '', state: '', city: '' });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingStates, setLoadingStates] = useState({ countries: false, states: false, cities: false });
    const [addressSaving, setAddressSaving] = useState(false);
    const dropdownRefs = useRef({});

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
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            setItems(cart);
            setIsAuthenticated(false);
            setInitialLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            if (addresses && addresses.length > 0) {
                setAuthStage('checkout');
            } else {
                setAuthStage('add_address');
            }
        } else {
            setAuthStage('phone');
        }
    }, [isAuthenticated, addresses]);

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

    /* ── Inline Onboarding API Services & Handlers ── */
    const syncLocalCartToServer = async (token) => {
        try {
            const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
            if (localCart.length === 0) return;
            for (let item of localCart) {
                await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/addToCart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        productId: item.productId || item.product?._id,
                        quantity: item.quantity,
                        totalAmount: item.totalAmount,
                    }),
                });
            }
            window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch (error) {
            console.error("Error syncing local cart:", error);
        }
    };

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!authPhone || authPhone.length < 10) {
            setAuthError("Please enter a valid 10-digit mobile number");
            return;
        }
        setAuthLoading(true);
        setAuthError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/checkout/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: Number(authPhone) })
            });
            const data = await res.json();
            if (data.success) {
                setAuthStage('otp');
            } else {
                setAuthError(data.message || "Failed to send OTP. Please try again.");
            }
        } catch (err) {
            console.error("OTP Send Error:", err);
            setAuthError("Something went wrong. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        if (!authOtp || authOtp.length !== 6) {
            setAuthError("Please enter a valid 6-digit OTP");
            return;
        }
        setAuthLoading(true);
        setAuthError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/checkout/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: authPhone, otp: authOtp })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.data));
                localStorage.setItem("token", data.token);
                localStorage.setItem("referralCode", data.refferralCode);
                await syncLocalCartToServer(data.token);
                setIsAuthenticated(true);
            } else {
                setAuthError(data.message || "Invalid OTP. Please try again.");
            }
        } catch (err) {
            console.error("OTP Verify Error:", err);
            setAuthError("Verification failed. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    };

    // Location API calls
    const fetchCountries = async () => {
        const cached = sessionStorage.getItem('all_countries');
        if (cached) {
            const data = JSON.parse(cached);
            setCountries(data);
            return data;
        }
        setLoadingStates(prev => ({ ...prev, countries: true }));
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/location/countries`);
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem('all_countries', JSON.stringify(data.data));
                setCountries(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Failed to fetch countries:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, countries: false }));
        }
        return [];
    };

    const fetchStates = async (countryIsoCode) => {
        if (!countryIsoCode) return [];
        const cacheKey = `states_${countryIsoCode}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            setStates(data);
            return data;
        }
        setLoadingStates(prev => ({ ...prev, states: true }));
        setCities([]);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/location/states?country=${countryIsoCode}`);
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
                setStates(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Failed to fetch states:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, states: false }));
        }
        return [];
    };

    const fetchCities = async (countryIsoCode, stateIsoCode) => {
        if (!countryIsoCode || !stateIsoCode) return [];
        const cacheKey = `cities_${countryIsoCode}_${stateIsoCode}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            setCities(data);
            return data;
        }
        setLoadingStates(prev => ({ ...prev, cities: true }));
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/location/cities?country=${countryIsoCode}&state=${stateIsoCode}`);
            const data = await res.json();
            if (data.success) {
                sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
                setCities(data.data);
                return data.data;
            }
        } catch (err) {
            console.error('Failed to fetch cities:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, cities: false }));
        }
        return [];
    };

    // Location select handlers
    const handleSelectCountryCode = (phonecode) => {
        const matched = countries.find(c => c.phonecode === phonecode);
        setAddressForm(prev => ({
            ...prev,
            countryCode: `+${phonecode}`,
            ...(matched ? {
                countryIsoCode: matched.isoCode,
                country: matched.country,
                stateIsoCode: '', state: '', city: ''
            } : {})
        }));
        if (matched) { setStates([]); setCities([]); fetchStates(matched.isoCode); }
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, countryCode: '' }));
    };

    const handleSelectCountry = async (isoCode) => {
        const selected = countries.find(c => c.isoCode === isoCode);
        if (!selected) return;
        setAddressForm(prev => ({
            ...prev,
            countryIsoCode: selected.isoCode,
            country: selected.country,
            countryCode: selected.phonecode ? `+${selected.phonecode}` : prev.countryCode,
            stateIsoCode: '', state: '', city: ''
        }));
        setStates([]); setCities([]);
        if (addressErrors.country) setAddressErrors(prev => ({ ...prev, country: '' }));
        await fetchStates(selected.isoCode);
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, country: '' }));
    };

    const handleSelectState = async (isoCode) => {
        const selected = states.find(s => s.isoCode === isoCode);
        if (!selected) return;
        setAddressForm(prev => ({ ...prev, stateIsoCode: selected.isoCode, state: selected.name, city: '' }));
        setCities([]);
        if (addressErrors.state) setAddressErrors(prev => ({ ...prev, state: '' }));
        await fetchCities(addressForm.countryIsoCode, isoCode);
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, state: '' }));
    };

    const handleSelectCity = (cityName) => {
        setAddressForm(prev => ({ ...prev, city: cityName }));
        if (addressErrors.city) setAddressErrors(prev => ({ ...prev, city: '' }));
        setLocationDropdown(null);
        setSearchTerms(prev => ({ ...prev, city: '' }));
    };

    // Address form submit
    const handleSaveAddress = async (e) => {
        if (e) e.preventDefault();

        const newErrors = {};
        if (!addressForm.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!addressForm.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
        else if (!/^\d{7,15}$/.test(addressForm.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number';
        if (!addressForm.country) newErrors.country = 'Country is required';
        if (!addressForm.state) newErrors.state = 'State is required';
        if (!addressForm.city) newErrors.city = 'City is required';
        if (!addressForm.street.trim()) newErrors.street = 'Street is required';
        if (!addressForm.pinCode) newErrors.pinCode = 'Pin code is required';

        if (Object.keys(newErrors).length > 0) {
            setAddressErrors(newErrors);
            return;
        }

        setAddressSaving(true);
        try {
            const addressData = {
                fullName: addressForm.fullName,
                phoneNumber: addressForm.mobileNumber,
                country: addressForm.country,
                state: addressForm.state,
                city: addressForm.city,
                street: addressForm.street,
                pinCode: addressForm.pinCode
            };
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/addAddress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addressData)
            });
            if (res.ok) {
                await fetchAddresses();
                setAddressesIndex(0);
                setAuthStage('checkout');
            } else {
                const errData = await res.json();
                alert(errData.message || 'Failed to save address');
            }
        } catch (err) {
            console.error('Save Address Error:', err);
            alert('Failed to save address. Please try again.');
        } finally {
            setAddressSaving(false);
        }
    };

    // Filtered lists for address form selection
    const filteredCountryCodes = countries.filter(c =>
        `+${c.phonecode} ${c.country}`.toLowerCase().includes((searchTerms.countryCode || '').toLowerCase())
    );
    const filteredCountries = countries.filter(c =>
        c.country.toLowerCase().includes((searchTerms.country || '').toLowerCase())
    );
    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes((searchTerms.state || '').toLowerCase())
    );
    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes((searchTerms.city || '').toLowerCase())
    );

    // Initial trigger for location lists
    useEffect(() => {
        if (authStage === 'add_address') {
            fetchCountries().then(async (allCountries) => {
                const india = allCountries.find(c => c.isoCode === 'IN');
                if (india) await fetchStates('IN');
            });
        }
    }, [authStage]);

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

                                {/* Inline Auth Flow (Guest) */}
                                {!isAuthenticated && authStage === 'phone' && (
                                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-100 space-y-6 animate-slide-down">
                                        <div className="text-center space-y-2">
                                            <h2 className="text-xl font-bold text-gray-900">Secure Checkout</h2>
                                            <p className="text-gray-500 text-xs">Enter your mobile number to proceed to payment</p>
                                        </div>
                                        {authError && (
                                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2">
                                                <AlertCircle size={16} className="shrink-0" />
                                                <span>{authError}</span>
                                            </div>
                                        )}
                                        <form onSubmit={handleSendOtp} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                                    Mobile Number
                                                </label>
                                                <div className="relative flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
                                                    <span className="flex items-center pl-4 pr-2 text-sm text-gray-500 border-r border-gray-200 bg-gray-100/50">
                                                        +91
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        value={authPhone}
                                                        onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                                                        className="w-full px-4 py-3 bg-transparent text-sm focus:outline-none text-gray-900"
                                                        placeholder="Enter 10-digit number"
                                                        maxLength="10"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={authLoading}
                                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                {authLoading ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Sending OTP...</span>
                                                    </>
                                                ) : (
                                                    <span>Continue to Checkout</span>
                                                )}
                                            </button>
                                        </form>
                                        <p className="text-center text-[10px] text-gray-400">100% Secure Transaction • Easy Returns</p>
                                    </div>
                                )}

                                {!isAuthenticated && authStage === 'otp' && (
                                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-100 space-y-6 animate-slide-down">
                                        <div className="text-center space-y-2">
                                            <h2 className="text-xl font-bold text-gray-900">Verify Mobile</h2>
                                            <p className="text-gray-500 text-xs">
                                                Enter the 6-digit OTP sent to <span className="font-semibold text-gray-900">+91 {authPhone}</span>
                                            </p>
                                        </div>
                                        {authError && (
                                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2">
                                                <AlertCircle size={16} className="shrink-0" />
                                                <span>{authError}</span>
                                            </div>
                                        )}
                                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 text-center">
                                                    Enter OTP
                                                </label>
                                                <input
                                                    type="text"
                                                    value={authOtp}
                                                    onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-xl tracking-widest font-semibold text-gray-900"
                                                    placeholder="• • • • • •"
                                                    maxLength="6"
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={authLoading}
                                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                {authLoading ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Verifying...</span>
                                                    </>
                                                ) : (
                                                    <span>Verify &amp; Login</span>
                                                )}
                                            </button>
                                        </form>

                                        <div className="flex flex-col gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={authLoading}
                                                className="w-full text-center text-xs font-medium text-amber-600 hover:text-amber-700 cursor-pointer transition-colors"
                                            >
                                                Resend OTP
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setAuthStage('phone'); setAuthOtp(''); setAuthError(''); }}
                                                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                                            >
                                                Change Phone Number
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Inline Address Form Onboarding */}
                                {isAuthenticated && authStage === 'add_address' && (
                                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 mt-6 border border-gray-100 space-y-6 animate-slide-down">
                                        <div className="text-center space-y-2">
                                            <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                                            <p className="text-gray-500 text-xs">Add your shipping details to complete checkout</p>
                                        </div>

                                        <form onSubmit={handleSaveAddress} className="space-y-4">
                                            {/* Full Name */}
                                            <div>
                                                <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.fullName}
                                                    onChange={(e) => {
                                                        setAddressForm(prev => ({ ...prev, fullName: e.target.value }));
                                                        if (addressErrors.fullName) setAddressErrors(prev => ({ ...prev, fullName: '' }));
                                                    }}
                                                    placeholder="Enter your full name"
                                                    className={`w-full bg-gray-50 border ${addressErrors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                                                />
                                                {addressErrors.fullName && <p className="text-red-500 text-[10px] mt-1">{addressErrors.fullName}</p>}
                                            </div>

                                            {/* Mobile Number */}
                                            <div>
                                                <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Mobile Number *</label>
                                                <div className="flex gap-2">
                                                    {/* Country Code Dropdown */}
                                                    <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-28">
                                                        <div
                                                            onClick={() => setLocationDropdown(locationDropdown === 'countryCode' ? null : 'countryCode')}
                                                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 cursor-pointer flex items-center justify-between hover:border-gray-900 transition-all"
                                                        >
                                                            <span className="text-gray-900 text-sm">{addressForm.countryCode || '+91'}</span>
                                                            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                                        </div>

                                                        {locationDropdown === 'countryCode' && (
                                                            <div className="absolute z-50 w-64 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-hidden" onMouseDown={(e) => e.preventDefault()}>
                                                                <div className="p-2 border-b border-gray-200">
                                                                    <div className="relative flex items-center bg-gray-50 rounded-lg px-2 border border-gray-200">
                                                                        <Search className="w-4 h-4 text-gray-400 pointer-events-none mr-2" />
                                                                        <input
                                                                            type="text"
                                                                            value={searchTerms.countryCode}
                                                                            onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))}
                                                                            placeholder="Search country code..."
                                                                            className="w-full bg-transparent py-1.5 text-xs text-gray-900 outline-none"
                                                                            autoFocus
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="max-h-48 overflow-y-auto">
                                                                    {filteredCountryCodes.length === 0 ? (
                                                                        <div className="px-4 py-3 text-xs text-gray-500 text-center">No results found</div>
                                                                    ) : (
                                                                        filteredCountryCodes.map(c => (
                                                                            <div
                                                                                key={c.isoCode}
                                                                                onMouseDown={(e) => { e.preventDefault(); handleSelectCountryCode(c.phonecode); }}
                                                                                className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-xs text-gray-900 transition-colors"
                                                                            >
                                                                                +{c.phonecode} — {c.country}
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="tel"
                                                        value={addressForm.mobileNumber}
                                                        onChange={(e) => {
                                                            setAddressForm(prev => ({ ...prev, mobileNumber: e.target.value.replace(/\D/g, '') }));
                                                            if (addressErrors.mobileNumber) setAddressErrors(prev => ({ ...prev, mobileNumber: '' }));
                                                        }}
                                                        placeholder="Enter mobile number"
                                                        className={`flex-1 bg-gray-50 border ${addressErrors.mobileNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                                                    />
                                                </div>
                                                {addressErrors.mobileNumber && <p className="text-red-500 text-[10px] mt-1">{addressErrors.mobileNumber}</p>}
                                            </div>

                                            {/* Country */}
                                            <SearchableDropdown
                                                field="country"
                                                label="Country"
                                                placeholder="Select country"
                                                options={filteredCountries}
                                                value={addressForm.country}
                                                onSelect={handleSelectCountry}
                                                disabled={false}
                                                isLoading={loadingStates.countries}
                                                renderOption={(c) => `${c.flag || ''} ${c.country}`}
                                                getOptionValue={(c) => c.isoCode}
                                                openDropdown={locationDropdown}
                                                setOpenDropdown={setLocationDropdown}
                                                searchTerms={searchTerms}
                                                setSearchTerms={setSearchTerms}
                                                dropdownRefs={dropdownRefs}
                                                errors={addressErrors}
                                            />

                                            {/* State */}
                                            <SearchableDropdown
                                                field="state"
                                                label="State"
                                                placeholder="Select state"
                                                options={filteredStates}
                                                value={addressForm.state}
                                                onSelect={handleSelectState}
                                                disabled={!addressForm.countryIsoCode}
                                                isLoading={loadingStates.states}
                                                renderOption={(s) => s.name}
                                                getOptionValue={(s) => s.isoCode}
                                                openDropdown={locationDropdown}
                                                setOpenDropdown={setLocationDropdown}
                                                searchTerms={searchTerms}
                                                setSearchTerms={setSearchTerms}
                                                dropdownRefs={dropdownRefs}
                                                errors={addressErrors}
                                            />

                                            {/* City */}
                                            <SearchableDropdown
                                                field="city"
                                                label="City"
                                                placeholder="Select city"
                                                options={filteredCities}
                                                value={addressForm.city}
                                                onSelect={handleSelectCity}
                                                disabled={!addressForm.stateIsoCode}
                                                isLoading={loadingStates.cities}
                                                renderOption={(c) => c}
                                                getOptionValue={(c) => c}
                                                openDropdown={locationDropdown}
                                                setOpenDropdown={setLocationDropdown}
                                                searchTerms={searchTerms}
                                                setSearchTerms={setSearchTerms}
                                                dropdownRefs={dropdownRefs}
                                                errors={addressErrors}
                                            />

                                            {/* Street */}
                                            <div>
                                                <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Street Address *</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.street}
                                                    onChange={(e) => {
                                                        setAddressForm(prev => ({ ...prev, street: e.target.value }));
                                                        if (addressErrors.street) setAddressErrors(prev => ({ ...prev, street: '' }));
                                                    }}
                                                    placeholder="Enter street address"
                                                    className={`w-full bg-gray-50 border ${addressErrors.street ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                                                />
                                                {addressErrors.street && <p className="text-red-500 text-[10px] mt-1">{addressErrors.street}</p>}
                                            </div>

                                            {/* Pin Code */}
                                            <div>
                                                <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Pin Code *</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.pinCode}
                                                    onChange={(e) => {
                                                        setAddressForm(prev => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '') }));
                                                        if (addressErrors.pinCode) setAddressErrors(prev => ({ ...prev, pinCode: '' }));
                                                    }}
                                                    placeholder="Enter 6-digit pin code"
                                                    maxLength="6"
                                                    className={`w-full bg-gray-50 border ${addressErrors.pinCode ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
                                                />
                                                {addressErrors.pinCode && <p className="text-red-500 text-[10px] mt-1">{addressErrors.pinCode}</p>}
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={addressSaving}
                                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                                            >
                                                {addressSaving ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span>Saving Address...</span>
                                                    </>
                                                ) : (
                                                    <span>Save Address &amp; Continue</span>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Address Section */}
                                {isAuthenticated && authStage === 'checkout' && (
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
                                {isAuthenticated && authStage === 'checkout' && ((offers?.length ?? 0) > 0 || (spinOffers?.length ?? 0) > 0) && (addresses?.length ?? 0) > 0 && (
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
                                {isAuthenticated && authStage === 'checkout' && checkoutDetails && addresses.length > 0 && (
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