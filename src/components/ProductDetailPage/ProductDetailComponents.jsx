import { memo } from 'react';
import { AlertCircle, ChevronDown, Copy, X } from 'lucide-react';
import { BsFacebook, BsInstagram, BsWhatsapp } from 'react-icons/bs';
import { PiPinterestLogo } from 'react-icons/pi';
import { GOLD, GOLD_PALE, GOLD_LIGHT, BORDER, MUTED, INK, DEEP, CREAM, RED } from './constants';

export const GoldDivider = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: '40px 0' }} />
);

export const Badge = ({ children, variant = 'gold' }) => {
  const styles = variant === 'gold'
    ? { background: GOLD_PALE, color: '#7A5C00', border: `1px solid ${GOLD}` }
    : { background: '#EDF7F1', color: '#1A5C2E', border: '1px solid #5DB07A' };
  return (
    <span style={{
      ...styles, fontSize: 11, fontWeight: 500, letterSpacing: '.05em',
      padding: '4px 10px', borderRadius: 20, display: 'inline-block'
    }}>
      {children}
    </span>
  );
};

export const TrustItem = ({ icon, label }) => (
  <div style={{
    background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '10px 8px', textAlign: 'center', fontSize: 11, color: MUTED, fontWeight: 500
  }}>
    <span style={{ fontSize: 18, color: GOLD, display: 'block', marginBottom: 4 }}>{icon}</span>
    {label}
  </div>
);

export const CheckItem = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, fontSize: 13, color: INK, padding: '5px 0', borderBottom: `1px solid ${BORDER}`, alignItems: 'flex-start' }}>
    <span style={{ color: GOLD, fontSize: 16, flexShrink: 0, lineHeight: 1.4 }}>✦</span>
    <span>{children}</span>
  </div>
);

export const ChakraCard = ({ label, color, attrs }) => (
  <div style={{
    background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: '14px 8px', textAlign: 'center'
  }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: color, margin: '0 auto 8px' }} />
    <h4 style={{ fontSize: 11, fontWeight: 500, color: DEEP, marginBottom: 3 }}>{label}</h4>
    <p style={{ fontSize: 10, color: MUTED, lineHeight: 1.4 }}>{attrs}</p>
  </div>
);

export const HowCard = ({ num, title, body }) => (
  <div style={{
    background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12,
    padding: '24px 16px', textAlign: 'center'
  }}>
    <div style={{
      width: 36, height: 36, background: DEEP, color: GOLD_LIGHT, borderRadius: '50%',
      fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
    }}>{num}</div>
    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: DEEP, marginBottom: 6 }}>{title}</h3>
    <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{body}</p>
  </div>
);

export const StarDisplay = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: GOLD, fontSize: 16, letterSpacing: 2 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

export const LoadingState = () => (
  <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, border: `4px solid ${BORDER}`, borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ color: INK, fontFamily: "'DM Sans', sans-serif" }}>Loading product details…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

export const ErrorState = ({ error, onRetry, onBack }) => (
  <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, maxWidth: 400, textAlign: 'center' }}>
      <AlertCircle size={40} color={RED} style={{ marginBottom: 16 }} />
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: DEEP, marginBottom: 8 }}>Something went wrong</h3>
      <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>{error}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={onRetry} style={{ background: GOLD, color: DEEP, border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}>Try Again</button>
        <button onClick={onBack} style={{ background: '#f5f5f5', color: INK, border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}>Go Back</button>
      </div>
    </div>
  </div>
);

export const ProductDetailsAccordion = memo(({ productDetails, openFAQ, toggleFAQ }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {productDetails?.map((faq, index) => {
      const faqId = faq._id || index;
      const isOpen = openFAQ === faqId;
      return (
        <div key={faqId} style={{
          background: '#fff', borderRadius: 10, overflow: 'hidden',
          border: `1px solid ${isOpen ? 'rgba(42,82,190,0.4)' : BORDER}`,
          boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
          transition: 'border-color .2s'
        }}>
          <button
            onClick={() => toggleFAQ(faqId)}
            style={{
              width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center',
              gap: 10, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer'
            }}
          >
            {faq?.thumbnail && (
              <img src={faq.thumbnail} alt="thumbnail" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: `1px solid ${BORDER}`, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: DEEP, lineHeight: 1.4 }}
                dangerouslySetInnerHTML={{ __html: faq.title }} />
            </div>
            <div style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6, background: isOpen ? '#3B5BDB' : '#9CA3AF',
              transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'all .25s', flexShrink: 0
            }}>
              <ChevronDown size={14} color="#fff" />
            </div>
          </button>
          <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows .2s ease' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0 14px 12px' }}>
                <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 12, fontSize: 13, color: INK }}
                  dangerouslySetInnerHTML={{ __html: faq.detail }} />
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
));

export const ShareModal = ({ shareUrl, shareTitle, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
    <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 24, position: 'relative' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: MUTED }}>
        <X size={18} />
      </button>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: DEEP, textAlign: 'center', marginBottom: 16 }}>Share this product</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input readOnly value={shareUrl} style={{ flex: 1, padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: MUTED }} />
        <button onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!'); }}
          style={{ padding: '8px 12px', background: GOLD, color: DEEP, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          <Copy size={15} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, textAlign: 'center' }}>
        {[
          { href: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, icon: <BsWhatsapp size={20} />, label: 'WhatsApp', color: '#25D366' },
          { href: 'https://www.instagram.com/', icon: <BsInstagram size={20} />, label: 'Instagram', color: '#E1306C' },
          { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, icon: <BsFacebook size={20} />, label: 'Facebook', color: '#1877F2' },
          { href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}`, icon: <PiPinterestLogo size={20} />, label: 'Pinterest', color: '#E60023' },
        ].map(({ href, icon, label, color }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color, textDecoration: 'none', fontSize: 11, fontWeight: 500 }}>
            {icon}{label}
          </a>
        ))}
      </div>
    </div>
  </div>
);
