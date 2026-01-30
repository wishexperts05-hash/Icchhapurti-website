import { useState, useEffect, useRef } from 'react';
import { Country, State, City } from 'country-state-city';

import { Search, ChevronDown, X, MapPin, Edit2, Trash2, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';

const AddressModal = ({ isOpen, onClose, setAddressesIndex,addresses, fetchAddresses, addressId = null }) => {

  // const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);



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
    if (isOpen) {
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

  // Disable background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // const fetchAddresses = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/getAllAddress`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem("token")}`
  //       }
  //     });
  //     if (response.ok) {
  //       const { data } = await response.json();
  //       setAddresses(data || []);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching addresses:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      countryCode: '+91',
      country: '',
      state: '',
      city: '',
      street: '',
      pinCode: ''
    });
    setErrors({});
    setSearchTerms({ countryCode: '', country: '', state: '', city: '' });
    setEditMode(false);
    setCurrentEditId(null);
  };

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

  const handleEditAddress = (id) => {
    setCurrentEditId(id);
    setEditMode(true);
    setShowForm(true);
    loadAddress(id);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/deleteAddress/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        await fetchAddresses();
        alert('Address deleted successfully');
        setAddressesIndex(0)
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
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
        ? `${import.meta.env.VITE_API_URL}/api/user/address/updateAddress/${currentEditId}`
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
        resetForm();
        setShowForm(false);
        fetchAddresses();
        alert(editMode ? 'Address updated successfully' : 'Address added successfully');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save address'}`);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setShowForm(false);
    onClose();
  };

  const handleBackToList = () => {
    resetForm();
    setShowForm(false);
  };

  const inputClass = (field) => `w-full bg-white rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-gray-300 ${errors[field] ? 'ring-2 ring-red-500' : ''}`;

  const SearchableDropdown = ({ field, label, placeholder, options, value, onSelect, disabled, renderOption, getOptionValue }) => (
    <div ref={el => dropdownRefs.current[field] = el} className="relative">
      <label className="block text-gray-700 text-sm font-medium mb-2">{label} *</label>
      <div className={`relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div
          onClick={() => !disabled && setOpenDropdown(openDropdown === field ? null : field)}
          className={`w-full bg-white rounded-lg px-4 py-3 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer flex items-center justify-between ${errors[field] ? 'ring-2 ring-red-500' : ''}`}
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
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {showForm ? (editMode ? 'Update Address' : 'Add New Address') : 'My Addresses'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showForm ? (
            // Address List View
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Manage your saved addresses</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New Address
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading addresses...</div>
              ) : addresses?.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No addresses saved yet</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses?.map((address, i) => (
                    <div
                      onClick={() => {
                        setAddressesIndex(i)
                        onClose()
                      }}
                      key={address._id}
                      className="border cursor-pointer border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">{address.fullName}</h3>
                            <p className="text-gray-600 text-sm">+{address.countryCode} {address.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-7 space-y-1 mb-4">
                        <p className="text-gray-700">{address.street}</p>
                        <p className="text-gray-700">{address.city}, {address.state}</p>
                        <p className="text-gray-700">{address.country} - {address.pinCode}</p>
                      </div>
                      <div className="ml-7 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Add parentheses to actually call the function!
                            handleEditAddress(address._id);
                          }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Address Form View
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Mobile Number *</label>
                  <div className="flex gap-2">
                    <div ref={el => dropdownRefs.current['countryCode'] = el} className="relative w-32">
                      <div
                        onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
                        className={`bg-white border border-gray-300 rounded-lg px-3 py-3 text-gray-800 cursor-pointer flex items-center justify-between ${errors.countryCode ? 'ring-2 ring-red-500' : ''}`}
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
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className={`flex-1 ${inputClass('mobileNumber')}`}
                    />
                  </div>
                  {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
                </div>

                {/* Country */}
                <SearchableDropdown
                  field="country"
                  label="Country"
                  placeholder="Select country"
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
                  label="State"
                  placeholder="Select state"
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
                  label="City"
                  placeholder="Select city"
                  options={filteredCities}
                  value={formData.city}
                  onSelect={handleSelectCity}
                  disabled={!formData.state}
                  renderOption={(city) => city.name}
                  getOptionValue={(city) => city.name}
                />

                {/* Street */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Enter street address"
                    className={inputClass('street')}
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>

                {/* Pin Code */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Pin Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="Enter pin code"
                    className={inputClass('pinCode')}
                  />
                  {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={handleBackToList}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Back to List
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editMode ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>, document.getElementById('root') || document.body
  );
};

export default AddressModal