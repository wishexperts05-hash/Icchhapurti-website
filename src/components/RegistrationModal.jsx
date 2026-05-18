import React, { useState, useEffect, useRef } from "react";
import { Loader, Search, ChevronDown, X } from 'lucide-react';
import { createPortal } from "react-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

// ── sessionStorage cache helpers ──────────────────────────────
const cache = {
    get: (key) => {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch { return null; }
    },
    set: (key, value) => {
        try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { }
    }
};

const RegistrationModal = ({ isOpen, onClose, setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        countryCode: "+91",
        countryIsoCode: "IN",
        country: "India",
        stateIsoCode: "",
        state: "",
        city: "",
        pinCode: "",
        street: ""
    });

    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [token, setToken] = useState("");

    const [searchTerms, setSearchTerms] = useState({
        countryCode: '',
        country: '',
        state: '',
        city: ''
    });
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRefs = useRef({});

    // Data from API
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Per-dropdown loading spinners
    const [loadingStates, setLoadingStates] = useState({
        countries: false,
        states: false,
        cities: false
    });

    // ── API CALLS ────────────────────────────────────────────────

    const fetchCountries = async () => {
        const cached = cache.get('all_countries');
        if (cached) { setCountries(cached); return cached; }

        setLoadingStates(prev => ({ ...prev, countries: true }));
        try {
            const res = await fetch(`${BASE_URL}/api/user/location/countries`);
            const data = await res.json();
            if (data.success) {
                cache.set('all_countries', data.data);
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
        const cached = cache.get(cacheKey);
        if (cached) { setStates(cached); return cached; }

        setLoadingStates(prev => ({ ...prev, states: true }));
        setCities([]);
        try {
            const res = await fetch(`${BASE_URL}/api/user/location/states?country=${countryIsoCode}`);
            const data = await res.json();
            if (data.success) {
                cache.set(cacheKey, data.data);
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
        const cached = cache.get(cacheKey);
        if (cached) { setCities(cached); return cached; }

        setLoadingStates(prev => ({ ...prev, cities: true }));
        try {
            const res = await fetch(`${BASE_URL}/api/user/location/cities?country=${countryIsoCode}&state=${stateIsoCode}`);
            const data = await res.json();
            if (data.success) {
                cache.set(cacheKey, data.data);
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

    // ── FILTERED OPTIONS ─────────────────────────────────────────

    // countries array items: { isoCode, country, phonecode, flag? }
    const filteredCountryCodes = countries.filter(c =>
        `+${c.phonecode} ${c.country}`.toLowerCase().includes(searchTerms.countryCode.toLowerCase())
    );
    const filteredCountries = countries.filter(c =>
        c.country.toLowerCase().includes(searchTerms.country.toLowerCase())
    );
    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes(searchTerms.state.toLowerCase())
    );
    // cities from API are plain strings
    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes(searchTerms.city.toLowerCase())
    );

    // ── EFFECTS ──────────────────────────────────────────────────

    useEffect(() => {
        if (isOpen) {
            fetchCountries().then(async (allCountries) => {
                // Pre-load India's states since default country is India
                const india = allCountries.find(c => c.isoCode === 'IN');
                if (india) await fetchStates('IN');
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && dropdownRefs.current[openDropdown]) {
                if (!dropdownRefs.current[openDropdown].contains(event.target)) {
                    setOpenDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !showOtpModal) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, showOtpModal, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ── HANDLERS ─────────────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSelectCountryCode = (phonecode) => {
        const matched = countries.find(c => c.phonecode === phonecode);
        setFormData(prev => ({
            ...prev,
            countryCode: `+${phonecode}`,
            ...(matched ? {
                countryIsoCode: matched.isoCode,
                country: matched.country,
                stateIsoCode: '', state: '', city: ''
            } : {})
        }));
        if (matched) { setStates([]); setCities([]); fetchStates(matched.isoCode); }
        setOpenDropdown(null);
        setSearchTerms(prev => ({ ...prev, countryCode: '' }));
    };

    const handleSelectCountry = async (isoCode) => {
        const selected = countries.find(c => c.isoCode === isoCode);
        if (!selected) return;
        setFormData(prev => ({
            ...prev,
            countryIsoCode: selected.isoCode,
            country: selected.country,
            countryCode: selected.phonecode ? `+${selected.phonecode}` : prev.countryCode,
            stateIsoCode: '', state: '', city: ''
        }));
        setStates([]); setCities([]);
        if (errors.country) setErrors(prev => ({ ...prev, country: "" }));
        await fetchStates(selected.isoCode);
        setOpenDropdown(null);
        setSearchTerms(prev => ({ ...prev, country: '' }));
    };

    const handleSelectState = async (isoCode) => {
        const selected = states.find(s => s.isoCode === isoCode);
        if (!selected) return;
        setFormData(prev => ({
            ...prev,
            stateIsoCode: selected.isoCode,
            state: selected.name,
            city: ''
        }));
        setCities([]);
        if (errors.state) setErrors(prev => ({ ...prev, state: "" }));
        await fetchCities(formData.countryIsoCode, isoCode);
        setOpenDropdown(null);
        setSearchTerms(prev => ({ ...prev, state: '' }));
    };

    const handleSelectCity = (cityName) => {
        setFormData(prev => ({ ...prev, city: cityName }));
        if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
        setOpenDropdown(null);
        setSearchTerms(prev => ({ ...prev, city: '' }));
    };

    // ── VALIDATION ───────────────────────────────────────────────

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim() || formData.name.trim().length < 3)
            newErrors.name = "Name must be at least 3 characters";
        if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber))
            newErrors.phoneNumber = "Phone number must be 10 digits";
        if (!formData.country)
            newErrors.country = "Country is required";
        if (!formData.state)
            newErrors.state = "State is required";
        if (!formData.city)
            newErrors.city = "City is required";
        if (!formData.pinCode || !/^[0-9]{6}$/.test(formData.pinCode))
            newErrors.pinCode = "Pin code must be 6 digits";
        if (!formData.street)
            newErrors.street = "Street is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── API SUBMIT ───────────────────────────────────────────────

    const handleGetOtp = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    street: formData.street,
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    pinCode: formData.pinCode,
                    dob: formData.dob
                })
            });
            const data = await response.json();
            if (data.success) {
                setToken(data.registrationToken);
                setShowOtpModal(true);
            } else {
                setApiError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setApiError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const syncLocalCartToServer = async (token) => {
        try {
            const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
            if (localCart.length === 0) return;
            for (let item of localCart) {
                await fetch(`${BASE_URL}/api/user/cart/addToCart`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ productId: item.productId, quantity: item.quantity, totalAmount: item.totalAmount })
                });
            }
            window.dispatchEvent(new CustomEvent("cartUpdated"));
        } catch (error) {
            console.error("Error syncing cart:", error);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setApiError("Please enter valid 6-digit OTP");
            return;
        }
        setLoading(true);
        setApiError("");
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
                await syncLocalCartToServer(data.token);
                setShowOtpModal(false);
                setFormData({
                    name: "", email: "", phoneNumber: "", street: "",
                    countryCode: "+91", countryIsoCode: "IN", country: "India",
                    stateIsoCode: "", state: "", city: "", pinCode: "", dob: ""
                });
                setOtp("");
                setIsAuthenticated(true);
                onClose();
            } else {
                setApiError(data.message || "Invalid OTP");
            }
        } catch (err) {
            setApiError("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // ── SEARCHABLE DROPDOWN ───────────────────────────────────────

    const SearchDropdown = ({
        field, label, options, value, onSelect,
        disabled, renderOption, getOptionValue, placeholder, isLoading
    }) => (
        <div ref={el => dropdownRefs.current[field] = el} className="relative">
            <div className={disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
                <div
                    onClick={() => !disabled && !isLoading && setOpenDropdown(openDropdown === field ? null : field)}
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors[field] ? 'border-red-500' : 'border-gray-200'} ${disabled || isLoading ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'} rounded-lg flex items-center justify-between hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                >
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                        {isLoading ? 'Loading...' : (value || placeholder)}
                    </span>
                    {isLoading
                        ? <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                        : <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === field ? 'rotate-180' : ''}`} />
                    }
                </div>

                {openDropdown === field && !disabled && !isLoading && (
                    <div
                        className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchTerms[field]}
                                    onChange={(e) => setSearchTerms(prev => ({ ...prev, [field]: e.target.value }))}
                                    placeholder={`Search ${label.toLowerCase()}...`}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                            ) : (
                                options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        onMouseDown={(e) => { e.preventDefault(); onSelect(getOptionValue(option)); }}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900"
                                    >
                                        {renderOption(option)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (!isOpen) return null;

    return createPortal(
        <>
            {/* Main Registration Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500 text-sm">Join us today and start your journey</p>
                        </div>

                        {/* API Error Alert */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                                <p>{apiError}</p>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleGetOtp} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email and Phone Number Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <div className="flex gap-2">
                                        {/* Country Code Dropdown */}
                                        <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-28">
                                            <div
                                                onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
                                                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:border-gray-900 transition-all"
                                            >
                                                <span className="text-gray-900 text-sm">{formData.countryCode || '+91'}</span>
                                                <ChevronDown className="w-3 h-3 text-gray-500" />
                                            </div>

                                            {openDropdown === 'countryCode' && (
                                                <div
                                                    className="absolute z-50 w-64 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                >
                                                    <div className="p-2 border-b border-gray-200">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                            <input
                                                                type="text"
                                                                value={searchTerms.countryCode}
                                                                onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))}
                                                                placeholder="Search country code..."
                                                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {filteredCountryCodes.length === 0 ? (
                                                            <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                                                        ) : (
                                                            filteredCountryCodes.map(c => (
                                                                <div
                                                                    key={c.isoCode}
                                                                    onMouseDown={(e) => { e.preventDefault(); handleSelectCountryCode(c.phonecode); }}
                                                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900"
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
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value.replace(/\D/g, '') }))}
                                            maxLength="10"
                                            className={`flex-1 px-4 py-3 bg-gray-50 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                                            placeholder="10-digit mobile"
                                        />
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                <SearchDropdown
                                    field="country"
                                    label="Country"
                                    options={filteredCountries}
                                    value={formData.country}
                                    onSelect={handleSelectCountry}
                                    disabled={false}
                                    isLoading={loadingStates.countries}
                                    renderOption={(c) => `${c.flag || ''} ${c.country}`}
                                    getOptionValue={(c) => c.isoCode}
                                    placeholder="Select Country"
                                />
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>

                            {/* State and City */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <SearchDropdown
                                        field="state"
                                        label="State"
                                        options={filteredStates}
                                        value={formData.state}
                                        onSelect={handleSelectState}
                                        disabled={!formData.countryIsoCode}
                                        isLoading={loadingStates.states}
                                        renderOption={(s) => s.name}
                                        getOptionValue={(s) => s.isoCode}
                                        placeholder="Select State"
                                    />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <SearchDropdown
                                        field="city"
                                        label="City"
                                        options={filteredCities}
                                        value={formData.city}
                                        onSelect={handleSelectCity}
                                        disabled={!formData.stateIsoCode}
                                        isLoading={loadingStates.cities}
                                        renderOption={(c) => c}
                                        getOptionValue={(c) => c}
                                        placeholder="Select City"
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                            </div>

                            {/* Pin Code and Street */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code *</label>
                                    <input
                                        type="text"
                                        name="pinCode"
                                        value={formData.pinCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '') }))}
                                        maxLength="6"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.pinCode ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                                        placeholder="6-digit PIN"
                                    />
                                    {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.street ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                                        placeholder="Street address"
                                    />
                                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md mt-2"
                            >
                                {loading ? 'Sending OTP...' : 'Get OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-serif font-bold text-gray-900">Verify OTP</h3>
                            <button
                                onClick={() => { setShowOtpModal(false); setOtp(""); setApiError(""); }}
                                className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none w-8 h-8 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>

                        {apiError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                                <p>{apiError}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">We've sent a 6-digit code to</p>
                            <p className="text-base font-semibold text-gray-900 mb-6">
                                {formData.countryCode} {formData.phoneNumber}
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-2xl tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                                placeholder="• • • • • •"
                                maxLength="6"
                            />
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed mb-3 transition-all shadow-sm hover:shadow-md"
                        >
                            {loading ? 'Verifying...' : 'Verify & Register'}
                        </button>

                        <button
                            onClick={handleGetOtp}
                            disabled={loading}
                            className="w-full text-gray-700 hover:text-gray-900 font-medium disabled:text-gray-400 py-2 transition-colors"
                        >
                            Resend OTP
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Didn't receive the code? Check your phone or try resending.
                        </p>
                    </div>
                </div>
            )}
        </>,
        document.getElementById('root') || document.body
    );
};

export default RegistrationModal;