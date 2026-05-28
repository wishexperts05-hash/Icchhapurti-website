import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function ViewProfile() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUsers] = useState();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  );
  const [avatarFile, setAvatarFile] = useState(null);

  // Location data from API
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

          // Pre-load states and cities for the user's existing location
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

  // Watch country/state to cascade dropdowns
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

  // ── REUSABLE INPUT ────────────────────────────────────────────

  const InputField = ({ label, name, type = "text", isSelect, options, optionLabelKey, rules = {}, required = true, ...rest }) => (
    <div className="flex flex-col gap-1">
      <label className="text-amber-400 text-sm font-medium">{label}</label>

      {isSelect ? (
        <div className="relative">
          <select
            {...register(name, { ...(required && { required: `${label} is required` }), ...rules })}
            className="w-full bg-gray-200 text-gray-800 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">{label}</option>
            {options?.map((opt, i) => {
              const label = typeof opt === 'string' ? opt : (opt[optionLabelKey] || opt.name || opt.country || opt);
              return <option key={i} value={label}>{label}</option>;
            })}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      ) : (
        <input
          type={type}
          {...register(name, { ...(required && { required: `${label} is required` }), ...rules })}
          className="w-full bg-gray-200 text-gray-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          {...rest}
        />
      )}

      {errors[name] && <small className="text-red-400 text-xs">{errors[name]?.message?.toString()}</small>}
    </div>
  );

  // ── LOADING STATE ─────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white text-slate-900">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex my-2 items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="font-bold text-xl mb-6 text-slate-900">{"Update Profile"}</h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img src={avatar} className="w-24 h-24 rounded-full object-cover border-2 border-amber-400" />
            <label className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition">
              <Camera size={15} className="text-white" />
              <input type="file" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label={"Full Name"} name="name"
              rules={{ pattern: { value: /^[A-Za-z\s]{2,}$/, message: "Only letters & spaces (min 2 chars)" } }} />

            <InputField label={"Mobile Number"} name="phoneNumber"
              rules={{
                pattern: { value: /^[1-9]\d{9}$/, message: "Mobile number must be 10 digits and cannot start with 0" },
                required: "Mobile number is required"
              }} />

            <InputField label={"Email"} type="email" name="email" required={false}
              rules={{ validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address" }} />

            <InputField label={"Date Of Birth"} name="dob" type="date" required={false} />

            {/* Country — from API */}
            <InputField
              label={"Country"}
              name="country"
              isSelect
              options={countries}
              optionLabelKey="country"
            />

            {/* State — from API, depends on country */}
            <div className="flex flex-col gap-1">
              <label className="text-amber-400 text-sm font-medium">{"State"}</label>
              <div className="relative">
                <select
                  {...register("state", { required: "State is required" })}
                  disabled={locationLoading.states || states.length === 0}
                  className="w-full bg-gray-200 text-gray-800 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
                >
                  <option value="">{locationLoading.states ? "Loading states..." : "State"}</option>
                  {states.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.state && <small className="text-red-400 text-xs">{errors.state?.message?.toString()}</small>}
            </div>

            {/* City — from API, depends on state, plain strings */}
            <div className="flex flex-col gap-1">
              <label className="text-amber-400 text-sm font-medium">{"City"}</label>
              <div className="relative">
                <select
                  {...register("city", { required: "City is required" })}
                  disabled={locationLoading.cities || cities.length === 0}
                  className="w-full bg-gray-200 text-gray-800 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
                >
                  <option value="">{locationLoading.cities ? "Loading cities..." : "City"}</option>
                  {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.city && <small className="text-red-400 text-xs">{errors.city?.message?.toString()}</small>}
            </div>
          </div>

          {/* Bank Details */}
          <h2 className="text-slate-800 font-semibold mt-6">{"Bank Details"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label={"Bank Name"} name="bankName" />

            <InputField label={"Account Number"} name="accountNumber"
              rules={{ pattern: { value: /^[0-9]{9,18}$/, message: "Account number must be 9–18 digits" } }}
              inputMode="numeric" />

            <InputField label={"IFSC"} name="ifscCode"
              rules={{
                setValueAs: (v) => v?.toUpperCase() || "",
                pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: "Invalid IFSC (e.g. SBIN0001234)" },
                maxLength: { value: 11, message: "IFSC must be 11 characters" }
              }}
              maxLength={11} />

            <InputField label={"Account Type"} name="accountType" isSelect
              options={["Savings", "Current", "Salary"]} />
          </div>

          <InputField label={"Account Holder Name"} name="accountHolderName"
            rules={{ pattern: { value: /^[A-Za-z\s]{2,}$/, message: "Only letters & spaces (min 2 chars)" } }} />

          <button
            className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}