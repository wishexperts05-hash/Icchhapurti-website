import { useState, useEffect, useRef } from 'react';
import { Country, State, City } from 'country-state-city';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown } from 'lucide-react';

export default function AddressForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);

  // Search states
  const [searchTerms, setSearchTerms] = useState({
    countryCode: '',
    country: '',
    state: '',
    city: ''
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find(c => c.name === formData.country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find(s => s.name === formData.state);
  const cities = selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : [];

  // Filtered options based on search
  const filteredCountryCodes = countries.filter(c => 
    `+${c.phonecode} ${c.name}`.toLowerCase().includes(searchTerms.countryCode.toLowerCase())
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
    if (id) {
      setEditMode(true);
      setAddressId(id);
      loadAddress(id);
    }
  }, []);

  // Close dropdown when clicking outside
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

  const loadAddress = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/getAddress/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const { data } = await response.json();
        setFormData({
          fullName: data.fullName || '',
          mobileNumber: data.phoneNumber || '',
          countryCode: data.countryCode || '+91',
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
    if (!formData.fullName.trim()) newErrors.fullName = t('addressForm.messages.required', { field: t('addressForm.labels.fullName') });
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = t('addressForm.messages.required', { field: t('addressForm.labels.mobileNumber') });
    else if (!/^\d{7,15}$/.test(formData.mobileNumber)) newErrors.mobileNumber = t('addressForm.messages.mobileInvalid');
    if (!formData.country) newErrors.country = t('addressForm.messages.required', { field: t('addressForm.labels.country') });
    if (!formData.state) newErrors.state = t('addressForm.messages.required', { field: t('addressForm.labels.state') });
    if (!formData.city) newErrors.city = t('addressForm.messages.required', { field: t('addressForm.labels.city') });
    if (!formData.street.trim()) newErrors.street = t('addressForm.messages.required', { field: t('addressForm.labels.street') });
    if (!formData.pinCode) newErrors.pinCode = t('addressForm.messages.required', { field: t('addressForm.labels.pinCode') });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectCountryCode = (phonecode) => {
    const matchingCountry = countries.find(c => c.phonecode === phonecode);
    if (matchingCountry) {
      setFormData(prev => ({ 
        ...prev, 
        countryCode: phonecode,
        country: matchingCountry.name,
        state: '',
        city: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, countryCode: phonecode }));
    }
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, countryCode: '' }));
  };

  const handleSelectCountry = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    setFormData(prev => ({ 
      ...prev, 
      country: countryName, 
      countryCode: country?.phonecode || '', 
      state: '', 
      city: '' 
    }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, country: '' }));
  };

  const handleSelectState = (stateName) => {
    setFormData(prev => ({ ...prev, state: stateName, city: '' }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, state: '' }));
  };

  const handleSelectCity = (cityName) => {
    setFormData(prev => ({ ...prev, city: cityName }));
    setOpenDropdown(null);
    setSearchTerms(prev => ({ ...prev, city: '' }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
        ? `${import.meta.env.VITE_API_URL}/api/user/address/updateAddress/${addressId}`
        : `${import.meta.env.VITE_API_URL}/api/user/address/addAddress`;
      const method = editMode ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(addressData)
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`${t('addressForm.messages.networkError')}: ${errorData.message || ''}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert(t('addressForm.messages.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `w-full bg-white rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors[field] ? 'ring-2 ring-red-500' : ''}`;

  const SearchableDropdown = ({ field, label, placeholder, options, value, onSelect, disabled, renderOption, getOptionValue }) => (
    <div ref={el => dropdownRefs.current[field] = el} className="relative">
      <label className="block text-white text-sm mb-2">{label} *</label>
      <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div 
          onClick={() => !disabled && setOpenDropdown(openDropdown === field ? null : field)}
          className={`w-full bg-white rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer flex items-center justify-between ${errors[field] ? 'ring-2 ring-red-500' : ''}`}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-400'}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
        
        {openDropdown === field && !disabled && (
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
                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-gray-800"
                  >
                    {renderOption(option)}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  if (loading && editMode) return <div className="min-h-screen flex items-center justify-center text-white">{t('addressForm.messages.loading')}</div>;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {editMode ? t('addressForm.messages.updatedSuccess') : t('addressForm.messages.savedSuccess')}
          </h2>
          <p className="text-gray-400 mb-6">
            {editMode ? t('addressForm.messages.updatedSuccess') : t('addressForm.messages.savedSuccess')}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/addresses')} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg">
              {t('addressForm.buttons.viewAll')}
            </button>
            <button onClick={() => {
              setSubmitted(false);
              setEditMode(false);
              setAddressId(null);
              setFormData({ fullName: '', mobileNumber: '', countryCode: '', country: '', state: '', city: '', street: '', pinCode: '' });
            }} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg">
              {t('addressForm.buttons.addAnother')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {editMode ? t('addressForm.buttons.update') : t('addressForm.buttons.save')}
        </h1>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.fullName')} *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('addressForm.placeholders.fullName')} className={inputClass('fullName')} />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.mobileNumber')} *</label>
              <div className="flex gap-2">
                <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-32">
                  <div 
                    onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
                    className={`bg-white rounded-lg px-3 py-3 text-gray-800 cursor-pointer flex items-center justify-between ${errors.countryCode ? 'ring-2 ring-red-500' : ''}`}
                  >
                    <span className={formData.countryCode ? 'text-gray-800' : 'text-gray-400'}>
                      {formData.countryCode ? `+${formData.countryCode}` : 'Code'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  {openDropdown === 'countryCode' && (
                    <div className="absolute z-50 w-64 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-hidden"
                         onMouseDown={(e) => e.preventDefault()}>
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            value={searchTerms.countryCode}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, countryCode: e.target.value }))}
                            placeholder="Search country code..."
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCountryCodes.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                        ) : (
                          filteredCountryCodes.map(country => (
                            <div
                              key={country.isoCode}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectCountryCode(country.phonecode);
                              }}
                              className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-gray-800"
                            >
                              +{country.phonecode} - {country.name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder={t('addressForm.placeholders.mobileNumber')} className={`flex-1 ${inputClass('mobileNumber')}`} />
              </div>
              {errors.mobileNumber && <p className="text-red-400 text-xs mt-1">{errors.mobileNumber}</p>}
              {errors.countryCode && <p className="text-red-400 text-xs mt-1">{errors.countryCode}</p>}
            </div>

            {/* Country */}
            <SearchableDropdown
              field="country"
              label={t('addressForm.labels.country')}
              placeholder={t('addressForm.labels.country')}
              options={filteredCountries}
              value={formData.country}
              onSelect={handleSelectCountry}
              disabled={false}
              renderOption={(country) => country.name}
              getOptionValue={(country) => country.name}
            />

            {/* State */}
            <SearchableDropdown
              field="state"
              label={t('addressForm.labels.state')}
              placeholder={t('addressForm.labels.state')}
              options={filteredStates}
              value={formData.state}
              onSelect={handleSelectState}
              disabled={!formData.country}
              renderOption={(state) => state.name}
              getOptionValue={(state) => state.name}
            />

            {/* City */}
            <SearchableDropdown
              field="city"
              label={t('addressForm.labels.city')}
              placeholder={t('addressForm.labels.city')}
              options={filteredCities}
              value={formData.city}
              onSelect={handleSelectCity}
              disabled={!formData.state}
              renderOption={(city) => city.name}
              getOptionValue={(city) => city.name}
            />

            {/* Street */}
            <div>
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.street')} *</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder={t('addressForm.placeholders.street')} className={inputClass('street')} />
              {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.pinCode')} *</label>
              <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder={t('addressForm.placeholders.pinCode')} className={inputClass('pinCode')} />
              {errors.pinCode && <p className="text-red-400 text-xs mt-1">{errors.pinCode}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button onClick={handleSubmit} disabled={loading} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white font-semibold py-3 px-16 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 disabled:cursor-not-allowed">
              {loading ? t('addressForm.messages.loading') : editMode ? t('addressForm.buttons.update') : t('addressForm.buttons.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}