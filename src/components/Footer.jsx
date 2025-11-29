import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/homePage" },
    { label: "About Us", href: "/about-us" },
    { label: "Products", href: "/products" },
    { label: "Blogs", href: "/blogs" },
    // { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/footer1-bg.jpg')",
        }}
      >
        {/* Dark gradient overlay for better readability */}
      <div
  className="absolute inset-0 pointer-events-none"
  style={{
    background:
      "linear-gradient(135deg, rgba(10, 22, 40, 0.35) 0%, rgba(26, 58, 92, 0.35) 50%, rgba(13, 42, 74, 0.35) 100%)",
  }}
/>

      </div>

      {/* Decorative gradient shapes */}
      <div
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #C9A227 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #C9A227 0%, transparent 70%)",
          transform: "translate(30%, 30%)",
        }}
      />

      {/* Content Wrapper */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT SECTION - Logo & Description */}
          <div className="md:col-span-4">
            <div className="mb-6">
              <img
                src="/logo-white.png"
                alt="IcchhaPurti"
                className="h-30 w-auto object-contain"
              />
            </div>

            <p className="text-sm leading-relaxed text-gray-300 mb-6">
              Your one-stop destination for quality products. We are committed to delivering excellence and fulfilling every wish with our trusted service and premium selection.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {["𝕏", "f", "📷", "in"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)",
                  }}
                >
                  <span className="text-white text-sm font-bold">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* MIDDLE SECTION - Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]"></span> QUICK LINKS
            </h3>

            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#C9A227] transition-all group"
                  >
                    <ChevronRight
                      size={16}
                      className="text-[#C9A227] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all"
                    />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT TOP SECTION - Download App */}
          <div className="md:col-span-5">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]"></span> DOWNLOAD APP
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Get the best experience on our mobile app. Download now!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg flex-1"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                  border: "1px solid #444",
                }}
              >
                <div className="text-3xl">🍎</div>
                <div>
                  <p className="text-xs text-gray-400">Download on the</p>
                  <p className="text-base font-semibold">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg flex-1"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                  border: "1px solid #444",
                }}
              >
                <div className="text-3xl">▶️</div>
                <div>
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="text-base font-semibold">Google Play</p>
                </div>
              </a>
            </div>

            {/* CONTACT INFO - Moved below Download App */}
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]"></span> CONTACT INFO
            </h3>

            <div className="space-y-4">
              {/* Phone */}
              <a href="tel:+919876543210" className="flex items-center gap-3 group">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: "rgba(201, 162, 39, 0.15)",
                    border: "1px solid rgba(201, 162, 39, 0.3)",
                  }}
                >
                  <Phone size={18} className="text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm text-white group-hover:text-yellow-400 transition-colors">
                    +91 9876543210
                  </p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:example@icchhapurti.com" className="flex items-center gap-3 group">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: "rgba(201, 162, 39, 0.15)",
                    border: "1px solid rgba(201, 162, 39, 0.3)",
                  }}
                >
                  <Mail size={18} className="text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-white group-hover:text-yellow-400 transition-colors">
                    example@icchhapurti.com
                  </p>
                </div>
              </a>

              {/* Address */}
              {/* <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(201, 162, 39, 0.15)",
                    border: "1px solid rgba(201, 162, 39, 0.3)",
                  }}
                >
                  <MapPin size={18} className="text-[#C9A227]" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm text-gray-200">
                    4517 Washington Ave. Manchester, Kentucky 39495
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <p>
            Copyright © 2025{" "}
            <span className="text-[#C9A227] font-semibold">ICCHHA PURTI</span> All Rights Reserved
          </p>
          <p>
            Designed by{" "}
            <a href="#" className="text-[#C9A227] hover:text-yellow-400 transition-colors font-medium">
              Talentrise Technokrate Pvt. Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;