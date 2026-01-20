import React, { useState } from "react";

const LoginModal = ({ isOpen, onClose, setIsAuthenticated }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
            productId: item.productId,
            quantity: item.quantity,
            totalAmount: item.totalAmount,
          }),
        });
      }

    //   localStorage.removeItem("cartItems");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error syncing local cart:", error);
    }
  };

  const handleGetOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: Number(phone) }),
      });

      const data = await response.json();

      if (data.success) {
        // alert(`OTP sent: ${data.otp}`);
        setShowOtpInput(true);
        setError("");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("OTP Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/verifyLoginOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // alert("Login Successful!");

        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);

        await syncLocalCartToServer(data.token);

        setShowOtpInput(false);
        setPhone("");
        setOtp("");
        setIsAuthenticated(true)
        // if (onLoginSuccess) {
        //   onLoginSuccess(data);
        // }
        
        onClose();
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("Verify Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone("");
    setOtp("");
    setShowOtpInput(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-[90%] max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {showOtpInput ? "Verify OTP" : "Login"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!showOtpInput ? (
          <>
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter mobile number"
              maxLength="10"
            />

            <button
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sending..." : "Get OTP"}
            </button>

            {/* <p className="mt-4 text-center text-sm text-gray-700">
              Don't have an account?
              <button
                onClick={() => {
                  handleClose();
                  // Trigger registration modal or navigation
                }}
                className="text-blue-600 font-semibold ml-1 hover:underline"
              >
                Register Now
              </button>
            </p> */}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit OTP sent to {phone}
            </p>

            <label className="text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full mt-3 text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400"
            >
              Resend OTP
            </button>

            <button
              onClick={() => {
                setShowOtpInput(false);
                setOtp("");
                setError("");
              }}
              className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to phone number
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Demo component to show how to use the modal

export default LoginModal;