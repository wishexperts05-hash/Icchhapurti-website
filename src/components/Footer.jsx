import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t('footer.links.home'), href: "/homePage" },
    { label: t('footer.links.aboutUs'), href: "/about-us" },
    { label: t('footer.links.products'), href: "/products" },
    { label: t('footer.links.blogs'), href: "/blogs" },
    { label: t('footer.links.privacyPolicy'), href: "/privacy" },
    { label: t('footer.links.termsConditions'), href: "/terms" },
    { label: "shipping Policy", href: "/shipping-policy" },
    { label: "refund cancellation Policy", href: "/refund-cancellation-policy" },
    { label: "Faq", href: "/faq" },
  ];

  const socialLinks = [
    { 
      image: '/twitter.png',
      label: 'X (Twitter)', 
      href: 'https://twitter.com' 
    },
    { 
      image: '/facebook.png',
      label: 'Facebook', 
      href: 'https://facebook.com' 
    },
    { 
      image: '/instagram.png',
      label: 'Instagram', 
      href: 'https://www.instagram.com/icchhapurtiofficial?igsh=ZHE1anhrdWgwNzFp&utm_source=qr' 
    },
    { 
      image: '/linkdin.png',
      label: 'LinkedIn', 
      href: 'https://linkedin.com' 
    },
    { 
      image: '/youtube.png',
      label: 'YouTube', 
      href: 'https://youtube.com' 
    },
  ];

  return (
    <footer className="relative text-white overflow-hidden bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
">

      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/footer1-bg.jpg')",
        }}
      >

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(6, 14, 28, 0.75) 0%, rgba(14, 30, 50, 0.75) 50%, rgba(8, 20, 36, 0.75) 100%)",
          }}
        />
      </div> */}

      {/* Decorative gradient shapes */}
      {/* <div
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
      /> */}

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

            <p className="text-md leading-relaxed text-gray-300 mb-6">
              {t('footer.description')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/50 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)",
                  }}
                >
                  <img 
                    src={social.image} 
                    alt={social.label}
                    className="w-6 h-6 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* MIDDLE SECTION - Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]"></span> {t('footer.quickLinks')}
            </h3>

            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-md text-gray-300 hover:text-[#C9A227] transition-all group"
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
              <span className="w-8 h-0.5 bg-[#C9A227]"></span> {t('footer.downloadApp')}
            </h3>
            <p className="text-md text-gray-300 mb-4">
              {t('footer.downloadAppDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg flex-1"
              >
                <div className="text-2xl">
                  <img src="/appStore.png" alt={t('footer.appStore')} />
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-105 hover:shadow-lg flex-1"
              >
                <div className="text-xl">
                  <img src="/googlePay.png" alt={t('footer.googlePlay')} />
                </div>
              </a>
            </div>

            {/* CONTACT INFO - Moved below Download App */}
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]"></span> {t('footer.contactInfo')}
            </h3>

            <div className="space-y-2">
              {/* Phone */}
              {/* <a href="tel:+919876543210" className="flex items-center gap-3 group">
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
                  <p className="text-xs text-gray-400">{t('footer.phone')}</p>
                  <p className="text-sm text-white group-hover:text-yellow-400 transition-colors">
                    +91 9876543210
                  </p>
                </div>
              </a> */}

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
                  <p className="text-xs text-gray-400">{t('footer.email')}</p>
                  <p className="text-sm text-white group-hover:text-yellow-400 transition-colors">
                  Official@icchhapurti.com
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <p>
            {t('footer.copyright')}{" "}
            <span className="text-[#C9A227] font-semibold">{t('footer.companyName')}</span>{" "}
            {t('footer.allRightsReserved')}
          </p>
          <p>
            {t('footer.designedBy')}{" "}
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