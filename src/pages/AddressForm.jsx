import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    countryCode: '+91',
    country: '',
    state: '',
    city: '',
    street: '',
    pinCode: ''
  });
console.log(formData,"v")
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);

  // Get all countries
  const countries = Country.getAllCountries();

  // Find ISO code from country name
const selectedCountry = Country.getAllCountries().find(
  c => c.name === formData.country
);

// Get states by country ISO
const states = selectedCountry
  ? State.getStatesOfCountry(selectedCountry.isoCode)
  : [];

console.log(states);

// Find state iso by name
const selectedState = states.find(s => s.name === formData.state);

// Get cities by state ISO
const cities = selectedState
  ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
  : [];

console.log(cities);

    const {id} = useParams()
  // Load address for editing (mock - replace with actual API call)
  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.search);


    if (id) {
      setEditMode(true);
      setAddressId(id);
      loadAddress(id);
    }
  }, []);

  const loadAddress = async (id) => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/getAddress/${id}`,{
         headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (response.ok) {
        const {data} = await response.json();
        setFormData({
          fullName: data.fullName || '',
          mobileNumber: data.phoneNumber || '',
          countryCode: data.countryCode || '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          street: data.street || '',
          pinCode: data.pinCode || ''
        });
      }
    } catch (error) {
      console.error('Error loading address:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^\d{7,15}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Enter valid mobile number';
    // if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData?.pinCode) newErrors.pinCode = 'Pin code is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'country') {
      const selectedCountry = countries.find(c => c.isoCode === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        countryCode: selectedCountry?.phonecode || '',
        state: '',
        city: ''
      }));
    } else if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const addressData = {
        fullName: formData.fullName,
        phoneNumber: formData.mobileNumber,
        // countryCode: formData.countryCode,
        // country: formData.country,
        country: formData.country,
        // state: formData.state,
        state: formData.state,
        // city: formData.city,
        city: formData.city,
        street: formData.street,
        pinCode: formData.pinCode
      };

      // Replace with your actual API endpoint
      const url = editMode
        ? `${import.meta.env.VITE_API_URL}/api/user/address/updateAddress/${addressId}`
        : `${import.meta.env.VITE_API_URL}/api/user/address/addAddress
`;

      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(addressData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Address saved:', result);
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save address'}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
const Navigate = useNavigate()
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {editMode ? 'Address Updated!' : 'Address Saved!'}
          </h2>
          <p className="text-gray-400 mb-6">
            Your shipping address has been {editMode ? 'updated' : 'added'} successfully.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => Navigate( '/addresses')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              View All
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setEditMode(false);
                setAddressId(null);
                setFormData({
                  fullName: '',
                  mobileNumber: '',
                  countryCode: '',
                  country: '',
                  state: '',
                  city: '',
                  street: '',
                  pinCode: ''
                });
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (field) => `w-full bg-white rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors[field] ? 'ring-2 ring-red-500' : ''}`;
  const selectClass = (field) => `w-full bg-white rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer ${errors[field] ? 'ring-2 ring-red-500' : ''}`;

  if (loading && editMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading address...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Spiral Background Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {editMode ? 'Edit Shipping Address' : 'Add Shipping Address'}
        </h1>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-white text-sm mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Tony Stark"
                className={inputClass('fullName')}
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-white text-sm mb-2">Mobile Number *</label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className={`bg-white rounded-lg px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.countryCode ? 'ring-2 ring-red-500' : ''}`}
                >
                  <option value="">Code</option>
                  {countries.map(country => (
                    <option key={country.isoCode} value={country.phonecode}>
                      +{country.phonecode}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="7896543210"
                  className={`flex-1 ${inputClass('mobileNumber')}`}
                />
              </div>
              {errors.mobileNumber && <p className="text-red-400 text-xs mt-1">{errors.mobileNumber}</p>}
              {errors.countryCode && <p className="text-red-400 text-xs mt-1">{errors.countryCode}</p>}
            </div>

            {/* Country */}
            <div className="relative">
              <label className="block text-white text-sm mb-2">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={selectClass('country')}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.isoCode} value={(country.isoCode).name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-10 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* State */}
            <div className="relative">
              <label className="block text-white text-sm mb-2">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={selectClass('state')}
                disabled={!formData.country}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.isoCode} value={(state.isoCode).name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-10 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
            </div>

            {/* City */}
            <div className="relative">
              <label className="block text-white text-sm mb-2">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={selectClass('city')}
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-10 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Street */}
            <div>
              <label className="block text-white text-sm mb-2">Street / Flat No. *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="London Street, Flat no 108"
                className={inputClass('street')}
              />
              {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-white text-sm mb-2">Pin Code *</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="789458"
                className={inputClass('pinCode')}
              />
              {errors.pinCode && <p className="text-red-400 text-xs mt-1">{errors.pinCode}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white font-semibold py-3 px-16 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editMode ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}