import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, ChevronDown } from 'lucide-react';

export default function EditProfile() {
  const [avatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: 'Tony Stark',
      email: 'example@mail.com',
      country: 'India',
      city: 'Nagpur',
      mobileNumber: '9876543210',
      dateOfBirth: '10/01/2002',
      state: 'West Bengal',
      bankName: 'State Bank Of India',
      accountNumber: '654971879431',
      ifsc: 'SBIN0001234',
      accountType: 'Savings',
      accountHolderName: 'Tony Stark',
    }
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Profile updated successfully!');
  };

  const InputField = ({ label, name, type = 'text', placeholder, validation, isSelect, options, prefix }) => (
    <div className="flex flex-col gap-1">
      <label className="text-amber-400 text-sm font-medium">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm border-r border-gray-600 pr-2">
            {prefix}
          </span>
        )}
        {isSelect ? (
          <div className="relative">
            <select
              {...register(name, validation)}
              className="w-full bg-white text-gray-800 rounded-lg py-3 px-4 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
            className={`w-full bg-white text-gray-800 rounded-lg py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${prefix ? 'pl-16 pr-4' : 'px-4'}`}
          />
        )}
      </div>
      {errors[name] && (
        <span className="text-red-400 text-xs">{errors[name].message}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-cyan-500/5 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-500/10 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-amber-500/15 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full filter blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-4 pb-8">
        {/* Header */}
        <h1 className="text-white font-bold text-xl mb-6">Edit Profile</h1>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-400 p-0.5">
              <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Personal Info - Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="Enter full name"
              validation={{ required: 'Full name is required', minLength: { value: 2, message: 'Min 2 characters' } }}
            />
            <InputField
              label="Mobile Number"
              name="mobileNumber"
              prefix="+91"
              placeholder="Enter mobile number"
              validation={{ required: 'Mobile number is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' } }}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              validation={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter valid email' } }}
            />
            <InputField
              label="Date Of Birth"
              name="dateOfBirth"
              placeholder="DD/MM/YYYY"
              validation={{ required: 'Date of birth is required', pattern: { value: /^\d{2}\/\d{2}\/\d{4}$/, message: 'Use DD/MM/YYYY format' } }}
            />
            <InputField
              label="Country"
              name="country"
              isSelect
              options={['India', 'USA', 'UK', 'Canada', 'Australia']}
              validation={{ required: 'Country is required' }}
            />
            <InputField
              label="State"
              name="state"
              placeholder="Enter state"
              validation={{ required: 'State is required' }}
            />
          </div>

          {/* City with Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                label="City"
                name="city"
                placeholder="Enter city"
                validation={{ required: 'City is required' }}
              />
              <button type="button" className="flex items-center gap-1 text-green-400 text-sm mt-2 hover:text-green-300 transition-colors">
                <MapPin size={14} />
                Use Current Location
              </button>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="pt-4">
            <h2 className="text-white font-semibold mb-4">Bank Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Bank Name"
                name="bankName"
                isSelect
                options={['State Bank Of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank']}
                validation={{ required: 'Bank name is required' }}
              />
              <InputField
                label="Account Number"
                name="accountNumber"
                placeholder="Enter account number"
                validation={{ required: 'Account number is required', pattern: { value: /^[0-9]{9,18}$/, message: 'Enter valid account number' } }}
              />
              <InputField
                label="IFSC"
                name="ifsc"
                placeholder="Enter IFSC code"
                validation={{ required: 'IFSC is required', pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Enter valid IFSC code' } }}
              />
              <InputField
                label="Account Type"
                name="accountType"
                isSelect
                options={['Savings', 'Current', 'Salary']}
                validation={{ required: 'Account type is required' }}
              />
            </div>
            <div className="mt-4">
              <InputField
                label="Account Holder Name"
                name="accountHolderName"
                placeholder="Enter account holder name"
                validation={{ required: 'Account holder name is required' }}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-16 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}