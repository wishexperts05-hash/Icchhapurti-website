import { useState, useEffect, useRef } from 'react';
import { setLoginTimestamp } from '../../utils/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

// ── sessionStorage cache helpers ──────────────────────────────
const cache = {
    get: (key) => {
        try { const item = sessionStorage.getItem(key); return item ? JSON.parse(item) : null; }
        catch { return null; }
    },
    set: (key, value) => {
        try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { }
    }
};

const SpinToWin = ({ isImmediate = false }) => {
    const SHOW_POPUP_AFTER = 40;
    const SHOW_AGAIN_AFTER_CLOSE = 5 * 60 * 1000;
    const [token, setToken] = useState("");

    const accessToken = localStorage.getItem("token");
    const [prizes, setPrizes] = useState([]);

    const fetchSpinReward = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/user/spin/get-all`, {
                method: "GET",
                headers: { "Content-type": "application/json", Authorization: `Bearer ${accessToken}` }
            });
            if (!res.ok) return;
            const resData = await res.json();
            setPrizes(resData.data);
        } catch (err) { console.log(err); }
    };

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
        name: '', email: '', mobile: '',
        countryIsoCode: '', country: '',
        stateIsoCode: '', state: '',
        city: '', street: '', pin: '', dob: ''
    });

    // Location data from API
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [locationLoading, setLocationLoading] = useState({ countries: false, states: false, cities: false });

    // Search state
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

    const countryRef = useRef(null);
    const stateRef = useRef(null);
    const cityRef = useRef(null);
    const timerRef = useRef(null);

    // ── API CALLS ────────────────────────────────────────────────

    const fetchCountries = async () => {
        const cached = cache.get('all_countries');
        if (cached) { setCountries(cached); return cached; }
        setLocationLoading(prev => ({ ...prev, countries: true }));
        try {
            const res = await fetch(`${BASE_URL}/api/user/location/countries`);
            const data = await res.json();
            if (data.success) { cache.set('all_countries', data.data); setCountries(data.data); return data.data; }
        } catch (err) { console.error('Failed to fetch countries:', err); }
        finally { setLocationLoading(prev => ({ ...prev, countries: false })); }
        return [];
    };

    const fetchStates = async (countryIsoCode) => {
        if (!countryIsoCode) return [];
        const cacheKey = `states_${countryIsoCode}`;
        const cached = cache.get(cacheKey);
        if (cached) { setStates(cached); return cached; }
        setLocationLoading(prev => ({ ...prev, states: true }));
        setCities([]);
        try {
            const res = await fetch(`${BASE_URL}/api/user/location/states?country=${countryIsoCode}`);
            const data = await res.json();
            if (data.success) { cache.set(cacheKey, data.data); setStates(data.data); return data.data; }
        } catch (err) { console.error('Failed to fetch states:', err); }
        finally { setLocationLoading(prev => ({ ...prev, states: false })); }
        return [];
    };

    const fetchCities = async (countryIsoCode, stateIsoCode) => {
        if (!countryIsoCode || !stateIsoCode) return [];
        const cacheKey = `cities_${countryIsoCode}_${stateIsoCode}`;
        const cached = cache.get(cacheKey);
        if (cached) { setCities(cached); return cached; }
        setLocationLoading(prev => ({ ...prev, cities: true }));
        try {
            const res = await fetch(`${BASE_URL}/api/user/location/cities?country=${countryIsoCode}&state=${stateIsoCode}`);
            const data = await res.json();
            if (data.success) { cache.set(cacheKey, data.data); setCities(data.data); return data.data; }
        } catch (err) { console.error('Failed to fetch cities:', err); }
        finally { setLocationLoading(prev => ({ ...prev, cities: false })); }
        return [];
    };

    // ── FILTERED OPTIONS ─────────────────────────────────────────

    const filteredCountries = countries.filter(c =>
        c.country.toLowerCase().includes(countrySearch.toLowerCase())
    );
    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes(stateSearch.toLowerCase())
    );
    // cities from API are plain strings
    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    );

    // ── POPUP LOGIC ──────────────────────────────────────────────

    const shouldShowPopup = () => {
        if (modalManuallyClosed) return false;
        if (isImmediate) return !(isLoggedIn || hasSpun);
        if (isLoggedIn || hasSpun) return false;
        const lastClosedTime = sessionStorage.getItem('spinPopupLastClosed');
        if (lastClosedTime && (Date.now() - parseInt(lastClosedTime)) < SHOW_AGAIN_AFTER_CLOSE) return false;
        return true;
    };

    // ── EFFECTS ──────────────────────────────────────────────────

    useEffect(() => {
        if (!showWheel || !accessToken) return;
        fetchSpinReward();
    }, [showWheel, accessToken]);

    useEffect(() => {
        const registered = localStorage.getItem('spinRegistered') === 'true';
        const spun = localStorage.getItem('hasSpun') === 'true';
        const userToken = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        setHasRegistered(registered);
        setHasSpun(spun);
        setIsLoggedIn(!!(userToken && user));

        fetchCountries();

        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                const loggedIn = !!(localStorage.getItem('token') && localStorage.getItem('user'));
                setIsLoggedIn(loggedIn);
                if (loggedIn) { setShowModal(false); setModalManuallyClosed(true); if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }
            }
        };

        const loginPollRef = setInterval(() => {
            const loggedIn = !!(localStorage.getItem('token') && localStorage.getItem('user'));
            setIsLoggedIn(prev => {
                if (!prev && loggedIn) { setShowModal(false); setModalManuallyClosed(true); if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }
                return loggedIn;
            });
        }, 1000);

        window.addEventListener('storage', handleStorageChange);
        return () => { window.removeEventListener('storage', handleStorageChange); clearInterval(loginPollRef); };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) setShowCountryDropdown(false);
            if (stateRef.current && !stateRef.current.contains(event.target)) setShowStateDropdown(false);
            if (cityRef.current && !cityRef.current.contains(event.target)) setShowCityDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (showModal) return;
        if (!shouldShowPopup()) return;
        if (isImmediate) { setShowModal(true); if (hasRegistered) setShowWheel(true); return; }
        timerRef.current = setInterval(() => {
            setTimeOnSite(prev => {
                const newTime = prev + 1;
                if (newTime >= SHOW_POPUP_AFTER && !showModal && shouldShowPopup()) {
                    setShowModal(true);
                    if (hasRegistered) setShowWheel(true);
                }
                return newTime;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [showModal, hasRegistered, isLoggedIn, hasSpun, isImmediate, modalManuallyClosed]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // ── HANDLERS ─────────────────────────────────────────────────

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountrySelect = async (country) => {
        // country = { isoCode, country, phonecode, flag? }
        setFormData(prev => ({
            ...prev,
            countryIsoCode: country.isoCode,
            country: country.country,
            stateIsoCode: '', state: '', city: ''
        }));
        setCountrySearch(country.country);
        setShowCountryDropdown(false);
        setStates([]); setCities([]);
        setStateSearch(''); setCitySearch('');
        await fetchStates(country.isoCode);
    };

    const handleStateSelect = async (state) => {
        // state = { isoCode, name }
        setFormData(prev => ({ ...prev, stateIsoCode: state.isoCode, state: state.name, city: '' }));
        setStateSearch(state.name);
        setShowStateDropdown(false);
        setCities([]); setCitySearch('');
        await fetchCities(formData.countryIsoCode, state.isoCode);
    };

    const handleCitySelect = (cityName) => {
        // cities are plain strings
        setFormData(prev => ({ ...prev, city: cityName }));
        setCitySearch(cityName);
        setShowCityDropdown(false);
    };

    const handleRegister = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const requiredFields = ['name', 'mobile', 'country', 'state', 'city', 'street', 'pin'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
        if (emptyFields.length > 0) { alert('Please fill all required fields'); return; }
        if (formData.mobile.length < 10) { alert('Please enter a valid mobile number'); return; }

        try {
            const response = await fetch(`${BASE_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name, email: formData.email,
                    phoneNumber: formData.mobile, country: formData.country,
                    state: formData.state, street: formData.street,
                    city: formData.city, pinCode: formData.pin, dob: formData.dob
                })
            });
            const data = await response.json();
            if (data.success) {
                setToken(data.registrationToken);
                setShowOtpVerification(true);
                setResendTimer(60);
                setOtpError('');
            } else { alert(data.message || "something went wrong"); }
        } catch (error) { console.error('Error sending OTP:', error); alert('Failed to send OTP. Please try again.'); }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) { setOtpError('Please enter a valid 6-digit OTP'); return; }
        setIsVerifying(true); setOtpError('');
        try {
            const response = await fetch(`${BASE_URL}/api/user/verifyRegisterOtp`, {
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
                setHasRegistered(true); setIsLoggedIn(true);
                setShowOtpVerification(false); setShowWheel(true);
                setLoginTimestamp();
            } else { setOtpError('Invalid OTP. Please try again.'); }
        } catch (error) { setOtpError('Verification failed. Please try again.'); console.error('OTP verification error:', error); }
        finally { setIsVerifying(false); }
    };

    const handleBackToForm = () => { setShowOtpVerification(false); setOtp(''); setOtpError(''); };

    const handleSpin = async () => {
        if (isSpinning || hasSpun) return;
        if (!prizes || prizes.length === 0) { alert("Prizes not loaded yet, please try again."); return; }
        setIsSpinning(true); setShowResult(false);
        try {
            const res = await fetch(`${BASE_URL}/api/user/spin/play`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Spin failed");
            const { rewardId } = data.data;
            const displayPrizes = prizes.slice(0, 6);
            const prizeIndex = displayPrizes.findIndex(p => p._id == rewardId);
            const targetIndex = prizeIndex !== -1 ? prizeIndex : 0;
            const segmentAngle = 360 / displayPrizes.length;
            const correctionOffset = -90;
            const prizeCenterAngle = targetIndex * segmentAngle + segmentAngle / 2;
            const totalRotation = 360 * 5 + (360 - prizeCenterAngle) + correctionOffset;
            setRotation(Number(totalRotation + 155));
            setTimeout(() => {
                setSelectedPrize(data.data); setShowResult(true);
                setIsSpinning(false); setHasSpun(true);
                localStorage.setItem('hasSpun', 'true');
            }, 4000);
        } catch (err) { console.error(err); setIsSpinning(false); alert(err.message || "Something went wrong while spinning"); }
    };

    const closeModal = () => {
        setShowModal(false); setModalManuallyClosed(true);
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        if (!isLoggedIn) sessionStorage.setItem('spinPopupLastClosed', Date.now().toString());
    };

    if (!shouldShowPopup() && !showModal) return null;

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-gradient-to-b from-pink-100 to-pink-100 rounded-3xl max-w-2xl w-full relative animate-slideIn shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 w-9 h-9 bg-black/80 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
                        >✕</button>

                        <div className="p-10 pt-14">
                            {/* Registration Form */}
                            {!showWheel && !showOtpVerification && (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Spin to Win</h2>
                                    <p className="text-gray-600 mb-6 px-4">Enter your details & unlock exclusive Icchhapurti offers</p>

                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} required
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />

                                            <input type="email" name="email" placeholder="Email Address (Optional)" value={formData.email} onChange={handleInputChange}
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />

                                            <input type="tel" name="mobile" placeholder="Mobile Number *" value={formData.mobile} onChange={handleInputChange} required maxLength="10"
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />

                                            {/* Country */}
                                            <div className="relative" ref={countryRef}>
                                                <input
                                                    type="text"
                                                    placeholder={locationLoading.countries ? "Loading countries..." : "Country *"}
                                                    value={countrySearch}
                                                    onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDropdown(true); }}
                                                    onFocus={() => setShowCountryDropdown(true)}
                                                    disabled={locationLoading.countries}
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:bg-gray-100"
                                                />
                                                {showCountryDropdown && !locationLoading.countries && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredCountries.length > 0 ? filteredCountries.map((c) => (
                                                            <div key={c.isoCode} onClick={() => handleCountrySelect(c)}
                                                                className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0">
                                                                <span className="font-medium">{c.flag} {c.country}</span>
                                                                <span className="text-gray-500 text-sm ml-2">({c.isoCode})</span>
                                                            </div>
                                                        )) : <div className="px-4 py-3 text-gray-500 text-sm">No countries found</div>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* State */}
                                            <div className="relative" ref={stateRef}>
                                                <input
                                                    type="text"
                                                    placeholder={locationLoading.states ? "Loading states..." : "State *"}
                                                    value={stateSearch}
                                                    onChange={(e) => { setStateSearch(e.target.value); setShowStateDropdown(true); }}
                                                    onFocus={() => setShowStateDropdown(true)}
                                                    disabled={!formData.countryIsoCode || locationLoading.states}
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                {showStateDropdown && states.length > 0 && !locationLoading.states && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredStates.length > 0 ? filteredStates.map((s) => (
                                                            <div key={s.isoCode} onClick={() => handleStateSelect(s)}
                                                                className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0">
                                                                <span className="font-medium">{s.name}</span>
                                                            </div>
                                                        )) : <div className="px-4 py-3 text-gray-500 text-sm">No states found</div>}
                                                    </div>
                                                )}
                                            </div>

                                            {/* City */}
                                            <div className="relative" ref={cityRef}>
                                                <input
                                                    type="text"
                                                    placeholder={locationLoading.cities ? "Loading cities..." : "City *"}
                                                    value={citySearch}
                                                    onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                                                    onFocus={() => setShowCityDropdown(true)}
                                                    disabled={!formData.stateIsoCode || locationLoading.cities}
                                                    required
                                                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                {showCityDropdown && cities.length > 0 && !locationLoading.cities && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredCities.length > 0 ? filteredCities.map((c, i) => (
                                                            <div key={i} onClick={() => handleCitySelect(c)}
                                                                className="px-4 py-2.5 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0">
                                                                <span className="font-medium">{c}</span>
                                                            </div>
                                                        )) : <div className="px-4 py-3 text-gray-500 text-sm">No cities found</div>}
                                                    </div>
                                                )}
                                            </div>

                                            <input type="text" name="pin" placeholder="PIN Code *" value={formData.pin} onChange={handleInputChange} required maxLength="6"
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />

                                            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />
                                        </div>

                                        <input type="text" name="street" placeholder="Street Address *" value={formData.street} onChange={handleInputChange} required
                                            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all" />

                                        <button type="submit"
                                            className="w-full bg-black text-white py-4 rounded-lg font-bold text-base hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl transition-all mt-6">
                                            SEND OTP
                                        </button>
                                        <p className="text-xs text-gray-500 mt-4 px-2">By continuing, you agree to receive promotional emails and SMS</p>
                                    </form>
                                </div>
                            )}

                            {/* OTP Verification */}
                            {!showWheel && showOtpVerification && (
                                <div className="text-center max-w-md mx-auto">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                                        <p className="text-gray-600 mb-2">We've sent a 6-digit code to</p>
                                        <p className="text-gray-800 font-semibold text-lg mb-6">+91 {formData.mobile}</p>
                                    </div>

                                    <div className="mb-6">
                                        <input type="text" placeholder="Enter 6-digit OTP" value={otp}
                                            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                                            maxLength="6"
                                            className="w-full px-6 py-4 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all tracking-widest"
                                            autoFocus />
                                        {otpError && <p className="text-red-500 text-sm mt-3">{otpError}</p>}
                                    </div>

                                    <button type="button" onClick={handleVerifyOtp} disabled={otp.length !== 6 || isVerifying}
                                        className={`w-full py-4 rounded-lg font-bold text-base transition-all mb-4 ${otp.length !== 6 || isVerifying ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl'}`}>
                                        {isVerifying ? 'VERIFYING...' : 'VERIFY OTP'}
                                    </button>

                                    <div className="text-center mb-4">
                                        {resendTimer > 0
                                            ? <p className="text-gray-600 text-sm">Resend OTP in <span className="font-semibold">{resendTimer}s</span></p>
                                            : <button type="button" onClick={handleRegister} className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">Resend OTP</button>
                                        }
                                    </div>

                                    <button type="button" onClick={handleBackToForm} className="text-gray-600 text-sm hover:text-gray-800 transition-colors">
                                        ← Change Mobile Number
                                    </button>
                                </div>
                            )}

                            {/* Wheel */}
                            {showWheel && (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Spin the Wheel!</h2>
                                    <p className="text-gray-600 mb-6">Click the button below to spin</p>

                                    <div className="relative w-80 h-80 mx-auto mb-8">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500 z-10 drop-shadow-lg" />
                                        <div
                                            className="w-full h-full rounded-full relative overflow-hidden shadow-2xl transition-transform duration-[4000ms] ease-out"
                                            style={{ transform: `rotate(${rotation}deg)` }}
                                        >
                                            {prizes?.map((prize, index) => {
                                                const isBlack = index % 2 === 0;
                                                return (
                                                    <div key={index}
                                                        className={`absolute w-1/2 h-1/2 origin-bottom-right ${isBlack ? 'bg-black' : 'bg-[#f5f5dc]'}`}
                                                        style={{ transform: `rotate(${index * 60}deg)`, clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                                                    >
                                                        <span className={`absolute left-[65%] top-[30%] -translate-x-1/2 rotate-[45deg] ${isBlack ? 'text-white' : 'text-gray-800'} font-bold text-xs text-center w-24 leading-tight whitespace-normal`}>
                                                            {prize.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg z-10" />
                                        </div>
                                    </div>

                                    <button onClick={handleSpin} disabled={isSpinning || hasSpun}
                                        className={`w-full py-4 rounded-lg font-bold text-base transition-all ${isSpinning || hasSpun ? 'bg-gray-600 cursor-not-allowed opacity-60' : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl'}`}>
                                        {hasSpun ? 'ALREADY PLAYED' : isSpinning ? 'SPINNING...' : 'SPIN MY WHEEL'}
                                    </button>

                                    {showResult && selectedPrize && (
                                        <div className="mt-4 bg-white p-4 rounded-lg animate-bounceIn shadow-lg">
                                            <h3 className="text-xl font-bold text-red-500 mb-2">🎉 Congratulations!</h3>
                                            <p className="text-gray-700 text-sm font-bold mb-1">{selectedPrize.rewardTitle}</p>
                                            <p className="text-gray-600 text-xs mb-2">on {selectedPrize.productName}</p>
                                            {selectedPrize.couponCode && (
                                                <>
                                                    <div className="bg-[#f5f5dc] py-2 px-3 rounded-lg font-bold text-gray-800 text-lg tracking-wider my-2">{selectedPrize.couponCode}</div>
                                                    <p className="text-xs text-gray-600">apply at checkout</p>
                                                </>
                                            )}
                                            {selectedPrize.expiresAt && (
                                                <p className="text-xs text-red-400 mt-2">⏰ Expires: {new Date(selectedPrize.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', minute: '2-digit', hour: '2-digit' })}</p>
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
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes bounceIn { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                .animate-fadeIn { animation: fadeIn 0.3s ease; }
                .animate-slideIn { animation: slideIn 0.4s ease; }
                .animate-bounceIn { animation: bounceIn 0.6s ease; }
            `}</style>
        </>
    );
};

export default SpinToWin;