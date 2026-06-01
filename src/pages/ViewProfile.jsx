
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, ChevronDown, ArrowLeft, User, CreditCard, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const cache = {
  get: (key) => {
    try { const item = sessionStorage.getItem(key); return item ? JSON.parse(item) : null; }
    catch { return null; }
  },
  set: (key, value) => {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { }
  }
};

export default function ViewProfile() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUsers] = useState();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  );
  const [avatarFile, setAvatarFile] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locationLoading, setLocationLoading] = useState({ states: false, cities: false });

  // ── API CALLS ────────────────────────────────────────────────

  const fetchCountries = async () => {
    const cached = cache.get("all_countries");
    if (cached) { setCountries(cached); return cached; }
    try {
      const res = await fetch(`${BASE_URL}/api/location/countries`);
      const data = await res.json();
      if (data.success) { cache.set('all_countries', data.data); setCountries(data.data); return data.data; }
    } catch (err) { console.error('Failed to fetch countries:', err); }
    return [];
  };

  const fetchStates = async (countryIsoCode) => {
    if (!countryIsoCode) return [];
    const cacheKey = `states_${countryIsoCode}`;
    const cached = cache.get(cacheKey);
    if (cached) { setStates(cached); return cached; }
    setLocationLoading(prev => ({ ...prev, states: true }));
    setCities([]);
    try {
      const res = await fetch(`${BASE_URL}/api/user/location/states?country=${countryIsoCode}`);
      const data = await res.json();
      if (data.success) { cache.set(cacheKey, data.data); setStates(data.data); return data.data; }
    } catch (err) { console.error('Failed to fetch states:', err); }
    finally { setLocationLoading(prev => ({ ...prev, states: false })); }
    return [];
  };

  const fetchCities = async (countryIsoCode, stateIsoCode) => {
    if (!countryIsoCode || !stateIsoCode) return [];
    const cacheKey = `cities_${countryIsoCode}_${stateIsoCode}`;
    const cached = cache.get(cacheKey);
    if (cached) { setCities(cached); return cached; }
    setLocationLoading(prev => ({ ...prev, cities: true }));
    try {
      const res = await fetch(`${BASE_URL}/api/user/location/cities?country=${countryIsoCode}&state=${stateIsoCode}`);
      const data = await res.json();
      if (data.success) { cache.set(cacheKey, data.data); setCities(data.data); return data.data; }
    } catch (err) { console.error('Failed to fetch cities:', err); }
    finally { setLocationLoading(prev => ({ ...prev, cities: false })); }
    return [];
  };

  // ── FETCH USER ────────────────────────────────────────────────

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setPageLoading(true);
        const allCountries = await fetchCountries();
        const res = await fetch(`${BASE_URL}/api/user/getProfile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
          if (data.data.country) {
            const foundCountry = allCountries.find(c => c.country === data.data.country);
            if (foundCountry) {
              const countryStates = await fetchStates(foundCountry.isoCode);
              if (data.data.state) {
                const foundState = countryStates.find(s => s.name === data.data.state);
                if (foundState) await fetchCities(foundCountry.isoCode, foundState.isoCode);
              }
            }
          }
          if (data.data.profileImage) setAvatar(data.data.profileImage);
        }
      } catch (err) { console.error("Failed to fetch user:", err); }
      finally { setPageLoading(false); }
    };
    fetchUser();
  }, []);

  // ── REACT HOOK FORM ───────────────────────────────────────────

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({ defaultValues: {} });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        country: user?.country || "",
        state: user?.state || "",
        city: user?.city || "",
        dob: user?.dob ? user.dob.split("T")[0] : "",
        bankName: user?.bankDetails?.bankName || "",
        accountNumber: user?.bankDetails?.accountNumber || "",
        ifscCode: user?.bankDetails?.ifscCode || "",
        accountType: user?.bankDetails?.accountType || "",
        accountHolderName: user?.bankDetails?.accountHolderName || "",
      });
    }
  }, [user, reset]);

  const watchedCountry = watch("country");
  const watchedState = watch("state");

  useEffect(() => {
    if (!watchedCountry || countries.length === 0) return;
    const foundCountry = countries.find(c => c.country === watchedCountry);
    if (foundCountry) fetchStates(foundCountry.isoCode);
  }, [watchedCountry, countries]);

  useEffect(() => {
    if (!watchedState || states.length === 0 || countries.length === 0) return;
    const foundCountry = countries.find(c => c.country === watchedCountry);
    const foundState = states.find(s => s.name === watchedState);
    if (foundCountry && foundState) fetchCities(foundCountry.isoCode, foundState.isoCode);
  }, [watchedState, states]);

  // ── HANDLERS ─────────────────────────────────────────────────

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setAvatar(URL.createObjectURL(file)); setAvatarFile(file); }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    if (avatarFile) formData.append("profileImage", avatarFile);
    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("dob", data.dob);
    formData.append("country", data.country);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("bankDetails[bankName]", data.bankName);
    formData.append("bankDetails[accountNumber]", data.accountNumber);
    formData.append("bankDetails[ifscCode]", data.ifscCode?.toUpperCase());
    formData.append("bankDetails[accountType]", data.accountType);
    formData.append("bankDetails[accountHolderName]", data.accountHolderName.trim());
    try {
      const res = await fetch(`${BASE_URL}/api/user/updateProfile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });
      const result = await res.json();
      if (result.success) { localStorage.setItem("user", JSON.stringify(result.data)); alert("Profile updated successfully!"); }
      else { alert(result.message || "Update failed"); }
    } catch (error) { console.error("Update failed:", error); }
    finally { setLoading(false); }
  };

  // ── STYLES ────────────────────────────────────────────────────

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Outfit:wght@300;400;500;600&display=swap');

    .vp-root { font-family: 'Outfit', sans-serif;   min-height: 100vh; }
    .vp-root * { box-sizing: border-box; }

    @keyframes vp-fade-up {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes vp-spin { to { transform: rotate(360deg); } }

    .vp-fade-up { animation: vp-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
    .vp-fade-up-1 { animation-delay: 0.05s; }
    .vp-fade-up-2 { animation-delay: 0.12s; }
    .vp-fade-up-3 { animation-delay: 0.19s; }
    .vp-fade-up-4 { animation-delay: 0.26s; }

    .vp-header {
      background: #fff;
      border-bottom: 1px solid #f0ebe3;
      padding: 14px 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .vp-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: transparent;
      border: 1.5px solid #e8e2da;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      color: #78716c;
      cursor: pointer;
      transition: all 0.18s;
      font-family: 'Outfit', sans-serif;
    }
    .vp-back-btn:hover { background: #faf8f5; border-color: #d6cfc6; color: #44403c; }

    .vp-page-title {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: #1c1917;
      margin: 0;
    }

    .vp-layout {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 24px 64px;
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 28px;
      align-items: start;
    }
    @media (max-width: 700px) {
      .vp-layout { grid-template-columns: 1fr; }
      .vp-header { padding: 12px 16px; }
    }

    /* ── LEFT CARD ── */
    .vp-profile-card {
      background: #fff;
      border: 1px solid #f0ebe3;
      border-radius: 20px;
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      position: sticky;
      top: 80px;
    }
    .vp-avatar-wrap {
      position: relative;
      width: 96px;
      height: 96px;
    }
    .vp-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #fff;
      box-shadow: 0 0 0 2px #f59e0b, 0 8px 24px rgba(0,0,0,0.10);
    }
    .vp-avatar-btn {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #f59e0b;
      border: 2.5px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.18s, transform 0.18s;
    }
    .vp-avatar-btn:hover { background: #d97706; transform: scale(1.08); }
    .vp-user-name {
      font-family: 'Playfair Display', serif;
      font-size: 17px;
      font-weight: 600;
      color: #1c1917;
      text-align: center;
      margin: 0;
      line-height: 1.3;
    }
    .vp-user-phone {
      font-size: 12px;
      color: #a8a29e;
      margin: 0;
      letter-spacing: 0.02em;
    }
    .vp-divider { width: 100%; height: 1px; background: #f0ebe3; }
    .vp-card-nav { width: 100%; display: flex; flex-direction: column; gap: 4px; }
    .vp-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      color: #78716c;
      cursor: default;
    }
    .vp-nav-item.active { background: #fff8ed; color: #b45309; }
    .vp-nav-item.active svg { color: #f59e0b; }

    /* ── RIGHT FORM ── */
    .vp-form-area { display: flex; flex-direction: column; gap: 20px; }

    .vp-section {
      background: #fff;
      border: 1px solid #f0ebe3;
      border-radius: 20px;
      overflow: hidden;
    }
    .vp-section-header {
      padding: 18px 24px 16px;
      border-bottom: 1px solid #f5f0ea;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .vp-section-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #fff8ed;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .vp-section-title {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 600;
      color: #1c1917;
      margin: 0;
    }
    .vp-section-body {
      padding: 20px 24px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .vp-section-body.single { grid-template-columns: 1fr; }
    @media (max-width: 560px) { .vp-section-body { grid-template-columns: 1fr; } }

    /* ── FIELD ── */
    .vp-field { display: flex; flex-direction: column; gap: 5px; }
    .vp-field.full { grid-column: 1 / -1; }

    .vp-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #a8a29e;
    }
    .vp-label .req { color: #f59e0b; margin-left: 2px; }

    .vp-input {
      width: 100%;
      background: #faf8f5;
      border: 1.5px solid #e8e2da;
      border-radius: 12px;
      padding: 11px 14px;
      font-size: 14px;
      font-family: 'Outfit', sans-serif;
      color: #1c1917;
      outline: none;
      transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    }
    .vp-input::placeholder { color: #c4bdb5; }
    .vp-input:focus {
      border-color: #f59e0b;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
    }
    .vp-input:disabled { opacity: 0.45; cursor: not-allowed; }
    .vp-input.error { border-color: #f87171; background: #fff9f9; }

    .vp-select-wrap { position: relative; }
    .vp-select-wrap select {
      width: 100%;
      background: #faf8f5;
      border: 1.5px solid #e8e2da;
      border-radius: 12px;
      padding: 11px 38px 11px 14px;
      font-size: 14px;
      font-family: 'Outfit', sans-serif;
      color: #1c1917;
      outline: none;
      appearance: none;
      cursor: pointer;
      transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    }
    .vp-select-wrap select:focus {
      border-color: #f59e0b;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
    }
    .vp-select-wrap select:disabled { opacity: 0.45; cursor: not-allowed; }
    .vp-select-wrap select.error { border-color: #f87171; }
    .vp-select-wrap .vp-chevron {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #a8a29e;
    }
    .vp-select-wrap .vp-spinner {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #f59e0b;
      animation: vp-spin 0.8s linear infinite;
    }

    .vp-error { font-size: 11px; color: #ef4444; margin-top: 2px; }

    /* ── SUBMIT ── */
    .vp-submit-wrap {
      background: #fff;
      border: 1px solid #f0ebe3;
      border-radius: 20px;
      padding: 20px 24px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
    }
    .vp-submit-hint { font-size: 12px; color: #a8a29e; flex: 1; }
    .vp-submit-btn {
      padding: 12px 32px;
      border-radius: 12px;
      border: none;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
      box-shadow: 0 4px 16px rgba(245,158,11,0.30);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vp-submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.38); }
    .vp-submit-btn:active:not(:disabled) { transform: translateY(0); }
    .vp-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

    /* ── LOADING SCREEN ── */
    .vp-loading-screen {
      position: fixed; inset: 0; z-index: 50;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(250,248,245,0.92);
      backdrop-filter: blur(6px);
      gap: 16px;
    }
    .vp-loading-ring {
      width: 44px; height: 44px;
      border: 3px solid #f0ebe3;
      border-top-color: #f59e0b;
      border-radius: 50%;
      animation: vp-spin 0.75s linear infinite;
    }
    .vp-loading-text {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      color: #78716c;
      letter-spacing: 0.04em;
    }
  `;

  // ── REUSABLE INPUT ────────────────────────────────────────────

  const InputField = ({ label, name, type = "text", isSelect, options, optionLabelKey, rules = {}, required = true, className = "", ...rest }) => (
    <div className={`vp-field${className ? ' ' + className : ''}`}>
      <label className="vp-label">{label}{required && <span className="req">*</span>}</label>
      {isSelect ? (
        <div className="vp-select-wrap">
          <select
            {...register(name, { ...(required && { required: `${label} is required` }), ...rules })}
            className={errors[name] ? "error" : ""}
          >
            <option value="">Select {label}</option>
            {options?.map((opt, i) => {
              const lbl = typeof opt === 'string' ? opt : (opt[optionLabelKey] || opt.name || opt.country || opt);
              return <option key={i} value={lbl}>{lbl}</option>;
            })}
          </select>
          <ChevronDown size={15} className="vp-chevron" />
        </div>
      ) : (
        <input
          type={type}
          {...register(name, { ...(required && { required: `${label} is required` }), ...rules })}
          className={`vp-input${errors[name] ? ' error' : ''}`}
          {...rest}
        />
      )}
      {errors[name] && <span className="vp-error">{errors[name]?.message?.toString()}</span>}
    </div>
  );

  // ── LOADING SCREEN ────────────────────────────────────────────

  if (pageLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="vp-loading-screen">
          <div className="vp-loading-ring" />
          <p className="vp-loading-text">Loading your profile…</p>
        </div>
      </>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <>
      <style>{styles}</style>
      <div className="vp-root">

        {/* Sticky header */}
        <header className="vp-header">
          <button className="vp-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} />
            Back
          </button>
          <h1 className="vp-page-title">Edit Profile</h1>
        </header>

        <div className="vp-layout">

          {/* ── Left: profile card ── */}
          <aside className="vp-profile-card vp-fade-up">
            <div className="vp-avatar-wrap">
              <img src={avatar} alt="avatar" className="vp-avatar" />
              <label className="vp-avatar-btn" title="Change photo">
                <Camera size={13} color="#fff" />
                <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={onAvatarChange} />
              </label>
            </div>

            <h2 className="vp-user-name">{user?.name || "Your Name"}</h2>
            <p className="vp-user-phone">+{user?.phoneNumber || "—"}</p>

            <div className="vp-divider" />

            <nav className="vp-card-nav">
              <div className="vp-nav-item active">
                <User size={15} />
                Personal Info
              </div>
              <div className="vp-nav-item">
                <MapPin size={15} />
                Location
              </div>
              <div className="vp-nav-item">
                <CreditCard size={15} />
                Bank Details
              </div>
            </nav>
          </aside>

          {/* ── Right: form sections ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="vp-form-area">

            {/* Personal Info */}
            <section className="vp-section vp-fade-up vp-fade-up-1">
              <div className="vp-section-header">
                <div className="vp-section-icon">
                  <User size={16} color="#f59e0b" />
                </div>
                <h2 className="vp-section-title">Personal Information</h2>
              </div>
              <div className="vp-section-body">
                <InputField label="Full Name" name="name"
                  rules={{ pattern: { value: /^[A-Za-z\s]{2,}$/, message: "Only letters & spaces (min 2 chars)" } }}
                  placeholder="e.g. Arun Kumar" />

                <InputField label="Mobile Number" name="phoneNumber"
                  rules={{
                    pattern: { value: /^[1-9]\d{9}$/, message: "Must be 10 digits, not starting with 0" },
                    required: "Mobile number is required"
                  }}
                  placeholder="9876543210" />

                <InputField label="Email Address" type="email" name="email" required={false}
                  rules={{ validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email address" }}
                  placeholder="you@example.com" />

                <InputField label="Date of Birth" name="dob" type="date" required={false} />
              </div>
            </section>

            {/* Location */}
            <section className="vp-section vp-fade-up vp-fade-up-2">
              <div className="vp-section-header">
                <div className="vp-section-icon">
                  <MapPin size={16} color="#f59e0b" />
                </div>
                <h2 className="vp-section-title">Location</h2>
              </div>
              <div className="vp-section-body">
                {/* Country */}
                <InputField label="Country" name="country" isSelect options={countries} optionLabelKey="country" />

                {/* State */}
                <div className="vp-field">
                  <label className="vp-label">State<span style={{ color: '#f59e0b', marginLeft: 2 }}>*</span></label>
                  <div className="vp-select-wrap">
                    <select
                      {...register("state", { required: "State is required" })}
                      disabled={locationLoading.states || states.length === 0}
                      className={errors.state ? "error" : ""}
                    >
                      <option value="">{locationLoading.states ? "Loading…" : "Select State"}</option>
                      {states.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                    </select>
                    {locationLoading.states
                      ? <Loader2 size={14} className="vp-spinner" />
                      : <ChevronDown size={15} className="vp-chevron" />
                    }
                  </div>
                  {errors.state && <span className="vp-error">{errors.state?.message?.toString()}</span>}
                </div>

                {/* City */}
                <div className="vp-field">
                  <label className="vp-label">City<span style={{ color: '#f59e0b', marginLeft: 2 }}>*</span></label>
                  <div className="vp-select-wrap">
                    <select
                      {...register("city", { required: "City is required" })}
                      disabled={locationLoading.cities || cities.length === 0}
                      className={errors.city ? "error" : ""}
                    >
                      <option value="">{locationLoading.cities ? "Loading…" : "Select City"}</option>
                      {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                    {locationLoading.cities
                      ? <Loader2 size={14} className="vp-spinner" />
                      : <ChevronDown size={15} className="vp-chevron" />
                    }
                  </div>
                  {errors.city && <span className="vp-error">{errors.city?.message?.toString()}</span>}
                </div>
              </div>
            </section>

            {/* Bank Details */}
            <section className="vp-section vp-fade-up vp-fade-up-3">
              <div className="vp-section-header">
                <div className="vp-section-icon">
                  <CreditCard size={16} color="#f59e0b" />
                </div>
                <h2 className="vp-section-title">Bank Details</h2>
              </div>
              <div className="vp-section-body">
                <InputField label="Bank Name" name="bankName" placeholder="e.g. State Bank of India" />

                <InputField label="Account Number" name="accountNumber"
                  rules={{ pattern: { value: /^[0-9]{9,18}$/, message: "9–18 digits required" } }}
                  inputMode="numeric" placeholder="XXXXXXXXXXXXXXXXXX" />

                <InputField label="IFSC Code" name="ifscCode"
                  rules={{
                    setValueAs: (v) => v?.toUpperCase() || "",
                    pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC (e.g. SBIN0001234)" },
                    maxLength: { value: 11, message: "IFSC must be 11 characters" }
                  }}
                  maxLength={11} placeholder="SBIN0001234" />

                <InputField label="Account Type" name="accountType" isSelect
                  options={["Savings", "Current", "Salary"]} />

                <InputField label="Account Holder Name" name="accountHolderName" className="full"
                  rules={{ pattern: { value: /^[A-Za-z\s]{2,}$/, message: "Only letters & spaces (min 2 chars)" } }}
                  placeholder="As printed on your passbook" />
              </div>
            </section>

            {/* Submit */}
            <div className="vp-submit-wrap vp-fade-up vp-fade-up-4">
              <p className="vp-submit-hint">All changes are saved to your account immediately.</p>
              <button type="submit" className="vp-submit-btn" disabled={loading}>
                {loading ? (
                  <><Loader2 size={16} style={{ animation: 'vp-spin 0.75s linear infinite' }} /> Saving…</>
                ) : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

