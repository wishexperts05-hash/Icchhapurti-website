import React, { useState } from 'react';
import { User, Mail, Phone, ChevronDown } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    if (!formData.agreed) {
      alert('Please accept our Terms of Service and Privacy Policy');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
 py-12 px-4 sm:px-6 lg:px-8">
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
                className="w-full px-4 py-4 pr-12 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 pr-12 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                className="w-full px-4 py-4 pr-12 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent"
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Subject */}
            <div className="relative">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-4 pr-12 bg-white border border-gray-300 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent"
              >
                <option value="">Subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Customer Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
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
              className="w-full px-4 py-4 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B7E6A] focus:border-transparent"
            ></textarea>
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
            <label htmlFor="agreed" className="text-sm text-white">
              By accepting you agree to our Terms of Service and Privacy Policy.
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              className="px-16 py-3 bg-black text-white font-semibold tracking-wider hover:bg-gray-800 transition-colors"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;