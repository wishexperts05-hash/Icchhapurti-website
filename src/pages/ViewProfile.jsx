import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, ChevronDown } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useTranslation } from "react-i18next";

export default function ViewProfile() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUsers] = useState();
  const { t } = useTranslation();

  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  );
  const [avatarFile, setAvatarFile] = useState(null);

  /* ---------------- FETCH USER ---------------- */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setPageLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/getProfile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setUsers(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ---------------- REACT HOOK FORM ---------------- */

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {},
  });

  // Reset form when user data comes
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

      if (user?.profileImage) {
        setAvatar(user.profileImage);
      }
    }
  }, [user, reset]);

  /* ---------------- LOCATION OPTIONS ---------------- */

  const country = watch("country");
  const state = watch("state");

  const countries = Country.getAllCountries();

  const selectedCountry = countries.find((c) => c.name === country);
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  const selectedState = states.find((s) => s.name === state);

  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  /* ---------------- HANDLERS ---------------- */

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();

    if (avatarFile) {
      formData.append("profileImage", avatarFile);
    }

    // personal
    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("dob", data.dob);
    formData.append("country", data.country);
    formData.append("state", data.state);
    formData.append("city", data.city);

    // bank
    formData.append("bankDetails[bankName]", data.bankName);
    formData.append("bankDetails[accountNumber]", data.accountNumber);
    formData.append("bankDetails[ifscCode]", data.ifscCode?.toUpperCase());
    formData.append("bankDetails[accountType]", data.accountType);
    formData.append(
      "bankDetails[accountHolderName]",
      data.accountHolderName.trim()
    );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/updateProfile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data));
        alert("Profile updated successfully!");
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REUSABLE INPUT ---------------- */

 const InputField = ({
  label,
  name,
  type = "text",
  isSelect,
  options,
  rules = {},
  required = true,
  ...rest
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-amber-400 text-sm font-medium">{label}</label>

    {isSelect ? (
      <div className="relative">
        <select
          {...register(name, {
            ...(required && { required: `${label} is required` }),
            ...rules,
          })}
          className="w-full bg-white text-gray-800 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">{label}</option>
          {options?.map((opt, i) => (
            <option key={i} value={opt.name || opt}>
              {opt.name || opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    ) : (
      <input
        type={type}
        {...register(name, {
          ...(required && { required: `${label} is required` }),
          ...rules,
        })}
        className="w-full bg-white text-gray-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        {...rest}
      />
    )}

    {errors[name] && (
      <small className="text-red-400 text-xs">
        {errors[name]?.message?.toString()}
      </small>
    )}
  </div>
);


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

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-white font-bold text-xl mb-6">
          {t("profile.title")}
        </h1>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={avatar}
              className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400"
            />
            <label className="absolute bottom-0 right-0 bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
              <Camera size={15} className="text-white" />
              <input type="file" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("profile.personal_info.full_name")}
              name="name"
              rules={{
                pattern: {
                  value: /^[A-Za-z\s]{2,}$/,
                  message: "Only letters & spaces (min 2 chars)",
                },
              }}
            />
            <InputField
              label={t("profile.personal_info.mobile_number")}
              name="phoneNumber"
              rules={{
                pattern: {
                  value: /^\d{10}$/,
                  message: "Mobile must be exactly 10 digits",
                },
              }}
            />
         <InputField
  label={t("profile.personal_info.email")}
  type="email"
  name="email"
  required={false}
  rules={{
    // only validate if value is non-empty
    validate: (value) =>
      !value ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      "Invalid email address",
  }}
/>

           <InputField
  label={t("profile.personal_info.dob")}
  name="dob"
  type="date"
  required={false}
/>


            <InputField
              label={t("profile.personal_info.country")}
              name="country"
              isSelect
              options={countries}
            />
            <InputField
              label={t("profile.personal_info.state")}
              name="state"
              isSelect
              options={states}
            />
            <InputField
              label={t("profile.personal_info.city")}
              name="city"
              isSelect
              options={cities}
            />
          </div>

          {/* Bank Details */}
          <h2 className="text-white font-semibold mt-6">
            {t("profile.bank_details.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("profile.bank_details.bank_name")}
              name="bankName"
            />
            <InputField
              label={t("profile.bank_details.account_number")}
              name="accountNumber"
              rules={{
                pattern: {
                  value: /^[0-9]{9,18}$/,
                  message: "Account number must be 9–18 digits",
                },
              }}
              inputMode="numeric"
            />
            <InputField
              label={t("profile.bank_details.ifsc")}
              name="ifscCode"
              rules={{
                setValueAs: (v) => v?.toUpperCase() || "",
                pattern: {
                  value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                  message: "Invalid IFSC (e.g. SBIN0001234)",
                },
                maxLength: {
                  value: 11,
                  message: "IFSC must be 11 characters",
                },
              }}
              maxLength={11}
            />
            <InputField
              label={t("profile.bank_details.account_type")}
              name="accountType"
              isSelect
              options={["Savings", "Current", "Salary"]}
            />
          </div>

          <InputField
            label={t("profile.bank_details.account_holder_name")}
            name="accountHolderName"
            rules={{
              pattern: {
                value: /^[A-Za-z\s]{2,}$/,
                message: "Only letters & spaces (min 2 chars)",
              },
            }}
          />

          <button
            className="w-full mt-4 bg-gradient-to-r cursor-pointer from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            {loading ? t("profile.buttons.saving") : t("profile.buttons.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
