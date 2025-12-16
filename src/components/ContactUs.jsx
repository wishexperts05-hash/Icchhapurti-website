import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
} from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {/* HERO SECTION */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>

        <div className="relative w-full max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Us
            </span>
          </h1>
          <p className="text-gray-300 max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg">
            Have questions? Send us a message and we will get in touch soon.
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-20 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CONTACT DETAILS */}
          <div className="space-y-6 order-2 lg:order-1">

            {/* INFO CARD */}
            <div className="bg-white/10 p-6 sm:p-8 rounded-3xl border border-white/20 backdrop-blur-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>

              <div className="space-y-6">

                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Phone className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Call Us</p>
                    <p className="text-white font-semibold">+91 98765 43210</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Mail className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email Us</p>
                    <p className="text-white font-semibold">Official@icchhapurti.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <MapPin className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Visit Us</p>
                    <p className="text-white font-semibold">Indore, Madhya Pradesh</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4 items-start">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Clock className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Working Hours</p>
                    <p className="text-white font-semibold">Mon - Sat: 9AM - 6PM</p>
                  </div>
                </div>

              </div>
            </div>

            {/* WHATSAPP QUICK CHAT */}

          </div>


          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl">
            <MessageCircle className="w-12 h-12 text-white mb-4" />
            <h3 className="text-2xl text-white font-bold mb-3">Quick Support</h3>
            <p className="text-purple-100 mb-6">
              Need help quickly? Chat with us now.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              className="bg-white text-purple-700 px-6 py-3 w-60 rounded-full font-bold hover:bg-purple-50 transition flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* CONTACT FORM */}
          {/* <div className="lg:col-span-2 order-1 lg:order-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/20 shadow-xl w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Send Us a Message
              </h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white"
                  value={formData.email}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Your Phone"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white mt-5"
                value={formData.message}
                onChange={handleChange}
              ></textarea>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-full text-white font-semibold hover:scale-105 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <Send size={18} />
                  {isSubmitted ? "Message Sent ✔" : "Send Message"}
                </div>
              </button>
            </form>
          </div> */}
        </div>
      </div>

      {/* FULL-WIDTH GOOGLE MAP */}
      <div className="w-full px-4 pb-20">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-white/10">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114194.52989659032!2d75.77203270000002!3d22.723911449999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39631d8ba98e9af9%3A0x1d1c15a69f8f2990!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
          ></iframe>
        </div>
      </div>

      {/* WHATSAPP STICKY */}
      {/* <a
        href="https://wa.me/919876543210"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-4 rounded-full flex items-center gap-3 shadow-2xl hover:bg-green-700 transition z-50"
      >
        <MessageCircle className="w-6 h-6" />
        WhatsApp
      </a> */}
    </div>
  );
}
