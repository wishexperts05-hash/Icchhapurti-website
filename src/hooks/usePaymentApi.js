import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export default function usePaymentApi({
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
}) {
    const [balance, setBalance] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [checkoutDetails, setDetails] = useState(null);
    const [couponDiscount, setDiscount] = useState(0);
    const [showCouponPopup, setshowCouponPopup] = useState(false);
    const [referralCoins, setRefferalCoin] = useState(0);
    const [orderToken, setOrderToken] = useState();
    const [offers, setOffers] = useState([]);
    const [spinOffers, setspinOffers] = useState([]);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [pincodeServiceable, setPincodeServiceable] = useState(null);
    const [pincodeChecking, setPincodeChecking] = useState(false);

    const user = (() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {};
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return {};
        }
    })();

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
        } catch (err) {
            console.error('Balance fetch failed:', err);
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
            setAddresses(data.data || []);
            return data.data || [];
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
        if (!cartItems || cartItems.length === 0) return;
        try {
            setCheckoutLoading(true);
            const items = cartItems.map((item) => ({
                productId: item.productId || (item.product && item.product._id) || item._id,
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
            if (setCurrentStep) setCurrentStep(3);
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
            modal: {
                ondismiss: () => {
                    setCheckoutLoading(false);
                    // Add cancel error matching ReferralPaymentModal behavior
                    setError('Payment cancelled by user');
                    setTimeout(() => setError(null), 3000);
                }
            }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }, [orderToken, addresses, addressIndex, user, scrollToTop, goToThankYou]);

    const handleCheckout = useCallback(async () => {
        if (!isAuthenticated) { if (setShowAuthModal) setShowAuthModal(true); return; }
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
        if (!cartItems || cartItems.length === 0) return;
        try {
            const productIds = cartItems.map(item => item.productId || (item.product && item.product._id) || item._id);
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

    return {
        balance,
        addresses,
        setAddresses,
        checkoutDetails,
        couponDiscount,
        showCouponPopup,
        setshowCouponPopup,
        referralCoins,
        orderToken,
        offers,
        spinOffers,
        checkoutLoading,
        error,
        setError,
        successMsg,
        setSuccessMsg,
        pincodeServiceable,
        pincodeChecking,
        fetchBalance,
        fetchAddresses,
        checkPincodeServiceability,
        fetchCheckOutDetails,
        createRazorpayOrder,
        createWalletpayOrder,
        verifyRazorpayPayment,
        handleRazorpayPayment,
        handleCheckout,
        fetchOffers,
        cancelledOrder
    };
}
