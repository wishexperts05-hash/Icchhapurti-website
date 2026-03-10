import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/";

  const quickLinks = [
    { label: t('footer.links.home'), href: "/" },
    { label: t('footer.links.aboutUs'), href: "/about-us" },
    { label: t('footer.links.products'), href: "/products" },
    { label: t('footer.links.blogs'), href: "/blogs" },
    { label: t('footer.links.privacyPolicy'), href: "/privacy" },
    { label: t('footer.links.termsConditions'), href: "/terms" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Refund & Cancellation Policy", href: "/refund-cancellation-policy" },
    // { label: "FAQ", href: "/faq" },
  ];

  const socialLinks = [
    { image: '/twitter.png', label: 'X (Twitter)', href: 'https://twitter.com' },
    { image: '/facebook.png', label: 'Facebook', href: 'https://www.facebook.com/icchhapurtiofficial' },
    { image: '/instagram.png', label: 'Instagram', href: 'https://www.instagram.com/icchhapurtiofficial' },
    // { image: '/linkdin.png', label: 'LinkedIn', href: 'https://linkedin.com' },
    { image: '/youtube.png', label: 'YouTube', href: 'https://www.youtube.com/@IcchhapurtiOfficial-w1d' },
  ];

  return (
    <footer className="relative overflow-hidden  text-white">

      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      {/* 
    {isHomePage && (
  <div className="absolute top-0 left-0 w-full pointer-events-none">
    <img
      src="/shape.png"
      alt=""
      className="w-full block"
    />
  </div>
)} */}


      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT */}
          <div className="md:col-span-4">
            <img src="/logo-white.png" alt="IcchhaPurti" loading="lazy" className="h-28 mb-6" />

            <p className="text-gray-300 mb-6">
              {t('footer.description')}
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition"
                  style={{
                    background: "linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)",
                  }}
                >
                  <img src={social.image} alt={social.label} loading="lazy" className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* MIDDLE */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]" /> {t('footer.quickLinks')}
            </h3>

            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-[#C9A227] transition group"
                  >
                    <ChevronRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 text-[#C9A227]"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-5">
            {/* <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]" /> {t('footer.downloadApp')}
            </h3> */}

            {/* <p className="text-gray-300 mb-4">
              {t('footer.downloadAppDesc')}
            </p> */}

            {/* <div className="flex gap-3 mb-8">
              <img src="/appStore.png" alt="App Store" loading="lazy" className="h-12" />
              <img src="/googlePay.png" alt="Google Play" loading="lazy" className="h-12" />
            </div> */}

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#C9A227]" /> {t('footer.contactInfo')}
            </h3>

            <a href="mailto:official@icchhapurti.com" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C9A227]/20">
                <Mail size={18} className="text-[#C9A227]" />
              </div>
              <span>Official@icchhapurti.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#C9A227] font-semibold">
              {t('footer.companyName')}
            </span>{" "}
            {t('footer.allRightsReserved')}
          </p>

          <p>
            Designed by{" "}
            <span className="text-[#C9A227]">Talentrise Technokrate Pvt. Ltd.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
