import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, MapPin, Edit2, Trash2, Plus, Loader } from 'lucide-react';
import { createPortal } from 'react-dom';

const BASE_URL = import.meta.env.VITE_API_URL;

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

const AddressModal = ({ isOpen, onClose, setAddressesIndex, addresses, fetchAddresses, addressId = null }) => {

  const [showForm, setShowForm] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [searchTerms, setSearchTerms] = useState({ countryCode: '', country: '', state: '', city: '' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loadingStates, setLoadingStates] = useState({ countries: false, states: false, cities: false });

  // ─── API CALLS ────────────────────────────────────────────────

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

  const filteredCountryCodes = countries.filter(c =>
    `+${c.phonecode} ${c.country}`.toLowerCase().includes(searchTerms.countryCode.toLowerCase())
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

  // ─── EFFECTS ──────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      fetchCountries();
      fetchAddresses();
      if (addressId) {
        setEditMode(true);
        setCurrentEditId(addressId);
        setShowForm(true);
        loadAddress(addressId);
      } else {
        setShowForm(false);
      }
    }
  }, [isOpen, addressId]);

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
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ─── HANDLERS ─────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      fullName: '', mobileNumber: '', countryCode: '+91',
      countryIsoCode: '', stateIsoCode: '',
      country: '', state: '', city: '', street: '', pinCode: ''
    });
    setErrors({});
    setSearchTerms({ countryCode: '', country: '', state: '', city: '' });
    setStates([]);
    setCities([]);
    setEditMode(false);
    setCurrentEditId(null);
  };

  const loadAddress = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/address/getAddress/${id}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const { data } = await res.json();
        const allCountries = cache.get('all_countries') || await fetchCountries();
        const foundCountry = allCountries.find(c => c.country === data.country);
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
    } catch (err) { console.error('Error loading address:', err); }
    finally { setLoading(false); }
  };

  const handleEditAddress = (id) => {
    setCurrentEditId(id);
    setEditMode(true);
    setShowForm(true);
    loadAddress(id);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/user/address/deleteAddress/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        await fetchAddresses();
        alert('Address deleted successfully');
        setAddressesIndex(0);
      }
    } catch (err) { console.error('Error deleting address:', err); alert('Failed to delete address'); }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    else if (!/^\d{7,15}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.pinCode) newErrors.pinCode = 'Pin code is required';
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
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const addressData = {
        fullName: formData.fullName,
        phoneNumber: formData.mobileNumber,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        street: formData.street,
        pinCode: formData.pinCode
      };
      const url = editMode
        ? `${BASE_URL}/api/user/address/updateAddress/${currentEditId}`
        : `${BASE_URL}/api/user/address/addAddress`;
      const res = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(addressData)
      });
      if (res.ok) {
        resetForm(); setShowForm(false); fetchAddresses();
        alert(editMode ? 'Address updated successfully' : 'Address added successfully');
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to save address'}`);
      }
    } catch (err) { console.error('Error submitting:', err); alert('Network error occurred'); }
    finally { setLoading(false); }
  };

  const handleClose = () => { resetForm(); setShowForm(false); onClose(); };
  const handleBackToList = () => { resetForm(); setShowForm(false); };

  // ─── SEARCHABLE DROPDOWN ──────────────────────────────────────

  const SearchableDropdown = ({ field, label, placeholder, options, value, onSelect, disabled, renderOption, getOptionValue, isLoading }) => (
    <div ref={el => dropdownRefs.current[field] = el} className="relative">
      <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">{label} <span className="text-amber-500">*</span></label>
      <div className={disabled || isLoading ? 'opacity-40 cursor-not-allowed' : ''}>
        <div
          onClick={() => !disabled && !isLoading && setOpenDropdown(openDropdown === field ? null : field)}
          className={`w-full bg-stone-50 rounded-xl px-4 py-3.5 text-stone-800 border-2 cursor-pointer flex items-center justify-between transition-all duration-200
            ${openDropdown === field ? 'border-amber-400 bg-white shadow-md' : 'border-stone-200 hover:border-stone-300'}
            ${errors[field] ? 'border-red-400 bg-red-50' : ''}`}
        >
          <span className={value ? 'text-stone-800 font-medium' : 'text-stone-400 text-sm'}>
            {isLoading ? 'Loading…' : (value || placeholder)}
          </span>
          {isLoading
            ? <Loader className="w-4 h-4 text-amber-400 animate-spin" />
            : <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === field ? 'rotate-180 text-amber-500' : 'text-stone-400'}`} />
          }
        </div>

        {openDropdown === field && !disabled && !isLoading && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-stone-100 max-h-64 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()}
            style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)' }}
          >
            <div className="p-3 border-b border-stone-100 bg-stone-50 rounded-t-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerms[field]}
                  onChange={(e) => setSearchTerms(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={`Search ${label.toLowerCase()}…`}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-stone-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-4 text-sm text-stone-400 text-center">No results found</div>
              ) : (
                options.map((option, idx) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => { e.preventDefault(); onSelect(getOptionValue(option)); }}
                    className="px-4 py-2.5 hover:bg-amber-50 cursor-pointer text-sm text-stone-700 hover:text-stone-900 transition-colors border-b border-stone-50 last:border-0"
                  >
                    {renderOption(option)}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {errors[field] && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>{errors[field]}
      </p>}
    </div>
  );

  const inputClass = (field) =>
    `w-full bg-stone-50 rounded-xl px-4 py-3.5 text-stone-800 placeholder-stone-400 focus:outline-none border-2 transition-all duration-200
    ${errors[field]
      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
      : 'border-stone-200 hover:border-stone-300 focus:border-amber-400 focus:bg-white focus:shadow-md'}`;

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .addr-modal * { font-family: 'DM Sans', sans-serif; }
        .addr-modal .display-font { font-family: 'DM Serif Display', serif; }
        @keyframes addr-backdrop { from { opacity: 0 } to { opacity: 1 } }
        @keyframes addr-slide { from { opacity: 0; transform: translateY(24px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .addr-backdrop { animation: addr-backdrop 0.25s ease forwards; }
        .addr-panel { animation: addr-slide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes addr-card-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .addr-card { animation: addr-card-in 0.25s ease forwards; }
        .addr-card:nth-child(2) { animation-delay: 0.05s; opacity: 0; animation-fill-mode: forwards; }
        .addr-card:nth-child(3) { animation-delay: 0.1s; opacity: 0; animation-fill-mode: forwards; }
        .addr-card:nth-child(4) { animation-delay: 0.15s; opacity: 0; animation-fill-mode: forwards; }
        .addr-scroll::-webkit-scrollbar { width: 4px; }
        .addr-scroll::-webkit-scrollbar-track { background: transparent; }
        .addr-scroll::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 99px; }
        .addr-tag-home { background: #fef3c7; color: #92400e; }
        .addr-tag-work { background: #dbeafe; color: #1e40af; }
      `}</style>

      <div className="addr-modal fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="addr-backdrop fixed inset-0"
          style={{ background: 'rgba(10, 10, 10, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={handleClose}
        />

        {/* Modal Panel */}
        <div className="relative flex items-start justify-center min-h-screen p-4 pt-10 pb-16">
          <div
            className="addr-panel relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative top bar */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316, #ef4444)' }} />

            {/* Header */}
            <div className="px-8 pt-7 pb-5 flex items-start justify-between border-b border-stone-100">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
                  {showForm ? (editMode ? 'Edit Address' : 'New Address') : 'Address Book'}
                </p>
                <h2 className="display-font text-3xl text-stone-900">
                  {showForm ? (editMode ? 'Update delivery address' : 'Where should we deliver?') : 'My saved addresses'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="mt-1 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="addr-scroll overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="px-8 py-6">

                {!showForm ? (
                  /* ── ADDRESS LIST ── */
                  <div>
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                        <Loader className="w-8 h-8 animate-spin text-amber-400 mb-3" />
                        <p className="text-sm">Loading your addresses…</p>
                      </div>
                    ) : addresses?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                          <MapPin className="w-8 h-8 text-amber-400" />
                        </div>
                        <h3 className="display-font text-2xl text-stone-700 mb-2">No addresses yet</h3>
                        <p className="text-stone-400 text-sm mb-6 max-w-xs">Add your first address to speed up checkout</p>
                        <button
                          onClick={() => { resetForm(); setShowForm(true); }}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                        >
                          <Plus className="w-4 h-4" /> Add your first address
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-stone-500 text-sm">{addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved</p>
                          <button
                            onClick={() => { resetForm(); setShowForm(true); }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                          >
                            <Plus className="w-4 h-4" /> Add New
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {addresses?.map((address, i) => (
                            <div
                              key={address._id}
                              onClick={() => { setAddressesIndex(i); onClose(); }}
                              className="addr-card group relative bg-stone-50 border-2 border-stone-100 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/40 hover:shadow-lg"
                            >
                              {/* Pin accent */}
                              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:border-amber-300 group-hover:bg-amber-50 transition-all duration-200">
                                <MapPin className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-500 transition-colors duration-200" />
                              </div>

                              <div className="pr-10">
                                <p className="font-semibold text-stone-900 text-base leading-tight">{address.fullName}</p>
                                <p className="text-stone-500 text-xs mt-0.5">{address.countryCode} {address.phoneNumber}</p>

                                <div className="mt-3 space-y-0.5">
                                  <p className="text-stone-600 text-sm">{address.street}</p>
                                  <p className="text-stone-600 text-sm">{address.city}, {address.state}</p>
                                  <p className="text-stone-500 text-xs">{address.country} — {address.pinCode}</p>
                                </div>
                              </div>

                              {/* Action row */}
                              <div className="flex gap-3 mt-4 pt-4 border-t border-stone-200">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditAddress(address._id); }}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-amber-600 transition-colors px-2 py-1 rounded-lg hover:bg-amber-50"
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address._id); }}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* ── ADDRESS FORM ── */
                  <div className="space-y-5">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                        <Loader className="w-7 h-7 animate-spin text-amber-400 mb-3" />
                        <p className="text-sm">Loading address…</p>
                      </div>
                    ) : (
                      <>
                        {/* Section: Contact */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Contact Details</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                                Full Name <span className="text-amber-500">*</span>
                              </label>
                              <input
                                type="text" name="fullName" value={formData.fullName}
                                onChange={handleChange} placeholder="e.g. Arun Kumar"
                                className={inputClass('fullName')}
                              />
                              {errors.fullName && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />{errors.fullName}
                              </p>}
                            </div>

                            {/* Mobile Number */}
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                                Mobile Number <span className="text-amber-500">*</span>
                              </label>
                              <div className="flex gap-2">
                                <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-28 flex-shrink-0">
                                  <div
                                    onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
                                    className={`bg-stone-50 border-2 rounded-xl px-3 py-3.5 text-stone-800 cursor-pointer flex items-center justify-between gap-1 transition-all duration-200
                                      ${openDropdown === 'countryCode' ? 'border-amber-400 bg-white shadow-md' : 'border-stone-200 hover:border-stone-300'}`}
                                  >
                                    <span className="text-sm font-medium">{formData.countryCode || 'Code'}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${openDropdown === 'countryCode' ? 'rotate-180 text-amber-500' : 'text-stone-400'}`} />
                                  </div>
                                  {openDropdown === 'countryCode' && (
                                    <div className="absolute z-50 w-64 mt-2 bg-white rounded-xl shadow-2xl border border-stone-100 max-h-64 overflow-hidden"
                                      style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)' }}
                                      onMouseDown={(e) => e.preventDefault()}>
                                      <div className="p-3 border-b border-stone-100 bg-stone-50 rounded-t-xl">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                                          <input type="text" value={searchTerms.countryCode}
                                            onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))}
                                            placeholder="Search code…"
                                            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-stone-400"
                                            autoFocus />
                                        </div>
                                      </div>
                                      <div className="max-h-48 overflow-y-auto">
                                        {filteredCountryCodes.length === 0
                                          ? <div className="px-4 py-4 text-sm text-stone-400 text-center">No results</div>
                                          : filteredCountryCodes.map(c => (
                                            <div key={c.isoCode}
                                              onMouseDown={(e) => { e.preventDefault(); handleSelectCountryCode(c.phonecode); }}
                                              className="px-4 py-2.5 hover:bg-amber-50 cursor-pointer text-sm text-stone-700 border-b border-stone-50 last:border-0"
                                            >
                                              <span className="font-medium">+{c.phonecode}</span>
                                              <span className="text-stone-400 ml-2">{c.country}</span>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <input type="tel" name="mobileNumber" value={formData.mobileNumber}
                                  onChange={handleChange} placeholder="Enter number"
                                  className={`flex-1 min-w-0 ${inputClass('mobileNumber')}`} />
                              </div>
                              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-500" />{errors.mobileNumber}
                              </p>}
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-stone-100" />
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Location</p>
                          <div className="flex-1 h-px bg-stone-100" />
                        </div>

                        {/* Section: Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SearchableDropdown
                            field="country" label="Country" placeholder="Select country"
                            options={filteredCountries} value={formData.country}
                            onSelect={handleSelectCountry} disabled={false}
                            isLoading={loadingStates.countries}
                            renderOption={(c) => `${c.flag || ''} ${c.country}`}
                            getOptionValue={(c) => c.isoCode}
                          />
                          <SearchableDropdown
                            field="state" label="State / Province" placeholder="Select state"
                            options={filteredStates} value={formData.state}
                            onSelect={handleSelectState} disabled={!formData.countryIsoCode}
                            isLoading={loadingStates.states}
                            renderOption={(s) => s.name}
                            getOptionValue={(s) => s.isoCode}
                          />
                          <SearchableDropdown
                            field="city" label="City" placeholder="Select city"
                            options={filteredCities} value={formData.city}
                            onSelect={handleSelectCity} disabled={!formData.stateIsoCode}
                            isLoading={loadingStates.cities}
                            renderOption={(c) => c}
                            getOptionValue={(c) => c}
                          />
                          {/* Pin Code */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                              Pin Code <span className="text-amber-500">*</span>
                            </label>
                            <input type="text" name="pinCode" value={formData.pinCode}
                              onChange={handleChange} placeholder="e.g. 400001"
                              className={inputClass('pinCode')} />
                            {errors.pinCode && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-red-500" />{errors.pinCode}
                            </p>}
                          </div>
                        </div>

                        {/* Street — full width */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                            Street Address <span className="text-amber-500">*</span>
                          </label>
                          <input type="text" name="street" value={formData.street}
                            onChange={handleChange} placeholder="House no., building, street name, area…"
                            className={inputClass('street')} />
                          {errors.street && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />{errors.street}
                          </p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100">
                          <button
                            onClick={handleBackToList}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all duration-200"
                          >
                            ← Back to list
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: loading ? '#d6d3d1' : 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                          >
                            {loading
                              ? <><Loader className="w-4 h-4 animate-spin" /> Saving…</>
                              : editMode ? '✓ Update Address' : '+ Save Address'
                            }
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById('root') || document.body
  );
};

export default AddressModal;