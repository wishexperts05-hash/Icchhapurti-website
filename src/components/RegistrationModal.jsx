
import React, { useState, useEffect, useRef } from "react";
import { Country, State, City } from 'country-state-city';
import { MapPin, Loader, Search, ChevronDown, X } from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose ,setIsAuthenticated}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "example@gmail12.com1",
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
        c.name.toLowerCase().includes(searchTerms.country.toLowerCase())
    );
    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes(searchTerms.state.toLowerCase())
    );
    const filteredCities = cities.filter(c =>
        c.name.toLowerCase().includes(searchTerms.city.toLowerCase())
    );

    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);

    useEffect(() => {
        if (formData.countryIsoCode) {
            const countryStates = State.getStatesOfCountry(formData.countryIsoCode);
            setStates(countryStates);
            setCities([]);
        }
    }, [formData.countryIsoCode]);

    useEffect(() => {
        if (formData.countryIsoCode && formData.stateIsoCode) {
            const stateCities = City.getCitiesOfState(formData.countryIsoCode, formData.stateIsoCode);
            setCities(stateCities);
        }
    }, [formData.stateIsoCode]);

    useEffect(() => {
        if (countries.length > 0) {
            detectUserLocation();
        }
    }, [countries]);

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

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !showOtpModal) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, showOtpModal, onClose]);

    const detectUserLocation = async () => {
        if (countries.length === 0) return;
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
                        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
                    );
                    const data = await response.json();

                    if (data.results && data.results.length > 0) {
                        const components = data.results[0].components;
                        const countryCode = components.country_code?.toUpperCase();
                        const foundCountry = countries.find(c => c.isoCode === countryCode);

                        if (foundCountry) {
                            setFormData(prev => ({ 
                                ...prev, 
                                countryIsoCode: foundCountry.isoCode, 
                                country: foundCountry.name, 
                                pinCode: components.postcode || prev.pinCode 
                            }));
                            const countryStates = State.getStatesOfCountry(foundCountry.isoCode);
                            setStates(countryStates);

                            const stateName = components.state;
                            if (stateName) {
                                const foundState = countryStates.find(s => s.name.toLowerCase() === stateName.toLowerCase());
                                if (foundState) {
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        stateIsoCode: foundState.isoCode, 
                                        state: foundState.name 
                                    }));
                                    const stateCities = City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode);
                                    setCities(stateCities);

                                    const cityName = components.city || components.town;
                                    if (cityName) {
                                        const foundCity = stateCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            city: foundCity ? foundCity.name : cityName 
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
            (error) => {
                setLocationError("Location permission denied");
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

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

    const handleSelectCountry = (countryIsoCode) => {
        const selectedCountry = countries.find(c => c.isoCode === countryIsoCode);
        if (selectedCountry) {
            setFormData(prev => ({ 
                ...prev, 
                countryIsoCode: selectedCountry.isoCode, 
                country: selectedCountry.name, 
                state: "", 
                stateIsoCode: "", 
                city: "" 
            }));
            if (errors.country) setErrors(prev => ({ ...prev, country: "" }));
        }
        setOpenDropdown(null);
        setSearchTerms(prev => ({ ...prev, country: '' }));
    };

    const handleSelectState = (stateIsoCode) => {
        const selectedState = states.find(s => s.isoCode === stateIsoCode);
        if (selectedState) {
            setFormData(prev => ({ 
                ...prev, 
                stateIsoCode: selectedState.isoCode, 
                state: selectedState.name, 
                city: "" 
            }));
            if (errors.state) setErrors(prev => ({ ...prev, state: "" }));
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phoneNumber: formData.phoneNumber, country: formData.country, state: formData.state, city: formData.city, pinCode: formData.pinCode, dob: formData.dob })
      });

      const data = await response.json();
      if (data.success) {
        setToken(data.registrationToken);
        setShowOtpModal(true);
        alert(data.otp);
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/addToCart`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ productId: item.productId, quantity: item.quantity, totalAmount: item.totalAmount })
        });
      }
    //   localStorage.removeItem("cartItems");
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verifyRegisterOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ otp })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);
        syncLocalCartToServer(data.token);

        await saveAddress()
        setShowOtpModal(false);
        // alert("Registration Successful!");
        setFormData({ name: "", email: "", phoneNumber: "", countryCode: "+91", countryIsoCode: "IN", country: "", stateIsoCode: "", state: "", city: "", pinCode: "", dob: "" });
        setOtp("");
        setIsAuthenticated(true)
        onClose()
        // Navigate("/homePage");
      } else {
        setApiError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setApiError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

    const SearchDropdown = ({ field, label, options, value, onSelect, disabled, renderOption, getOptionValue, placeholder }) => (
        <div ref={el => dropdownRefs.current[field] = el} className="relative">
            <div
                onClick={() => !disabled && setOpenDropdown(openDropdown === field ? null : field)}
                className={`w-full border ${errors[field] ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-yellow-500'} px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors`}
            >
                <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value || placeholder}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === field ? 'rotate-180' : ''}`} />
            </div>

            {openDropdown === field && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden" onMouseDown={(e) => e.preventDefault()}>
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchTerms[field]}
                                onChange={(e) => setSearchTerms(prev => ({ ...prev, [field]: e.target.value }))}
                                placeholder={`Search ${label.toLowerCase()}...`}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onSelect(getOptionValue(option));
                                    }}
                                    className="px-4 py-2 hover:bg-yellow-50 cursor-pointer text-sm text-gray-800 transition-colors"
                                >
                                    {renderOption(option)}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );


     const saveAddress = async () => {
   
    // setLoading(true);
    try {
      const addressData = {
        fullName: formData.name,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        street: formData.street,
        pinCode: formData.pinCode
      };
      const url =  `${import.meta.env.VITE_API_URL}/api/user/address/addAddress`;
      const method =  'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(addressData)
      });
     
    } catch (error) {
      console.error('Error submitting:', error);
      alert(t('addressForm.messages.networkError'));
    } finally {
    //   setLoading(false);
    }
  };

useEffect(() => {
  if (isOpen) {
    // Disable background scroll
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [isOpen]);


    if (!isOpen) return null;

    return (
        <>
            {/* Main Registration Modal */}
            <div className="fixed inset-0 z-50 top-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                            <p className="text-gray-600 text-sm">Join us today and get started</p>
                        </div>

                        {/* Location Loading Alert */}
                        {locationLoading && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4 flex items-center text-sm">
                                <Loader className="animate-spin mr-2 flex-shrink-0" size={16} />
                                <p>Detecting your location...</p>
                            </div>
                        )}

                        {/* Location Error Alert */}
                        {locationError && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
                                <p>{locationError}</p>
                            </div>
                        )}

                        {/* API Error Alert */}
                        {apiError && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                                <p>{apiError}</p>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleGetOtp} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all`}
                                    placeholder="Enter your full name" 
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all`}
                                    placeholder="your.email@example.com" 
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div> */}

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <div className="flex gap-2">
                                    <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-28">
                                        <div 
                                            onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')} 
                                            className="border border-gray-300 px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center justify-between hover:border-yellow-500 transition-colors"
                                        >
                                            <span>{formData.countryCode}</span>
                                            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'countryCode' ? 'rotate-180' : ''}`} />
                                        </div>

                                        {openDropdown === 'countryCode' && (
                                            <div className="absolute z-50 w-64 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden" onMouseDown={(e) => e.preventDefault()}>
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                        <input 
                                                            type="text" 
                                                            value={searchTerms.countryCode} 
                                                            onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))} 
                                                            placeholder="Search code..." 
                                                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                                                            autoFocus 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredCountryCodes.map((cc) => (
                                                        <div 
                                                            key={cc.code} 
                                                            onMouseDown={(e) => { 
                                                                e.preventDefault(); 
                                                                handleSelectCountryCode(cc.code); 
                                                            }} 
                                                            className="px-4 py-2 hover:bg-yellow-50 cursor-pointer text-sm transition-colors"
                                                        >
                                                            {cc.flag} {cc.code} - {cc.country}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input 
                                        type="tel" 
                                        name="phoneNumber" 
                                        value={formData.phoneNumber} 
                                        onChange={handleChange} 
                                        maxLength="10" 
                                        className={`flex-1 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all`}
                                        placeholder="10-digit mobile" 
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>

                            {/* Country */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Country *</label>
                                    <button 
                                        type="button" 
                                        onClick={detectUserLocation} 
                                        disabled={locationLoading} 
                                        className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1 disabled:text-gray-400 transition-colors"
                                    >
                                        <MapPin size={12} />
                                        {locationLoading ? 'Detecting...' : 'Auto-detect'}
                                    </button>
                                </div>
                                <SearchDropdown 
                                    field="country" 
                                    label="Country" 
                                    options={filteredCountries} 
                                    value={formData.country} 
                                    onSelect={handleSelectCountry} 
                                    disabled={false} 
                                    renderOption={(c) => `${c.flag} ${c.name}`} 
                                    getOptionValue={(c) => c.isoCode} 
                                    placeholder="Select Country" 
                                />
                                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                            </div>

                            {/* State and City */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <SearchDropdown 
                                        field="state" 
                                        label="State" 
                                        options={filteredStates} 
                                        value={formData.state} 
                                        onSelect={handleSelectState} 
                                        disabled={!formData.countryIsoCode} 
                                        renderOption={(s) => s.name} 
                                        getOptionValue={(s) => s.isoCode} 
                                        placeholder="Select State" 
                                    />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <SearchDropdown 
                                        field="city" 
                                        label="City" 
                                        options={filteredCities} 
                                        value={formData.city} 
                                        onSelect={handleSelectCity} 
                                        disabled={!formData.stateIsoCode} 
                                        renderOption={(c) => c.name} 
                                        getOptionValue={(c) => c.name} 
                                        placeholder="Select City" 
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                            </div>

                            {/* Pin Code and DOB */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code *</label>
                                    <input 
                                        type="text" 
                                        name="pinCode" 
                                        value={formData.pinCode} 
                                        onChange={handleChange} 
                                        maxLength="6" 
                                        className={`w-full border ${errors.pinCode ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all`}
                                        placeholder="6-digit PIN" 
                                    />
                                    {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                                    <input 
                                        type="text" 
                                        name="street" 
                                        value={formData.street} 
                                        onChange={handleChange} 
                                        className={`w-full border ${errors.street ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all`}
                                    />
                                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit"
                                disabled={loading} 
                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Sending OTP...' : 'Get OTP'}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 text-center space-y-3">
                            <p className="text-gray-600 text-sm">
                                Already have an account?
                                <button 
                                    onClick={onClose}
                                    className="ml-1 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Verify OTP</h3>
                            <button 
                                onClick={() => { 
                                    setShowOtpModal(false); 
                                    setOtp(""); 
                                    setApiError(""); 
                                }} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {apiError && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                                <p className="text-sm">{apiError}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">We've sent a 6-digit code to</p>
                            <p className="text-lg font-semibold text-gray-800 mb-4">
                                {formData.countryCode} {formData.phoneNumber}
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-center text-2xl tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" 
                                placeholder="000000" 
                                maxLength="6" 
                            />
                        </div>

                        <button 
                            onClick={handleVerifyOtp} 
                            disabled={loading} 
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed mb-3 transition-all"
                        >
                            {loading ? 'Verifying...' : 'Verify & Register'}
                        </button>

                        <button 
                            onClick={handleGetOtp} 
                            disabled={loading} 
                            className="w-full text-yellow-600 hover:text-yellow-700 font-semibold py-2 disabled:text-gray-400 transition-colors"
                        >
                            Resend OTP
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Didn't receive the code? Check your phone or try resending.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};


export default RegistrationModal