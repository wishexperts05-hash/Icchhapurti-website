import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, MapPin, ChevronDown } from "lucide-react";
import { Country, State, City } from "country-state-city";

export default function ViewProfile() {
  // const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState()
  // Convert DD-MM-YYYY to YYYY-MM-DD
  const formatDOB = (dob) => {
    if (!dob) return "";
    const [day, month, year] = dob.split("-");
    return `${year}-${month}-${day}`;
  };


  const [user, setUsers] = useState()

  const [avatar, setAvatar] = useState(
    user?.profileImage ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  );
  const [avatarFile, setAvatarFile] = useState(null);

  //   const [countries, setCountries] = useState([]);
  //   const [states, setStates] = useState([]);
  //   const [cities, setCities] = useState([]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const user = JSON.parse(localStorage.getItem("user"));
        // if (!user?._id) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getProfile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data,"adata")

        if (data.success) {
          // Save user details in a state if needed
          // console.log("Fetched User:", data.user);
          setUsers(data.data)
          localStorage.setItem("user" , JSON.stringify(data.data))
          // setUserData(data.user);  // <-- Uncomment if you have state
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);


 const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
  defaultValues: {}
});

// Reset form values when user data updates
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

    // Update Avatar
    setAvatar(user?.profileImage);
  }
}, [user, reset]);
  // Watch fields
  const country = watch("country");
  const state = watch("state");

  //   // Load country list on mount
  //   useEffect(() => {
  //     setCountries(Country.getAllCountries());
  //   }, []);

  //   // Update states when country changes
  //   useEffect(() => {
  //     if (selectedCountry) {
  //       const countryObj = countries.find(c => c.name === selectedCountry);
  //       setStates(State.getStatesOfCountry(countryObj?.isoCode));
  //     }
  //   }, [selectedCountry]);

  //   // Update city list when state changes
  //   useEffect(() => {
  //     if (selectedState) {
  //       const countryObj = countries.find(c => c.name === selectedCountry);
  //       const stateObj = states.find(s => s.name === selectedState);
  //       setCities(City.getCitiesOfState(countryObj?.isoCode, stateObj?.isoCode));
  //     }
  //   }, [selectedState]);


  const countries = Country.getAllCountries();

  // Find ISO code from country name
  const selectedCountry = Country.getAllCountries().find(
    c => c.name === country
  )
  // Get states by country ISO
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  console.log(states);

  // Find state iso by name
  const selectedState = states.find(s => s.name === state);

  // Get cities by state ISO
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  console.log(cities);




  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  // Submit Function with API call
  const onSubmit = async (data) => {
    setLoading(true)
const formData = new FormData();

// Append profile image if updated
if (avatarFile) {
  formData.append("profileImage", avatarFile);
}

// Add personal details
formData.append("name", data.name);
formData.append("email", data.email);
formData.append("phoneNumber", data.phoneNumber);
formData.append("dob", data.dob);
formData.append("country", data.country);
formData.append("state", data.state);
formData.append("city", data.city);

// Add bank details under nested object
formData.append("bankDetails[bankName]", data.bankName);
formData.append("bankDetails[accountNumber]", data.accountNumber);
formData.append("bankDetails[ifscCode]", data.ifscCode);
formData.append("bankDetails[accountType]", data.accountType);
formData.append("bankDetails[accountHolderName]", data.accountHolderName);


    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/updateProfile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setLoading(false)
        localStorage.setItem("user", JSON.stringify(result.data));
        alert("Profile updated successfully!");
        // window.location.reload();
      } else {
        alert(result.message || "Update failed");
        setLoading(false)
      }
    } catch (error) {
      console.error("Update failed:", error);
      setLoading(false)
    }
  };

  // Reusable Input Component
  const InputField = ({ label, name, type = "text", isSelect, options }) => (
    <div className="flex flex-col gap-1">
      <label className="text-amber-400 text-sm font-medium">{label}</label>

      {isSelect ? (
        <div className="relative">
          <select
            {...register(name, { required: `${label} is required` })}
            className="w-full bg-white text-gray-800 rounded-lg py-3 px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">{label}</option>
            {options?.map((opt, i) => (
              <option key={i} value={opt.name || opt}>{opt.name || opt}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      ) : (
        <input
          type={type}
          {...register(name, { required: `${label} is required` })}
          className="w-full bg-white text-gray-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      )}

      {errors[name] && <small className="text-red-400 text-xs">{errors[name].message}</small>}
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-white font-bold text-xl mb-6">Update Profile</h1>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img src={avatar} className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400" />
            <label className="absolute bottom-0 right-0 bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
              <Camera size={15} className="text-white" />
              <input type="file" className="hidden" onChange={onAvatarChange} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name" name="name" />
            <InputField label="Mobile Number" name="phoneNumber" />
            <InputField label="Email" type="email" name="email" />
            <InputField label="Date Of Birth" name="dob" type="date" />

            <InputField label="Country" name="country" isSelect options={countries} />
            <InputField label="State" name="state" isSelect options={states} />
            <InputField label="City" name="city" isSelect options={cities} />
          </div>

          {/* Bank Details */}
          <h2 className="text-white font-semibold mt-6">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Bank Name" name="bankName" />
            <InputField label="Account Number" name="accountNumber" />
            <InputField label="IFSC" name="ifscCode" />
            <InputField label="Account Type" name="accountType" isSelect options={["Savings", "Current", "Salary"]} />
          </div>

          <InputField label="Account Holder Name" name="accountHolderName" />

          <button
            className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            {
              loading ? "saving..." : "Save Changes"
            }

          </button>
        </form>
      </div>
    </div>
  );
}
