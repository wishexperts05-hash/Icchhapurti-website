import React, { useState } from 'react';
import { User, Mail, Phone, ChevronDown } from 'lucide-react';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreed: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-().]/g, ''));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const { fullName, email, phone, subject, message, agreed } = formData;
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number (10 digits).';
    }

    if (!subject) {
      newErrors.subject = 'Please select a subject.';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    if (!agreed) {
      newErrors.agreed = 'Please accept our Terms of Service and Privacy Policy.';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { fullName, email, phone, subject, message } = formData;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/contactRoutes/create`,
        { fullName, email, phone, subject, message },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Message sent successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        agreed: false,
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-center text-white mb-12 tracking-wide">
          PLEASE DO NOT HESITATE TO<br />SEND US A MESSAGE
        </h1>

        {/* Form */}
        <div className="space-y-6">
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-4 pr-12 bg-white border text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-4 pr-12 bg-white border text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-4 pr-12 bg-white border text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Subject */}
            <div className="relative">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-4 pr-12 bg-white border text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Customer Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              {errors.subject && (
                <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
              )}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              rows="8"
              className={`w-full px-4 py-4 bg-white border text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreed"
              id="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-[#8B7E6A]"
            />
            <div>
              <label htmlFor="agreed" className="text-sm text-white">
                By accepting you agree to our Terms of Service and Privacy Policy.
              </label>
              {errors.agreed && (
                <p className="text-red-400 text-xs mt-1">{errors.agreed}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-16 py-3 bg-[#D3AF37] text-white font-semibold tracking-wider hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "SENDING..." : "SUBMIT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;