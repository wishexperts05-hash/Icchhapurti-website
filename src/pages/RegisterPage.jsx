import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Loader, Search, ChevronDown, X } from 'lucide-react';
import { setLoginTimestamp } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL;

// Cache helpers using sessionStorage
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

const Register = () => {
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
    street: "",
    pinCode: "",
    dob: ""
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [token, setToken] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [searchTerms, setSearchTerms] = useState({
    countryCode: '',
    country: '',
    state: '',
    city: ''
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Loading states for each dropdown
  const [loadingStates, setLoadingStates] = useState({
    countries: false,
    states: false,
    cities: false
  });

  const Navigate = useNavigate();

  const countryCodes = [
    { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" }
  ];

  const filteredCountryCodes = countryCodes.filter(cc =>
    `${cc.code} ${cc.country}`.toLowerCase().includes(searchTerms.countryCode.toLowerCase())
  );
  const filteredCountries = countries.filter(c =>
    c.country.toLowerCase().includes(searchTerms.country.toLowerCase())
  );
  const filteredStates = states.filter(s =>
    s.name.toLowerCase().includes(searchTerms.state.toLowerCase())
  );
  const filteredCities = cities.filter(c =>
    c.toLowerCase().includes(searchTerms.city.toLowerCase())
  );

  // ─── API CALLS ────────────────────────────────────────────────

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

  // ─── EFFECTS ──────────────────────────────────────────────────

  // Load countries on mount
  useEffect(() => {
    fetchCountries().then(allCountries => {
      // Load default India states
      fetchStates('IN');
      // Then detect location
      detectUserLocation(allCountries);
    });
  }, []);

  // Close dropdown on outside click
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

  // ─── LOCATION DETECTION ───────────────────────────────────────

  const detectUserLocation = async (allCountries) => {
    if (!allCountries || allCountries.length === 0) return;
    setLocationLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const components = data.results[0].components;
            const countryCode = components.country_code?.toUpperCase();

            // Find country from our API data (field is 'isoCode')
            const foundCountry = allCountries.find(c => c.isoCode === countryCode);

            if (foundCountry) {
              setFormData(prev => ({
                ...prev,
                countryIsoCode: foundCountry.isoCode,
                country: foundCountry.country,
                pinCode: components.postcode || prev.pinCode
              }));

              const countryStates = await fetchStates(foundCountry.isoCode);
              const stateName = components.state;

              if (stateName && countryStates.length > 0) {
                const foundState = countryStates.find(s =>
                  s.name.toLowerCase() === stateName.toLowerCase()
                );
                if (foundState) {
                  setFormData(prev => ({
                    ...prev,
                    stateIsoCode: foundState.isoCode,
                    state: foundState.name
                  }));

                  const stateCities = await fetchCities(foundCountry.isoCode, foundState.isoCode);
                  const cityName = components.city || components.town;

                  if (cityName && stateCities.length > 0) {
                    const foundCity = stateCities.find(c =>
                      c.toLowerCase() === cityName.toLowerCase()
                    );
                    setFormData(prev => ({
                      ...prev,
                      city: foundCity || cityName
                    }));
                  }
                }
              }
            }
          }
        } catch (error) {
          setLocationError("Could not detect location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError("Location permission denied");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ─── HANDLERS ─────────────────────────────────────────────────

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.pinCode || !/^[0-9]{6}$/.test(formData.pinCode)) newErrors.pinCode = "Pin code must be 6 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectCountryCode = (code) => {
    setFormData(prev => ({ ...prev, countryCode: code }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, countryCode: '' }));
  };

  const handleSelectCountry = async (countryIsoCode) => {
    const selectedCountry = countries.find(c => c.isoCode === countryIsoCode);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        countryIsoCode: selectedCountry.isoCode,
        country: selectedCountry.country,   // field is 'country' from our API
        state: "",
        stateIsoCode: "",
        city: ""
      }));
      setStates([]);
      setCities([]);
      if (errors.country) setErrors(prev => ({ ...prev, country: "" }));
      await fetchStates(countryIsoCode);
    }
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, country: '' }));
  };

  const handleSelectState = async (stateIsoCode) => {
    const selectedState = states.find(s => s.isoCode === stateIsoCode);
    if (selectedState) {
      setFormData(prev => ({
        ...prev,
        stateIsoCode: selectedState.isoCode,
        state: selectedState.name,
        city: ""
      }));
      setCities([]);
      if (errors.state) setErrors(prev => ({ ...prev, state: "" }));
      await fetchCities(formData.countryIsoCode, stateIsoCode);
    }
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, state: '' }));
  };

  const handleSelectCity = (cityName) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, city: '' }));
  };

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
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          state: formData.state,
          street: formData.street,
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
      localStorage.removeItem("cartItems");
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
        localStorage.setItem("referralCode", data.refferralCode);
        setLoginTimestamp();
        syncLocalCartToServer(data.token);
        setShowOtpModal(false);
        alert("Registration Successful!");
        setFormData({
          name: "", email: "", phoneNumber: "", countryCode: "+91",
          countryIsoCode: "IN", country: "", stateIsoCode: "", state: "",
          city: "", street: "", pinCode: "", dob: ""
        });
        setOtp("");
        Navigate("/");
      } else {
        setApiError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setApiError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ─── DROPDOWN COMPONENT ───────────────────────────────────────

  const SearchDropdown = ({
    field, label, options, value, onSelect,
    disabled, renderOption, getOptionValue, placeholder, isLoading
  }) => (
    <div ref={el => dropdownRefs.current[field] = el} className="relative">
      <div
        onClick={() => !disabled && !isLoading && setOpenDropdown(openDropdown === field ? null : field)}
        className={`w-full px-4 py-3 bg-gray-50 border ${errors[field] ? 'border-red-500' : 'border-gray-200'} ${(disabled || isLoading) ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'} rounded-lg flex items-center justify-between hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {isLoading ? 'Loading...' : (value || placeholder)}
        </span>
        {isLoading
          ? <Loader className="w-4 h-4 text-gray-400 animate-spin" />
          : <ChevronDown className="w-4 h-4 text-gray-500" />
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
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-full">
      {/* LEFT SIDE - VIDEO BACKGROUND */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <img src="/logo-white.png" alt="Logo" className="h-20 w-auto drop-shadow-2xl" />
        </div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* RIGHT SIDE - REGISTER FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-y-auto">
        <div className="w-full max-w-lg my-8">
          <div className="text-center mb-6">
            <img src="/logo-white.png" alt="Logo" className="h-16 mx-auto mb-4" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500 text-sm">Join us today and start your journey</p>
            </div>

            {/* Location detection status */}
            {locationLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                <Loader className="w-4 h-4 animate-spin" />
                Detecting your location...
              </div>
            )}
            {locationError && (
              <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg mb-4">
                {locationError}
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleGetOtp} className="space-y-4">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="flex gap-2">
                  <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-28">
                    <div
                      onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between hover:border-gray-900 transition-all"
                    >
                      <span className="text-gray-900 text-sm">{formData.countryCode}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                    {openDropdown === 'countryCode' && (
                      <div className="absolute z-50 w-72 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden" onMouseDown={(e) => e.preventDefault()}>
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              type="text" value={searchTerms.countryCode}
                              onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))}
                              placeholder="Search..."
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCountryCodes.map((cc) => (
                            <div
                              key={cc.code}
                              onMouseDown={(e) => { e.preventDefault(); handleSelectCountryCode(cc.code); }}
                              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            >
                              {cc.flag} {cc.code} - {cc.country}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="tel" name="phoneNumber" value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value.replace(/\D/g, '') }))}
                    maxLength="10"
                    className={`flex-1 px-4 py-3 bg-gray-50 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                    placeholder="10-digit mobile number"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Country and Street */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <SearchDropdown
                    field="country" label="Country"
                    options={filteredCountries}
                    value={formData.country}
                    onSelect={handleSelectCountry}
                    disabled={false}
                    isLoading={loadingStates.countries}
                    renderOption={(c) => `${c.flag || ''} ${c.country}`}
                    getOptionValue={(c) => c.isoCode}
                    placeholder="Select Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                  <input
                    type="text" name="street" value={formData.street} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.street ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                    placeholder="Street address"
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
              </div>

              {/* State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <SearchDropdown
                    field="state" label="State"
                    options={filteredStates}
                    value={formData.state}
                    onSelect={handleSelectState}
                    disabled={!formData.countryIsoCode}
                    isLoading={loadingStates.states}
                    renderOption={(s) => s.name}
                    getOptionValue={(s) => s.isoCode}
                    placeholder="Select State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <SearchDropdown
                    field="city" label="City"
                    options={filteredCities}
                    value={formData.city}
                    onSelect={handleSelectCity}
                    disabled={!formData.stateIsoCode}
                    isLoading={loadingStates.cities}
                    renderOption={(c) => c}
                    getOptionValue={(c) => c}
                    placeholder="Select City"
                  />
                </div>
              </div>

              {/* Pin Code and DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code *</label>
                  <input
                    type="text" name="pinCode" value={formData.pinCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '') }))}
                    maxLength="6"
                    className={`w-full px-4 py-3 bg-gray-50 border ${errors.pinCode ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900`}
                    placeholder="6-digit PIN code"
                  />
                  {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth (Optional)</label>
                  <input
                    type="date" name="dob" value={formData.dob} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md mt-2"
              >
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-gray-900 font-semibold hover:underline">Login</Link>
            </p>
            <button
              type="button" onClick={() => Navigate("/")}
              className="mt-4 w-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-gray-900">Verify OTP</h3>
              <button
                onClick={() => { setShowOtpModal(false); setOtp(""); setApiError(""); }}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none w-8 h-8 flex items-center justify-center"
              >×</button>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                {apiError}
              </div>
            )}

            <p className="text-sm text-gray-600 mb-2">We've sent a 6-digit code to</p>
            <p className="text-base font-semibold text-gray-900 mb-6">
              {formData.countryCode} {formData.phoneNumber}
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP</label>
                <input
                  type="text" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold"
                  placeholder="• • • • • •" maxLength="6"
                />
              </div>
              <button
                onClick={handleVerifyOtp} disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>
              <button
                onClick={handleGetOtp} disabled={loading}
                className="w-full text-gray-700 hover:text-gray-900 font-medium disabled:text-gray-400 py-2"
              >
                Resend OTP
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Didn't receive the code? Try resending.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;