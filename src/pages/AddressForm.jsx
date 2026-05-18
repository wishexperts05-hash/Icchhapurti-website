import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, ChevronDown, Loader } from 'lucide-react';

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

export default function AddressForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    countryCode: '+91',
    countryIsoCode: '',
    stateIsoCode: '',
    country: '',
    state: '',
    city: '',
    street: '',
    pinCode: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);

  // Location data from API
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState({ countries: false, states: false, cities: false });

  // Search / dropdown state
  const [searchTerms, setSearchTerms] = useState({ countryCode: '', country: '', state: '', city: '' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // ── API CALLS ────────────────────────────────────────────────

  const fetchCountries = async () => {
    const cached = cache.get('all_countries');
    if (cached) { setCountries(cached); return cached; }
    setLoadingStates(prev => ({ ...prev, countries: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/user/location/countries`);
      const data = await res.json();
      if (data.success) { cache.set('all_countries', data.data); setCountries(data.data); return data.data; }
    } catch (err) { console.error('Failed to fetch countries:', err); }
    finally { setLoadingStates(prev => ({ ...prev, countries: false })); }
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
      if (data.success) { cache.set(cacheKey, data.data); setStates(data.data); return data.data; }
    } catch (err) { console.error('Failed to fetch states:', err); }
    finally { setLoadingStates(prev => ({ ...prev, states: false })); }
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
      if (data.success) { cache.set(cacheKey, data.data); setCities(data.data); return data.data; }
    } catch (err) { console.error('Failed to fetch cities:', err); }
    finally { setLoadingStates(prev => ({ ...prev, cities: false })); }
    return [];
  };

  // ── FILTERED OPTIONS ─────────────────────────────────────────

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
    fetchCountries().then(async (allCountries) => {
      if (id) {
        setEditMode(true);
        setAddressId(id);
        await loadAddress(id, allCountries);
      }
    });
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        if (!dropdownRefs.current[openDropdown].contains(event.target)) setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // ── HANDLERS ─────────────────────────────────────────────────

  const loadAddress = async (addressId, allCountries) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/user/address/getAddress/${addressId}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const { data } = await response.json();
        const countryList = allCountries || cache.get('all_countries') || [];
        const foundCountry = countryList.find(c => c.country === data.country);
        const countryIsoCode = foundCountry?.isoCode || '';

        setFormData({
          fullName: data.fullName || '',
          mobileNumber: data.phoneNumber || '',
          countryCode: data.countryCode || '+91',
          countryIsoCode,
          stateIsoCode: '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          street: data.street || '',
          pinCode: data.pinCode || ''
        });

        if (countryIsoCode) {
          const countryStates = await fetchStates(countryIsoCode);
          const foundState = countryStates.find(s => s.name === data.state);
          if (foundState) {
            setFormData(prev => ({ ...prev, stateIsoCode: foundState.isoCode }));
            await fetchCities(countryIsoCode, foundState.isoCode);
          }
        }
      }
    } catch (error) { console.error('Error loading address:', error); }
    finally { setLoading(false); }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) newErrors.fullName = 'Full name can only contain letters and spaces';
    if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^\d+$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Mobile number must contain only digits';
    else if (formData.mobileNumber.length < 7 || formData.mobileNumber.length > 15) newErrors.mobileNumber = 'Mobile number must be between 7 and 15 digits';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    else if (formData.street.trim().length < 5) newErrors.street = 'Street address must be at least 5 characters';
    if (!formData.pinCode) newErrors.pinCode = 'PIN code is required';
    else if (!/^\d+$/.test(formData.pinCode)) newErrors.pinCode = 'PIN code must contain only digits';
    else if (formData.pinCode.length < 4 || formData.pinCode.length > 10) newErrors.pinCode = 'PIN code must be between 4 and 10 digits';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectCountryCode = (phonecode) => {
    const matched = countries.find(c => c.phonecode === phonecode);
    setFormData(prev => ({
      ...prev,
      countryCode: `+${phonecode}`,
      ...(matched ? { countryIsoCode: matched.isoCode, country: matched.country, stateIsoCode: '', state: '', city: '' } : {})
    }));
    if (matched) { setStates([]); setCities([]); fetchStates(matched.isoCode); }
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, countryCode: '' }));
    if (errors.countryCode) setErrors(prev => ({ ...prev, countryCode: '' }));
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
    if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
    await fetchStates(selected.isoCode);
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, country: '' }));
  };

  const handleSelectState = async (isoCode) => {
    const selected = states.find(s => s.isoCode === isoCode);
    if (!selected) return;
    setFormData(prev => ({ ...prev, stateIsoCode: selected.isoCode, state: selected.name, city: '' }));
    setCities([]);
    if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
    await fetchCities(formData.countryIsoCode, isoCode);
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, state: '' }));
  };

  const handleSelectCity = (cityName) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, city: '' }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstField = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    try {
      const addressData = {
        fullName: formData.fullName, phoneNumber: formData.mobileNumber,
        countryCode: formData.countryCode, country: formData.country,
        state: formData.state, city: formData.city,
        street: formData.street, pinCode: formData.pinCode
      };
      const url = editMode
        ? `${BASE_URL}/api/user/address/updateAddress/${addressId}`
        : `${BASE_URL}/api/user/address/addAddress`;
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(addressData)
      });
      if (response.ok) { setSubmitted(true); }
      else { const errorData = await response.json(); alert(`Error: ${errorData.message || 'Failed to save address.'}`); }
    } catch (error) { console.error('Error submitting:', error); alert('Network error. Please check your connection and try again.'); }
    finally { setLoading(false); }
  };

  const inputClass = (field) =>
    `w-full bg-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors[field] ? 'ring-2 ring-red-500' : ''}`;

  // ── SEARCHABLE DROPDOWN ───────────────────────────────────────

  const SearchableDropdown = ({ field, label, placeholder, options, value, onSelect, disabled, renderOption, getOptionValue, isLoading }) => (
    <div ref={el => dropdownRefs.current[field] = el} className="relative">
      <label className="block text-slate-700 text-sm mb-2">{label} *</label>
      <div className={disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}>
        <div
          onClick={() => !disabled && !isLoading && setOpenDropdown(openDropdown === field ? null : field)}
          className={`w-full bg-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer flex items-center justify-between ${errors[field] ? 'ring-2 ring-red-500' : ''}`}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-400'}>
            {isLoading ? 'Loading...' : (value || placeholder)}
          </span>
          {isLoading
            ? <Loader className="w-4 h-4 text-gray-400 animate-spin" />
            : <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </div>

        {openDropdown === field && !disabled && !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()}>
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerms[field]}
                  onChange={(e) => setSearchTerms(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {options.length === 0
                ? <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                : options.map((option, idx) => (
                  <div key={idx}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(getOptionValue(option)); }}
                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-gray-800">
                    {renderOption(option)}
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  // ── LOADING / SUCCESS STATES ──────────────────────────────────

  if (loading && editMode && !formData.fullName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Loading address...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{editMode ? 'Address Updated!' : 'Address Saved!'}</h2>
          <p className="text-gray-400 mb-6">{editMode ? 'Your address has been updated successfully.' : 'Your address has been saved successfully.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/addresses')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">View All Addresses</button>
            <button onClick={() => {
              setSubmitted(false); setEditMode(false); setAddressId(null);
              setFormData({ fullName: '', mobileNumber: '', countryCode: '+91', countryIsoCode: '', stateIsoCode: '', country: '', state: '', city: '', street: '', pinCode: '' });
              setErrors({});
            }} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Add Another Address</button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white max-w-5xl mx-auto relative overflow-hidden">
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{editMode ? "Update Address" : "Add New Address"}</h1>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Full Name */}
            <div>
              <label className="block text-slate-700 text-sm mb-2">Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={inputClass('fullName')} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-slate-700 text-sm mb-2">Mobile Number *</label>
              <div className="flex gap-2">
                <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-32">
                  <div
                    onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
                    className={`bg-gray-200 rounded-lg px-3 py-3 text-gray-800 cursor-pointer flex items-center justify-between ${errors.countryCode ? 'ring-2 ring-red-500' : ''}`}
                  >
                    <span className={formData.countryCode ? 'text-gray-800' : 'text-gray-400'}>{formData.countryCode || 'Code'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>

                  {openDropdown === 'countryCode' && (
                    <div className="absolute z-50 w-64 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-64 overflow-hidden"
                      onMouseDown={(e) => e.preventDefault()}>
                      <div className="p-2 border-b border-slate-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" value={searchTerms.countryCode}
                            onChange={(e) => setSearchTerms(p => ({ ...p, countryCode: e.target.value }))}
                            placeholder="Search country code..."
                            className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                            autoFocus />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCountryCodes.length === 0
                          ? <div className="px-4 py-3 text-sm text-slate-500">No results found</div>
                          : filteredCountryCodes.map(c => (
                            <div key={c.isoCode}
                              onMouseDown={(e) => { e.preventDefault(); handleSelectCountryCode(c.phonecode); }}
                              className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-slate-800">
                              +{c.phonecode} – {c.country}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>

                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter mobile number" className={`flex-1 ${inputClass('mobileNumber')}`} />
              </div>
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              {errors.countryCode && <p className="text-red-500 text-xs mt-1">{errors.countryCode}</p>}
            </div>

            {/* Country */}
            <SearchableDropdown
              field="country" label="Country" placeholder="Select country"
              options={filteredCountries} value={formData.country}
              onSelect={handleSelectCountry} disabled={false}
              isLoading={loadingStates.countries}
              renderOption={(c) => `${c.flag || ''} ${c.country}`}
              getOptionValue={(c) => c.isoCode}
            />

            {/* State */}
            <SearchableDropdown
              field="state" label="State" placeholder="Select state"
              options={filteredStates} value={formData.state}
              onSelect={handleSelectState} disabled={!formData.countryIsoCode}
              isLoading={loadingStates.states}
              renderOption={(s) => s.name}
              getOptionValue={(s) => s.isoCode}
            />

            {/* City */}
            <SearchableDropdown
              field="city" label="City" placeholder="Select city"
              options={filteredCities} value={formData.city}
              onSelect={handleSelectCity} disabled={!formData.stateIsoCode}
              isLoading={loadingStates.cities}
              renderOption={(c) => c}
              getOptionValue={(c) => c}
            />

            {/* Street */}
            <div>
              <label className="block text-slate-700 text-sm mb-2">Street Address *</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Enter street address" className={inputClass('street')} />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-slate-700 text-sm mb-2">PIN Code *</label>
              <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Enter PIN code" className={inputClass('pinCode')} />
              {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <button onClick={handleSubmit} disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 disabled:bg-slate-400 text-white font-semibold py-3 px-16 rounded-lg transition">
              {loading
                ? <span className="flex items-center gap-2"><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />{editMode ? 'Updating...' : 'Saving...'}</span>
                : editMode ? 'Update Address' : 'Save Address'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}