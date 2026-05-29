import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, ChevronDown, Loader, ArrowLeft, Check, ArrowRight, MapPin } from 'lucide-react';

// Add to your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

const BASE_URL = import.meta.env.VITE_API_URL;

const styles = `
  .af-page {
    font-family: 'DM Sans', sans-serif;
    background: #FAF6EE;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
    min-height: 100vh;
    color: #111;
  }

  .af-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #333;
    background: none;
    border: none;
    cursor: pointer;
    padding: 1.5rem 0 0;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    letter-spacing: 0.03em;
    transition: color 0.18s;
  }
  .af-back-btn:hover { color: #BA7517; }

  .af-title-block {
    padding: 1.25rem 0 1.5rem;
    border-bottom: 0.5px solid #e8e2d4;
    margin-bottom: 1.75rem;
  }
  .af-eyebrow {
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #BA7517;
    margin-bottom: 5px;
    font-weight: 600;
  }
  .af-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    margin: 0 0 5px;
    color: #111;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }
  .af-subtitle {
    font-size: 13px;
    color: #555;
    font-weight: 400;
    margin: 0;
  }

  /* Section label */
  .af-section-label {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #777;
    font-weight: 600;
    margin-bottom: 0.875rem;
    margin-top: 1.75rem;
  }
  .af-section-label:first-of-type { margin-top: 0; }

  /* Field */
  .af-field { margin-bottom: 1rem; }
  .af-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .af-input {
    width: 100%;
    background: #faf8f4;
    border: 0.5px solid #e5ddd0;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #111;
    outline: none;
    transition: border-color 0.18s, background 0.18s;
    box-sizing: border-box;
    font-weight: 400;
  }
  .af-input::placeholder { color: #999; font-weight: 400; }
  .af-input:focus { border-color: #EF9F27; background: #fffdf7; }
  .af-input.error { border-color: #e05252; background: #fff8f8; }

  .af-error {
    font-size: 11.5px;
    color: #c0392b;
    margin-top: 4px;
    font-weight: 400;
  }

  /* Phone row */
  .af-phone-row { display: flex; gap: 8px; }
  .af-code-wrap { position: relative; flex-shrink: 0; width: 110px; }

  /* Dropdown trigger */
  .af-dropdown-trigger {
    width: 100%;
    background: #faf8f4;
    border: 0.5px solid #e5ddd0;
    border-radius: 10px;
    padding: 0.75rem 0.875rem;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #111;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    transition: border-color 0.18s, background 0.18s;
    box-sizing: border-box;
    user-select: none;
  }
  .af-dropdown-trigger:hover { border-color: #EF9F27; }
  .af-dropdown-trigger.open { border-color: #EF9F27; background: #fffdf7; }
  .af-dropdown-trigger.error { border-color: #e05252; background: #fff8f8; }
  .af-dropdown-trigger.disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
  .af-dropdown-placeholder { color: #999; font-weight: 400; }

  .af-chevron {
    flex-shrink: 0;
    color: #666;
    transition: transform 0.18s;
  }
  .af-chevron.open { transform: rotate(180deg); color: #BA7517; }

  /* Dropdown panel */
  .af-dropdown-panel {
    position: absolute;
    z-index: 100;
    width: 100%;
    min-width: 220px;
    top: calc(100% + 4px);
    left: 0;
    background: #fff;
    border: 0.5px solid #e5ddd0;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    overflow: hidden;
    animation: dropIn 0.14s ease;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .af-search-wrap {
    padding: 8px;
    border-bottom: 0.5px solid #f0ebe1;
    position: relative;
  }
  .af-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
  }
  .af-search-input {
    width: 100%;
    padding: 7px 10px 7px 32px;
    border: 0.5px solid #e5ddd0;
    border-radius: 7px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    background: #faf8f4;
    color: #111;
    box-sizing: border-box;
  }
  .af-search-input:focus { border-color: #EF9F27; }
  .af-search-input::placeholder { color: #999; }

  .af-dropdown-list { max-height: 200px; overflow-y: auto; }
  .af-dropdown-item {
    padding: 9px 14px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #111;
    cursor: pointer;
    transition: background 0.12s;
  }
  .af-dropdown-item:hover { background: #fffbf0; color: #BA7517; }
  .af-dropdown-empty {
    padding: 12px 14px;
    font-size: 13px;
    color: #666;
    font-weight: 300;
  }

  /* Grid */
  .af-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1rem;
  }
  @media (max-width: 480px) { .af-grid-2 { grid-template-columns: 1fr; } }

  /* Submit area */
  .af-submit-wrap {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 0.5px solid #e8e2d4;
  }
  .af-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 0.9rem;
    background: #BA7517;
    border: none;
    border-radius: 10px;
    color: #FAEEDA;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s;
  }
  .af-submit-btn:hover:not(:disabled) { background: #854F0B; }
  .af-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Loading page */
  .af-page-loader {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .af-spin {
    animation: spin 1s linear infinite;
    color: #EF9F27;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Success */
  .af-success-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    max-width: 560px;
    margin: 0 auto;
    padding: 0 1rem;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .af-success-card {
    text-align: center;
    padding: 2.5rem 2rem;
    border: 0.5px solid #e8e2d4;
    border-radius: 16px;
    max-width: 380px;
    width: 100%;
  }
  .af-success-icon {
    width: 56px;
    height: 56px;
    background: #FAEEDA;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    color: #BA7517;
  }
  .af-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    color: #111;
    margin-bottom: 6px;
  }
  .af-success-sub {
    font-size: 13px;
    color: #333;
    font-weight: 300;
    margin-bottom: 1.75rem;
    line-height: 1.6;
  }
  .af-success-btns { display: flex; gap: 10px; flex-direction: column; }
  .af-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 0.8rem 1rem;
    background: #BA7517; border: none; border-radius: 10px;
    color: #FAEEDA; font-size: 13px; font-family: 'DM Sans', sans-serif;
    font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
    cursor: pointer; transition: background 0.18s;
  }
  .af-btn-primary:hover { background: #854F0B; }
  .af-btn-secondary {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 0.8rem 1rem;
    background: transparent; border: 0.5px solid #e5ddd0; border-radius: 10px;
    color: #888; font-size: 13px; font-family: 'DM Sans', sans-serif;
    font-weight: 400; cursor: pointer; transition: border-color 0.18s, color 0.18s;
  }
  .af-btn-secondary:hover { border-color: #BA7517; color: #BA7517; }

  /* Field animation */
  .af-field {
    animation: fadeUp 0.24s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── sessionStorage cache ──────────────────────────────────────
const cache = {
  get: (key) => { try { const i = sessionStorage.getItem(key); return i ? JSON.parse(i) : null; } catch { return null; } },
  set: (key, val) => { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch { } }
};

// ── Searchable Dropdown ───────────────────────────────────────
function SearchableDropdown({ field, label, placeholder, options, value, onSelect, disabled, isLoading, renderOption, getOptionValue, openDropdown, setOpenDropdown, searchTerms, setSearchTerms, dropdownRefs, error }) {
  const isOpen = openDropdown === field;
  return (
    <div className="af-field" ref={el => dropdownRefs.current[field] = el} style={{ position: 'relative' }}>
      <label className="af-label">{label} *</label>
      <div
        className={`af-dropdown-trigger${isOpen ? ' open' : ''}${error ? ' error' : ''}${disabled || isLoading ? ' disabled' : ''}`}
        onClick={() => !disabled && !isLoading && setOpenDropdown(isOpen ? null : field)}
      >
        <span className={value ? '' : 'af-dropdown-placeholder'}>
          {isLoading ? 'Loading…' : (value || placeholder)}
        </span>
        {isLoading
          ? <Loader size={14} className="af-spin" />
          : <ChevronDown size={15} className={`af-chevron${isOpen ? ' open' : ''}`} />
        }
      </div>

      {isOpen && !disabled && !isLoading && (
        <div className="af-dropdown-panel" onMouseDown={e => e.preventDefault()}>
          <div className="af-search-wrap">
            <Search size={13} className="af-search-icon" />
            <input
              className="af-search-input"
              type="text"
              autoFocus
              value={searchTerms[field]}
              onChange={e => setSearchTerms(p => ({ ...p, [field]: e.target.value }))}
              placeholder={`Search ${label.toLowerCase()}…`}
            />
          </div>
          <div className="af-dropdown-list">
            {options.length === 0
              ? <div className="af-dropdown-empty">No results found</div>
              : options.map((opt, i) => (
                <div key={i} className="af-dropdown-item" onMouseDown={e => { e.preventDefault(); onSelect(getOptionValue(opt)); }}>
                  {renderOption(opt)}
                </div>
              ))
            }
          </div>
        </div>
      )}
      {error && <p className="af-error">{error}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AddressForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: '', mobileNumber: '', countryCode: '+91',
    countryIsoCode: '', stateIsoCode: '',
    country: '', state: '', city: '', street: '', pinCode: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState({ countries: false, states: false, cities: false });

  const [searchTerms, setSearchTerms] = useState({ countryCode: '', country: '', state: '', city: '' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // ── API ───────────────────────────────────────────────────────
  const fetchCountries = async () => {
    const cached = cache.get('all_countries');
    if (cached) { setCountries(cached); return cached; }
    setLoadingStates(p => ({ ...p, countries: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/user/location/countries`);
      const data = await res.json();
      if (data.success) { cache.set('all_countries', data.data); setCountries(data.data); return data.data; }
    } catch (e) { console.error(e); }
    finally { setLoadingStates(p => ({ ...p, countries: false })); }
    return [];
  };

  const fetchStates = async (countryIso) => {
    if (!countryIso) return [];
    const key = `states_${countryIso}`;
    const cached = cache.get(key);
    if (cached) { setStates(cached); return cached; }
    setLoadingStates(p => ({ ...p, states: true })); setCities([]);
    try {
      const res = await fetch(`${BASE_URL}/api/user/location/states?country=${countryIso}`);
      const data = await res.json();
      if (data.success) { cache.set(key, data.data); setStates(data.data); return data.data; }
    } catch (e) { console.error(e); }
    finally { setLoadingStates(p => ({ ...p, states: false })); }
    return [];
  };

  const fetchCities = async (countryIso, stateIso) => {
    if (!countryIso || !stateIso) return [];
    const key = `cities_${countryIso}_${stateIso}`;
    const cached = cache.get(key);
    if (cached) { setCities(cached); return cached; }
    setLoadingStates(p => ({ ...p, cities: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/user/location/cities?country=${countryIso}&state=${stateIso}`);
      const data = await res.json();
      if (data.success) { cache.set(key, data.data); setCities(data.data); return data.data; }
    } catch (e) { console.error(e); }
    finally { setLoadingStates(p => ({ ...p, cities: false })); }
    return [];
  };

  // ── Filtered lists ────────────────────────────────────────────
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

  // ── Effects ───────────────────────────────────────────────────
  useEffect(() => {
    fetchCountries().then(async (all) => {
      if (id) { setEditMode(true); setAddressId(id); await loadAddress(id, all); }
    });
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (openDropdown && dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  // ── Handlers ──────────────────────────────────────────────────
  const loadAddress = async (addrId, allCountries) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/address/getAddress/${addrId}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const { data } = await res.json();
        const list = allCountries || cache.get('all_countries') || [];
        const found = list.find(c => c.country === data.country);
        const iso = found?.isoCode || '';
        setFormData({
          fullName: data.fullName || '', mobileNumber: data.phoneNumber || '',
          countryCode: data.countryCode || '+91', countryIsoCode: iso, stateIsoCode: '',
          country: data.country || '', state: data.state || '',
          city: data.city || '', street: data.street || '', pinCode: data.pinCode || ''
        });
        if (iso) {
          const stateList = await fetchStates(iso);
          const foundState = stateList.find(s => s.name === data.state);
          if (foundState) {
            setFormData(p => ({ ...p, stateIsoCode: foundState.isoCode }));
            await fetchCities(iso, foundState.isoCode);
          }
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) e.fullName = 'At least 2 characters';
    else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) e.fullName = 'Letters and spaces only';
    if (!formData.countryCode) e.countryCode = 'Country code required';
    if (!formData.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required';
    else if (!/^\d+$/.test(formData.mobileNumber)) e.mobileNumber = 'Digits only';
    else if (formData.mobileNumber.length < 7 || formData.mobileNumber.length > 15) e.mobileNumber = '7–15 digits';
    if (!formData.country) e.country = 'Country is required';
    if (!formData.state) e.state = 'State is required';
    if (!formData.city) e.city = 'City is required';
    if (!formData.street.trim()) e.street = 'Street address is required';
    else if (formData.street.trim().length < 5) e.street = 'At least 5 characters';
    if (!formData.pinCode) e.pinCode = 'PIN code is required';
    else if (!/^\d+$/.test(formData.pinCode)) e.pinCode = 'Digits only';
    else if (formData.pinCode.length < 4 || formData.pinCode.length > 10) e.pinCode = '4–10 digits';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSelectCountryCode = (phonecode) => {
    const matched = countries.find(c => c.phonecode === phonecode);
    setFormData(p => ({
      ...p, countryCode: `+${phonecode}`,
      ...(matched ? { countryIsoCode: matched.isoCode, country: matched.country, stateIsoCode: '', state: '', city: '' } : {})
    }));
    if (matched) { setStates([]); setCities([]); fetchStates(matched.isoCode); }
    setOpenDropdown(null);
    setSearchTerms(p => ({ ...p, countryCode: '' }));
    if (errors.countryCode) setErrors(p => ({ ...p, countryCode: '' }));
  };

  const handleSelectCountry = async (isoCode) => {
    const sel = countries.find(c => c.isoCode === isoCode);
    if (!sel) return;
    setFormData(p => ({
      ...p, countryIsoCode: sel.isoCode, country: sel.country,
      countryCode: sel.phonecode ? `+${sel.phonecode}` : p.countryCode,
      stateIsoCode: '', state: '', city: ''
    }));
    setStates([]); setCities([]);
    if (errors.country) setErrors(p => ({ ...p, country: '' }));
    await fetchStates(sel.isoCode);
    setOpenDropdown(null);
    setSearchTerms(p => ({ ...p, country: '' }));
  };

  const handleSelectState = async (isoCode) => {
    const sel = states.find(s => s.isoCode === isoCode);
    if (!sel) return;
    setFormData(p => ({ ...p, stateIsoCode: sel.isoCode, state: sel.name, city: '' }));
    setCities([]);
    if (errors.state) setErrors(p => ({ ...p, state: '' }));
    await fetchCities(formData.countryIsoCode, isoCode);
    setOpenDropdown(null);
    setSearchTerms(p => ({ ...p, state: '' }));
  };

  const handleSelectCity = (cityName) => {
    setFormData(p => ({ ...p, city: cityName }));
    if (errors.city) setErrors(p => ({ ...p, city: '' }));
    setOpenDropdown(null);
    setSearchTerms(p => ({ ...p, city: '' }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      document.querySelector(`[name="${Object.keys(validationErrors)[0]}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    try {
      const body = {
        fullName: formData.fullName, phoneNumber: formData.mobileNumber,
        countryCode: formData.countryCode, country: formData.country,
        state: formData.state, city: formData.city,
        street: formData.street, pinCode: formData.pinCode
      };
      const url = editMode
        ? `${BASE_URL}/api/user/address/updateAddress/${addressId}`
        : `${BASE_URL}/api/user/address/addAddress`;
      const res = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(body)
      });
      if (res.ok) setSubmitted(true);
      else { const err = await res.json(); alert(err.message || 'Failed to save address.'); }
    } catch { alert('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const sharedDropdownProps = { openDropdown, setOpenDropdown, searchTerms, setSearchTerms, dropdownRefs };

  // ── Loading ───────────────────────────────────────────────────
  if (loading && editMode && !formData.fullName) {
    return (
      <>
        <style>{styles}</style>
        <div className="af-page-loader">
          <Loader size={32} className="af-spin" />
        </div>
      </>
    );
  }

  // ── Success ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="af-success-wrap">
          <div className="af-success-card">
            <div className="af-success-icon">
              <Check size={24} strokeWidth={2} />
            </div>
            <div className="af-success-title">
              {editMode ? 'Address updated' : 'Address saved'}
            </div>
            <p className="af-success-sub">
              {editMode
                ? 'Your address has been updated successfully.'
                : 'Your new address has been saved and is ready to use.'}
            </p>
            <div className="af-success-btns">
              <button className="af-btn-primary" onClick={() => navigate('/addresses')}>
                View all addresses <ArrowRight size={14} strokeWidth={2} />
              </button>
              <button className="af-btn-secondary" onClick={() => {
                setSubmitted(false); setEditMode(false); setAddressId(null);
                setFormData({ fullName: '', mobileNumber: '', countryCode: '+91', countryIsoCode: '', stateIsoCode: '', country: '', state: '', city: '', street: '', pinCode: '' });
                setErrors({});
              }}>
                Add another address
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="af-page">

        <button className="af-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          Back
        </button>

        <div className="af-title-block">
          <div className="af-eyebrow">{editMode ? 'Edit' : 'New'} address</div>
          <h1 className="af-title">{editMode ? 'Update Address' : 'Add New Address'}</h1>
          <p className="af-subtitle">Fill in your delivery details below</p>
        </div>

        {/* ── Contact ── */}
        <div className="af-section-label">Contact details</div>

        <div className="af-field" style={{ animationDelay: '0.04s' }}>
          <label className="af-label">Full name *</label>
          <input
            type="text" name="fullName" value={formData.fullName}
            onChange={handleChange} placeholder="e.g. Aryan Sharma"
            className={`af-input${errors.fullName ? ' error' : ''}`}
          />
          {errors.fullName && <p className="af-error">{errors.fullName}</p>}
        </div>

        <div className="af-field" style={{ animationDelay: '0.08s' }}>
          <label className="af-label">Mobile number *</label>
          <div className="af-phone-row">
            {/* Country code picker */}
            <div className="af-code-wrap" ref={el => dropdownRefs.current['countryCode'] = el}>
              <div
                className={`af-dropdown-trigger${openDropdown === 'countryCode' ? ' open' : ''}${errors.countryCode ? ' error' : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'countryCode' ? null : 'countryCode')}
              >
                <span>{formData.countryCode || 'Code'}</span>
                <ChevronDown size={14} className={`af-chevron${openDropdown === 'countryCode' ? ' open' : ''}`} />
              </div>
              {openDropdown === 'countryCode' && (
                <div className="af-dropdown-panel" style={{ minWidth: '220px' }} onMouseDown={e => e.preventDefault()}>
                  <div className="af-search-wrap">
                    <Search size={13} className="af-search-icon" />
                    <input
                      className="af-search-input" type="text" autoFocus
                      value={searchTerms.countryCode}
                      onChange={e => setSearchTerms(p => ({ ...p, countryCode: e.target.value }))}
                      placeholder="Search country code…"
                    />
                  </div>
                  <div className="af-dropdown-list">
                    {filteredCountryCodes.length === 0
                      ? <div className="af-dropdown-empty">No results found</div>
                      : filteredCountryCodes.map(c => (
                        <div key={c.isoCode} className="af-dropdown-item"
                          onMouseDown={e => { e.preventDefault(); handleSelectCountryCode(c.phonecode); }}>
                          +{c.phonecode} — {c.country}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            <input
              type="tel" name="mobileNumber" value={formData.mobileNumber}
              onChange={handleChange} placeholder="Mobile number"
              className={`af-input${errors.mobileNumber ? ' error' : ''}`}
              style={{ flex: 1 }}
            />
          </div>
          {errors.mobileNumber && <p className="af-error">{errors.mobileNumber}</p>}
          {errors.countryCode && <p className="af-error">{errors.countryCode}</p>}
        </div>

        {/* ── Location ── */}
        <div className="af-section-label">Delivery location</div>

        <div className="af-grid-2">
          <SearchableDropdown
            field="country" label="Country" placeholder="Select country"
            options={filteredCountries} value={formData.country}
            onSelect={handleSelectCountry} disabled={false}
            isLoading={loadingStates.countries}
            renderOption={c => `${c.flag || ''} ${c.country}`}
            getOptionValue={c => c.isoCode}
            error={errors.country}
            {...sharedDropdownProps}
          />
          <SearchableDropdown
            field="state" label="State" placeholder="Select state"
            options={filteredStates} value={formData.state}
            onSelect={handleSelectState} disabled={!formData.countryIsoCode}
            isLoading={loadingStates.states}
            renderOption={s => s.name}
            getOptionValue={s => s.isoCode}
            error={errors.state}
            {...sharedDropdownProps}
          />
          <SearchableDropdown
            field="city" label="City" placeholder="Select city"
            options={filteredCities} value={formData.city}
            onSelect={handleSelectCity} disabled={!formData.stateIsoCode}
            isLoading={loadingStates.cities}
            renderOption={c => c}
            getOptionValue={c => c}
            error={errors.city}
            {...sharedDropdownProps}
          />
          <div className="af-field" style={{ animationDelay: '0.18s' }}>
            <label className="af-label">PIN code *</label>
            <input
              type="text" name="pinCode" value={formData.pinCode}
              onChange={handleChange} placeholder="e.g. 462016"
              className={`af-input${errors.pinCode ? ' error' : ''}`}
            />
            {errors.pinCode && <p className="af-error">{errors.pinCode}</p>}
          </div>
        </div>

        {/* ── Address ── */}
        <div className="af-section-label">Street address</div>

        <div className="af-field" style={{ animationDelay: '0.22s' }}>
          <label className="af-label">Street *</label>
          <input
            type="text" name="street" value={formData.street}
            onChange={handleChange} placeholder="Building, street, area…"
            className={`af-input${errors.street ? ' error' : ''}`}
          />
          {errors.street && <p className="af-error">{errors.street}</p>}
        </div>

        {/* ── Submit ── */}
        <div className="af-submit-wrap">
          <button className="af-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><Loader size={15} className="af-spin" />{editMode ? 'Updating…' : 'Saving…'}</>
              : <>{editMode ? 'Update address' : 'Save address'} <ArrowRight size={15} strokeWidth={2} /></>
            }
          </button>
        </div>

      </div>
    </>
  );
}