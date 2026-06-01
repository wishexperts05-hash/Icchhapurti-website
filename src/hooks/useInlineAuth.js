import { useState } from 'react';

export default function useInlineAuth({ setIsAuthenticated, onVerifySuccess }) {
    const [authPhone, setAuthPhone] = useState('');
    const [authOtp, setAuthOtp] = useState('');
    const [authStage, setAuthStage] = useState('phone'); // 'phone', 'otp', 'add_address', 'checkout'
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

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
                if (onVerifySuccess) {
                    onVerifySuccess(data);
                }
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

    return {
        authPhone,
        setAuthPhone,
        authOtp,
        setAuthOtp,
        authStage,
        setAuthStage,
        authLoading,
        authError,
        setAuthError,
        handleSendOtp,
        handleVerifyOtp,
        syncLocalCartToServer
    };
}
