import React, { useState, useEffect } from "react";
import { Country, State, City } from 'country-state-city';
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    countryCode: "+91",
    countryIsoCode: "IN",
    country: "",
    stateIsoCode: "",
    state: "",
    city: "",
    pinCode: "",
    dob: ""
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [token, setToken] = useState("");

  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Country codes with flags
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

  // Load all countries on mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.countryIsoCode) {
      const countryStates = State.getStatesOfCountry(formData.countryIsoCode);
      setStates(countryStates);
      setCities([]);
      setFormData(prev => ({ ...prev, stateIsoCode: "", state: "", city: "" }));
    }
  }, [formData.countryIsoCode]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.countryIsoCode && formData.stateIsoCode) {
      const stateCities = City.getCitiesOfState(formData.countryIsoCode, formData.stateIsoCode);
      setCities(stateCities);
      setFormData(prev => ({ ...prev, city: "" }));
    }
  }, [formData.stateIsoCode]);

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    const pinCodeRegex = /^[0-9]{6}$/;
    if (!formData.pinCode) {
      newErrors.pinCode = "Pin code is required";
    } else if (!pinCodeRegex.test(formData.pinCode)) {
      newErrors.pinCode = "Pin code must be 6 digits";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(c => c.isoCode === e.target.value);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        countryIsoCode: selectedCountry.isoCode,
        country: selectedCountry.name,
        state: "",
        stateIsoCode: "",
        city: ""
      }));
      if (errors.country) {
        setErrors(prev => ({ ...prev, country: "" }));
      }
    }
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const selectedState = states.find(s => s.isoCode === e.target.value);
    if (selectedState) {
      setFormData(prev => ({
        ...prev,
        stateIsoCode: selectedState.isoCode,
        state: selectedState.name,
        city: ""
      }));
      if (errors.state) {
        setErrors(prev => ({ ...prev, state: "" }));
      }
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    setFormData(prev => ({ ...prev, city: e.target.value }));
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: "" }));
    }
  };

  // Send OTP
  const handleGetOtp = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
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
        setApiError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setApiError("Something went wrong. Please try again.");
      console.error("OTP Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Register
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setApiError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/verifyRegisterOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Registration Successful! Welcome!");
        setShowOtpModal(false);
        
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          countryCode: "+91",
          countryIsoCode: "IN",
          country: "",
          stateIsoCode: "",
          state: "",
          city: "",
          pinCode: "",
          dob: "",
        });

        setOtp("");
        window.location.href = "/login";
      } else {
        setApiError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setApiError("Verification failed. Please try again.");
      console.error("Verify Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDE - VIDEO WITH LOGO */}
      <div className="hidden lg:block w-1/2 h-screen sticky top-0 relative">
        {/* Logo positioned on top - centered */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <img 
            src="/logo-white.png" 
            alt="Logo" 
            className="h-24 w-auto"
          />
        </div>

        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50  px-4">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 md:p-10 my-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm">Join us today and get started</p>
          </div>

          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleGetOtp} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-32 border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>
                      {cc.flag} {cc.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength="10"
                  className={`flex-1 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                  placeholder="10-digit mobile number"
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={formData.countryIsoCode}
                onChange={handleCountryChange}
                className={`w-full border ${errors.country ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* State and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={formData.stateIsoCode}
                  onChange={handleStateChange}
                  disabled={!formData.countryIsoCode}
                  className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={handleCityChange}
                  disabled={!formData.stateIsoCode}
                  className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Pin Code and DOB */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code *
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  maxLength="6"
                  className={`w-full border ${errors.pinCode ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                  placeholder="6-digit PIN"
                />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full border ${errors.dob ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Get OTP"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?
              <Link to="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold ml-1 transition">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Verify OTP</h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setApiError("");
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {apiError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-4">
                {formData.countryCode} {formData.phoneNumber}
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-center text-2xl tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
                placeholder="000000"
                maxLength="6"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none mb-3"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify & Register"
              )}
            </button>

            <button
              onClick={handleGetOtp}
              disabled={loading}
              className="w-full text-yellow-600 hover:text-yellow-700 font-semibold py-2 transition disabled:text-gray-400"
            >
              Resend OTP
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Didn't receive the code? Check your phone or try resending.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;