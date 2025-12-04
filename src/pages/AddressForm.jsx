import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find(c => c.name === formData.country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find(s => s.name === formData.state);
  const cities = selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : [];

  useEffect(() => {
    if (id) {
      setEditMode(true);
      setAddressId(id);
      loadAddress(id);
    }
  }, []);

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
    if (name === 'country') {
      const country = countries.find(c => c.isoCode === value);
      setFormData(prev => ({ ...prev, country: value, countryCode: country?.phonecode || '', state: '', city: '' }));
    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
  const selectClass = (field) => `w-full bg-white rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer ${errors[field] ? 'ring-2 ring-red-500' : ''}`;

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
                <select name="countryCode" value={formData.countryCode} onChange={handleChange} className={`bg-white rounded-lg px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.countryCode ? 'ring-2 ring-red-500' : ''}`}>
                  <option value="">{t('addressForm.labels.country')}</option>
                  {countries.map(country => (<option key={country.isoCode} value={country.phonecode}>+{country.phonecode}</option>))}
                </select>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder={t('addressForm.placeholders.mobileNumber')} className={`flex-1 ${inputClass('mobileNumber')}`} />
              </div>
              {errors.mobileNumber && <p className="text-red-400 text-xs mt-1">{errors.mobileNumber}</p>}
              {errors.countryCode && <p className="text-red-400 text-xs mt-1">{errors.countryCode}</p>}
            </div>

            {/* Country */}
            <div className="relative">
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.country')} *</label>
              <select name="country" value={formData.country} onChange={handleChange} className={selectClass('country')}>
                <option value="">{t('addressForm.labels.country')}</option>
                {countries.map(country => (<option key={country.isoCode} value={country.name}>{country.name}</option>))}
              </select>
            </div>

            {/* State */}
            <div className="relative">
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.state')} *</label>
              <select name="state" value={formData.state} onChange={handleChange} className={selectClass('state')} disabled={!formData.country}>
                <option value="">{t('addressForm.labels.state')}</option>
                {states.map(state => (<option key={state.isoCode} value={state.name}>{state.name}</option>))}
              </select>
            </div>

            {/* City */}
            <div className="relative">
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.city')} *</label>
              <select name="city" value={formData.city} onChange={handleChange} className={selectClass('city')} disabled={!formData.state}>
                <option value="">{t('addressForm.labels.city')}</option>
                {cities.map(city => (<option key={city.name} value={city.name}>{city.name}</option>))}
              </select>
            </div>

            {/* Street */}
            <div>
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.street')} *</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder={t('addressForm.placeholders.street')} className={inputClass('street')} />
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-white text-sm mb-2">{t('addressForm.labels.pinCode')} *</label>
              <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder={t('addressForm.placeholders.pinCode')} className={inputClass('pinCode')} />
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
