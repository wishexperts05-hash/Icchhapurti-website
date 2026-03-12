import React, { useState, useEffect, useRef } from 'react';
import { Country, State, City } from 'country-state-city';
import { setLoginTimestamp } from '../../utils/auth';

const SpinToWin = ({ isImmediate = false }) => {
    // Configuration
    const SHOW_POPUP_AFTER = 240; // seconds (change to 180 for 3 minutes)
    const SHOW_AGAIN_AFTER_CLOSE = 5 * 60 * 1000; // 5 minutes in milliseconds
    const [token, setToken] = useState("");

    const accessToken = localStorage.getItem("token")
    const [prizes, setPrizes] = useState([])
    console.log(prizes, "prizes")

    const fetchSpinReward = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/spin/get-all`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (!res.ok) {

            }
            const resData = await res.json()
            setPrizes(resData.data)
        } catch (err) {
            console.log(err)

        }
    }



    // State
    const [timeOnSite, setTimeOnSite] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showWheel, setShowWheel] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [modalManuallyClosed, setModalManuallyClosed] = useState(false);

    // Registration form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        country: '',
        countryCode: '',
        state: '',
        stateCode: '',
        city: '',
        street: '',
        pin: '',
        dob: ''
    });

    // Location dropdowns state
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Search and dropdown state
    const [countrySearch, setCountrySearch] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    // OTP state
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);


    // Refs for click outside detection
    const countryRef = useRef(null);
    const stateRef = useRef(null);
    const cityRef = useRef(null);

    // Refs
    const timerRef = useRef(null);

    // Check if user should see popup
    const shouldShowPopup = () => {
        // Don't show if modal was manually closed in this session
        if (modalManuallyClosed) {
            return false;
        }

        // If isImmediate is true, skip all other checks except login and spin status
        if (isImmediate) {
            // Still don't show if user is logged in or has already spun
            if (isLoggedIn || hasSpun) {
                return false;
            }
            return true;
        }

        // Don't show if user is logged in
        if (isLoggedIn) {
            return false;
        }

        // Don't show if user has already spun
        if (hasSpun) {
            return false;
        }

        // Check if popup was recently closed
        const lastClosedTime = sessionStorage.getItem('spinPopupLastClosed');
        if (lastClosedTime) {
            const timeSinceClosed = Date.now() - parseInt(lastClosedTime);
            if (timeSinceClosed < SHOW_AGAIN_AFTER_CLOSE) {
                return false;
            }
        }

        return true;
    };


    // fetch spin reward
    useEffect(() => {
        if (!showWheel || !accessToken) return;
        fetchSpinReward()
    }, [showWheel, accessToken])

    // Check localStorage and login status on mount + listen for login changes
    useEffect(() => {
        const registered = localStorage.getItem('spinRegistered') === 'true';
        const spun = localStorage.getItem('hasSpun') === 'true';
        const userToken = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        setHasRegistered(registered);
        setHasSpun(spun);
        setIsLoggedIn(!!(userToken && user));

        // Load countries
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);

        // Listen for login/logout changes in localStorage (same tab)
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                const newToken = localStorage.getItem('token');
                const newUser = localStorage.getItem('user');
                const loggedIn = !!(newToken && newUser);
                setIsLoggedIn(loggedIn);
                // If user just logged in, immediately close and block the modal
                if (loggedIn) {
                    setShowModal(false);
                    setModalManuallyClosed(true);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }
            }
        };

        // Also poll every second to catch same-tab localStorage changes
        // (storage event only fires for cross-tab changes in most browsers)
        const loginPollRef = setInterval(() => {
            const currentToken = localStorage.getItem('token');
            const currentUser = localStorage.getItem('user');
            const loggedIn = !!(currentToken && currentUser);
            setIsLoggedIn(prev => {
                if (!prev && loggedIn) {
                    // User just logged in — close modal and stop timer
                    setShowModal(false);
                    setModalManuallyClosed(true);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }
                return loggedIn;
            });
        }, 1000);

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(loginPollRef);
        };
    }, []);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
            if (stateRef.current && !stateRef.current.contains(event.target)) {
                setShowStateDropdown(false);
            }
            if (cityRef.current && !cityRef.current.contains(event.target)) {
                setShowCityDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Timer effect
    useEffect(() => {
        // Don't start timer if modal is already shown or was closed
        if (showModal) {
            return;
        }

        // Only start timer if user should see popup
        if (!shouldShowPopup()) {
            return;
        }

        // If isImmediate is true, show popup immediately
        if (isImmediate) {
            setShowModal(true);
            if (hasRegistered) {
                setShowWheel(true);
            }
            return; // Don't start the interval timer
        }

        timerRef.current = setInterval(() => {
            setTimeOnSite(prev => {
                const newTime = prev + 1;
                if (newTime >= SHOW_POPUP_AFTER && !showModal && shouldShowPopup()) {
                    setShowModal(true);
                    if (hasRegistered) {
                        setShowWheel(true);
                    }
                }
                return newTime;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [showModal, hasRegistered, isLoggedIn, hasSpun, isImmediate, modalManuallyClosed]);

    // OTP resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle country selection
    const handleCountrySelect = (country) => {
        setFormData(prev => ({
            ...prev,
            country: country.name,
            countryCode: country.isoCode,
            state: '',
            stateCode: '',
            city: ''
        }));
        setCountrySearch(country.name);
        setShowCountryDropdown(false);

        // Load states for selected country
        const countryStates = State.getStatesOfCountry(country.isoCode);
        setStates(countryStates);
        setCities([]);
        setStateSearch('');
        setCitySearch('');
    };

    // Handle state selection
    const handleStateSelect = (state) => {
        setFormData(prev => ({
            ...prev,
            state: state.name,
            stateCode: state.isoCode,
            city: ''
        }));
        setStateSearch(state.name);
        setShowStateDropdown(false);

        // Load cities for selected state
        const stateCities = City.getCitiesOfState(formData.countryCode, state.isoCode);
        setCities(stateCities);
        setCitySearch('');
    };

    // Handle city selection
    const handleCitySelect = (city) => {
        setFormData(prev => ({
            ...prev,
            city: city.name
        }));
        setCitySearch(city.name);
        setShowCityDropdown(false);
    };

    // Filter countries based on search
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    // Filter states based on search
    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(stateSearch.toLowerCase())
    );

    // Filter cities based on search
    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(citySearch.toLowerCase())
    );

    // Handle registration form submission - sends OTP
    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate required fields (email and dob are optional)
        const requiredFields = ['name', 'mobile', 'country', 'state', 'city', 'street', 'pin'];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            alert('Please fill all required fields');
            return;
        }

        // Validate mobile number
        if (formData.mobile.length < 10) {
            alert('Please enter a valid mobile number');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.mobile,
                    country: formData.country,
                    state: formData.state,
                    street: formData.street,
                    city: formData.city,
                    pinCode: formData.pin,
                    dob: formData.dob
                })
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.registrationToken);
                setShowOtpVerification(true);
                setResendTimer(60);
                setOtpError('');
            } else {
                alert(data.message || "something went wrong");
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        }
    };

    // Verify OTP and complete registration
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsVerifying(true);
        setOtpError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verifyRegisterOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ otp })
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.data));
                localStorage.setItem("token", data.token);
                localStorage.setItem('spinRegistered', 'true');
                localStorage.setItem("referralCode", data.refferralCode);
                setHasRegistered(true);
                setIsLoggedIn(true);
                setShowOtpVerification(false);
                setShowWheel(true);
                setLoginTimestamp();
            } else {
                setOtpError('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setOtpError('Verification failed. Please try again.');
            console.error('OTP verification error:', error);
        } finally {
            setIsVerifying(false);
        }
    };

    // Go back to form
    const handleBackToForm = () => {
        setShowOtpVerification(false);
        setOtp('');
        setOtpError('');
    };

    // Handle spin
    const handleSpin = async () => {
        if (isSpinning || hasSpun) return;

        if (!prizes || prizes.length === 0) {
            alert("Prizes not loaded yet, please try again.");
            setIsSpinning(false);
            return;
        }

        setIsSpinning(true);
        setShowResult(false);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/spin/play`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Spin failed");
            }

            const { rewardId, couponCode } = data.data;

            // Find the exact prize returned by the API
            const displayPrizes = prizes.slice(0, 6);
            const prizeIndex = displayPrizes.findIndex(p => p._id == rewardId);
            const targetIndex = prizeIndex !== -1 ? prizeIndex : 0;
            const prize = displayPrizes[targetIndex];

            // Calculate rotation to land on the exact prize
            const segmentAngle = 360 / displayPrizes.length;

            // Because segments start from 0deg on RIGHT
            // And pointer is at TOP (−90deg)
            const correctionOffset = -90;

            // Center of the winning segment
            const prizeCenterAngle =
                targetIndex * segmentAngle + segmentAngle / 2;

            // Final rotation
            const totalRotation =
                360 * 5 + (360 - prizeCenterAngle) + correctionOffset;
            console.log(totalRotation, "totalRotation")

            setRotation(Number(totalRotation + 155));


            // Show result after spin animation completes
            setTimeout(() => {
                setSelectedPrize(data.data);
                setShowResult(true);
                setIsSpinning(false);
                setHasSpun(true);
                localStorage.setItem('hasSpun', 'true');
            }, 4000);

        } catch (err) {
            console.error(err);
            setIsSpinning(false);
            alert(err.message || "Something went wrong while spinning");
        }
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setModalManuallyClosed(true); // Prevent reopening in this session

        // Clear the timer to prevent it from reopening
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Store the timestamp when modal was closed (only if user is not logged in)
        if (!isLoggedIn) {
            sessionStorage.setItem('spinPopupLastClosed', Date.now().toString());
        }
    };

    // Don't render anything if user shouldn't see the popup
    if (!shouldShowPopup() && !showModal) {
        return null;
    }

    return (
        <>
            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn"
                // onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <div className="bg-gradient-to-b from-pink-100 to-pink-100 rounded-3xl max-w-2xl w-full relative animate-slideIn shadow-2xl max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 w-9 h-9 bg-black/80 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
                        >
                            ✕
                        </button>

                        <div className="p-10 pt-14">
                            {/* Registration Form */}
                            {!showWheel && !showOtpVerification && (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Spin to Win</h2>
                                    <p className="text-gray-600 mb-6 px-4">
                                        Enter your details & unlock exclusive Icchhapurti offers
                                    </p>

                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Name */}
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name *"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                            />

                                            {/* Email (Optional) */}
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address (Optional)"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                            />

                                            {/* Mobile Number */}
                                            <input
                                                type="tel"
                                                name="mobile"
                                                placeholder="Mobile Number *"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                required
                                                maxLength="10"
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                            />

                                            {/* Country - Searchable Dropdown */}
                                            <div className="relative" ref={countryRef}>
                                                <input
                                                    type="text"
                                                    placeholder="Country *"
                                                    value={countrySearch}
                                                    onChange={(e) => {
                                                        setCountrySearch(e.target.value);
                                                        setShowCountryDropdown(true);
                                                    }}
                                                    onFocus={() => setShowCountryDropdown(true)}
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                                />
                                                {showCountryDropdown && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredCountries.length > 0 ? (
                                                            filteredCountries.map((country) => (
                                                                <div
                                                                    key={country.isoCode}
                                                                    onClick={() => handleCountrySelect(country)}
                                                                    className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                                                >
                                                                    <span className="font-medium">{country.name}</span>
                                                                    <span className="text-gray-500 text-sm ml-2">({country.isoCode})</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-gray-500 text-sm">No countries found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* State - Searchable Dropdown */}
                                            <div className="relative" ref={stateRef}>
                                                <input
                                                    type="text"
                                                    placeholder="State *"
                                                    value={stateSearch}
                                                    onChange={(e) => {
                                                        setStateSearch(e.target.value);
                                                        setShowStateDropdown(true);
                                                    }}
                                                    onFocus={() => setShowStateDropdown(true)}
                                                    disabled={!formData.country}
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                {showStateDropdown && states.length > 0 && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredStates.length > 0 ? (
                                                            filteredStates.map((state) => (
                                                                <div
                                                                    key={state.isoCode}
                                                                    onClick={() => handleStateSelect(state)}
                                                                    className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                                                >
                                                                    <span className="font-medium">{state.name}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-gray-500 text-sm">No states found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* City - Searchable Dropdown */}
                                            <div className="relative" ref={cityRef}>
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={citySearch}
                                                    onChange={(e) => {
                                                        setCitySearch(e.target.value);
                                                        setShowCityDropdown(true);
                                                    }}
                                                    onFocus={() => setShowCityDropdown(true)}
                                                    disabled={!formData.state}
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                {showCityDropdown && cities.length > 0 && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredCities.length > 0 ? (
                                                            filteredCities.map((city) => (
                                                                <div
                                                                    key={city.name}
                                                                    onClick={() => handleCitySelect(city)}
                                                                    className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                                                                >
                                                                    <span className="font-medium">{city.name}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-gray-500 text-sm">No cities found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* PIN Code */}
                                            <input
                                                type="text"
                                                name="pin"
                                                placeholder="PIN Code *"
                                                value={formData.pin}
                                                onChange={handleInputChange}
                                                required
                                                maxLength="6"
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                            />

                                            {/* Date of Birth (Optional) */}
                                            <input
                                                type="date"
                                                name="dob"
                                                placeholder="Date of Birth (Optional)"
                                                value={formData.dob}
                                                onChange={handleInputChange}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Street Address - Full Width */}
                                        <input
                                            type="text"
                                            name="street"
                                            placeholder="Street Address *"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                        />

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full bg-black text-white py-4 rounded-lg font-bold text-base hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all mt-6"
                                        >
                                            SEND OTP
                                        </button>

                                        <p className="text-xs text-gray-500 mt-4 px-2">
                                            By continuing, you agree to receive promotional emails and SMS
                                        </p>
                                    </form>
                                </div>
                            )}

                            {/* OTP Verification Screen */}
                            {!showWheel && showOtpVerification && (
                                <div className="text-center max-w-md mx-auto">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                                        <p className="text-gray-600 mb-2">
                                            We've sent a 6-digit code to
                                        </p>
                                        <p className="text-gray-800 font-semibold text-lg mb-6">
                                            +91 {formData.mobile}
                                        </p>
                                    </div>

                                    {/* OTP Input */}
                                    <div className="mb-6">
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(e.target.value.replace(/\D/g, ''));
                                                setOtpError('');
                                            }}
                                            maxLength="6"
                                            className="w-full px-6 py-4 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all tracking-widest"
                                            autoFocus
                                        />

                                        {/* Error Message */}
                                        {otpError && (
                                            <p className="text-red-500 text-sm mt-3">{otpError}</p>
                                        )}
                                    </div>

                                    {/* Verify Button */}
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={otp.length !== 6 || isVerifying}
                                        className={`w-full py-4 rounded-lg font-bold text-base transition-all mb-4 ${otp.length !== 6 || isVerifying
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl'
                                            }`}
                                    >
                                        {isVerifying ? 'VERIFYING...' : 'VERIFY OTP'}
                                    </button>

                                    {/* Resend OTP */}
                                    <div className="text-center mb-4">
                                        {resendTimer > 0 ? (
                                            <p className="text-gray-600 text-sm">
                                                Resend OTP in <span className="font-semibold">{resendTimer}s</span>
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleRegister}
                                                className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>

                                    {/* Back to Form */}
                                    <button
                                        type="button"
                                        onClick={handleBackToForm}
                                        className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
                                    >
                                        ← Change Mobile Number
                                    </button>
                                </div>
                            )}

                            {/* Wheel Section */}
                            {showWheel && (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Spin the Wheel!</h2>
                                    <p className="text-gray-600 mb-6">Click the button below to spin</p>

                                    {/* Wheel Container */}
                                    <div className="relative w-80 h-80 mx-auto mb-8">
                                        {/* Pointer */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500 z-10 drop-shadow-lg" />

                                        {/* Wheel */}
                                        <div
                                            className="w-full h-full rounded-full relative overflow-hidden shadow-2xl transition-transform duration-[4000ms] ease-out"
                                            style={{ transform: `rotate(${rotation}deg)` }}
                                        >
                                            {/* Wheel Segments - Only show first 6 prizes */}
                                            {prizes?.map((prize, index) => {
                                                const isBlack = index % 2 === 0;
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`absolute w-1/2 h-1/2 origin-bottom-right ${isBlack ? 'bg-black' : 'bg-[#f5f5dc]'
                                                            }`}
                                                        style={{
                                                            transform: `rotate(${index * 60}deg)`,
                                                            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                                                        }}
                                                    >
                                                        <span
                                                            className={`absolute left-[65%] top-[30%] -translate-x-1/2 rotate-[45deg] ${isBlack ? 'text-white' : 'text-gray-800'
                                                                } font-bold text-xs text-center w-24 leading-tight whitespace-normal`}
                                                        >
                                                            {prize.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}

                                            {/* Center Circle */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg z-10" />
                                        </div>
                                    </div>

                                    {/* Spin Button */}
                                    <button
                                        onClick={handleSpin}
                                        disabled={isSpinning || hasSpun}
                                        className={`w-full py-4 rounded-lg font-bold text-base transition-all ${isSpinning || hasSpun
                                            ? 'bg-gray-600 cursor-not-allowed opacity-60'
                                            : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl'
                                            }`}
                                    >
                                        {hasSpun ? 'ALREADY PLAYED' : isSpinning ? 'SPINNING...' : 'SPIN MY WHEEL'}
                                    </button>

                                    {/* Result Message */}
                                    {showResult && selectedPrize && (
    <div className="mt-4 bg-white p-4 rounded-lg animate-bounceIn shadow-lg">
        <h3 className="text-xl font-bold text-red-500 mb-2">
            🎉 Congratulations!
        </h3>
        <p className="text-gray-700 text-sm font-bold mb-1">
            {selectedPrize.rewardTitle}
        </p>
        <p className="text-gray-600 text-xs mb-2">
            on {selectedPrize.productName}
        </p>
        {selectedPrize.couponCode && (
            <>
                <div className="bg-[#f5f5dc] py-2 px-3 rounded-lg font-bold text-gray-800 text-lg tracking-wider my-2">
                    {selectedPrize.couponCode}
                </div>
                <p className="text-xs text-gray-600">apply at checkout</p>
            </>
        )}
        {selectedPrize.expiresAt && (
            <p className="text-xs text-red-400 mt-2">
                ⏰ Expires: {new Date(selectedPrize.expiresAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' ,
                    minute: '2-digit',
                    hour: '2-digit'
                    
                })}
            </p>
        )}
    </div>
)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease;
        }
      `}</style>
        </>
    );
};

export default SpinToWin;