import { useState } from "react";
import { Camera, MapPin, ChevronDown } from "lucide-react";

export default function EditProfile() {
  const avatar =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

  const [formData, setFormData] = useState({
    fullName: "Tony Stark",
    email: "example@mail.com",
    country: "India",
    city: "Nagpur",
    mobileNumber: "9876543210",
    dateOfBirth: "10/01/2002", // DD/MM/YYYY
    state: "West Bengal",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountType: "",
    accountHolderName: "Tony Stark",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ---------------- VALIDATION ---------------- */

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
      case "accountHolderName":
        if (!value.trim()) error = "This field is required";
        else if (!/^[A-Za-z\s]{2,}$/.test(value))
          error = "Only letters & spaces (min 2 chars)";
        break;

      case "mobileNumber":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^\d{10}$/.test(value))
          error = "Mobile must be exactly 10 digits";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;

      case "dateOfBirth": {
        if (!value) {
          error = "DOB is required";
          break;
        }
        const [d, m, y] = value.split("/").map(Number);
        const dob = new Date(y, m - 1, d);
        if (isNaN(dob.getTime())) {
          error = "Invalid date";
          break;
        }
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const mDiff = today.getMonth() - dob.getMonth();
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 10) error = "Minimum age is 10";
        break;
      }

      case "country":
      case "state":
      case "city":
        if (!value.trim()) error = "This field is required";
        break;

      /* ---------- BANK FIELDS ---------- */

      case "bankName":
        if (!value) error = "Select a bank";
        break;

      case "accountNumber":
        if (!value.trim()) error = "Account number is required";
        else if (!/^\d{9,18}$/.test(value))
          error = "Account number must be 9–18 digits";
        // RBI guideline: typical range 9–18 digits. [web:53][web:76]
        break;

      case "ifsc":
        if (!value.trim()) error = "IFSC is required";
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
          error = "Invalid IFSC (e.g. SBIN0001234)";
        // 4 letters, 0, 6 alphanumeric, total 11 chars. [web:61][web:67]
        break;

      case "accountType":
        if (!value) error = "Select account type";
        break;

      default:
        break;
    }

    return error;
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "ifsc") value = value.toUpperCase();
    if (name === "mobileNumber" || name === "accountNumber") {
      // keep only digits
      value = value.replace(/\D/g, "");
    }

    setFormData((p) => ({ ...p, [name]: value }));

    if (touched[name]) {
      setErrors((p) => ({
        ...p,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({
      ...p,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {})
    );

    if (Object.keys(newErrors).length === 0) {
      alert("Profile updated successfully!");
      console.log("SUBMITTED:", formData);
    } else {
      const firstErrorField = Object.keys(newErrors)[0];
      document
        .querySelector(`[name="${firstErrorField}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  /* ---------------- INPUT COMPONENT ---------------- */

  const InputField = ({
    label,
    name,
    isSelect,
    options = [],
    prefix,
    ...props
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-amber-400 text-sm">{label}</label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {prefix}
          </span>
        )}

        {isSelect ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full py-3 px-4 rounded-lg bg-slate-800 text-white outline-none ${
              touched[name] && errors[name]
                ? "ring-2 ring-red-500"
                : "focus:ring-amber-400"
            }`}
          >
            <option value="">Select {label}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full py-3 ${
              prefix ? "pl-14 pr-4" : "px-4"
            } rounded-lg bg-slate-800 text-white outline-none ${
              touched[name] && errors[name]
                ? "ring-2 ring-red-500"
                : "focus:ring-amber-400"
            }`}
            {...props}
          />
        )}
      </div>

      {touched[name] && errors[name] && (
        <span className="text-red-400 text-xs">{errors[name]}</span>
      )}
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-white text-xl mb-6">Edit Profile</h1>

      <div className="flex justify-center mb-6">
        <img src={avatar} className="w-24 h-24 rounded-full" alt="avatar" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Full Name" name="fullName" />
          <InputField label="Mobile" name="mobileNumber" prefix="+91" />
          <InputField label="Email" name="email" />
          <InputField
            label="DOB"
            name="dateOfBirth"
            placeholder="DD/MM/YYYY"
          />
          <InputField
            label="Country"
            name="country"
            isSelect
            options={["India"]}
          />
          <InputField label="State" name="state" />
          <InputField label="City" name="city" />
        </div>

        <h2 className="text-white mt-6 mb-2">Bank Details</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Bank Name"
            name="bankName"
            isSelect
            options={["SBI", "HDFC", "ICICI", "AXIS"]}
          />
          <InputField
            label="Account Number"
            name="accountNumber"
            inputMode="numeric"
          />
          <InputField label="IFSC" name="ifsc" maxLength={11} />
          <InputField
            label="Account Type"
            name="accountType"
            isSelect
            options={["Savings", "Current", "Salary"]}
          />
        </div>

        <InputField label="Account Holder Name" name="accountHolderName" />

        <button
          type="submit"
          className="bg-amber-500 px-12 py-3 rounded-lg font-semibold text-white"
        >
          Save
        </button>
      </form>
    </div>
  );
}
