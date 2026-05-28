import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Download, Share2, Sparkles } from 'lucide-react';
import axios from 'axios';

/* ─── Design Tokens ─── */
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#F0D080';
const GOLD_PALE = '#FDF6E3';
const DEEP = '#1A1209';
const INK = '#2C2416';
const MUTED = '#7A6F60';
const CREAM = '#FAF6EE';
const GREEN = '#27623A';
const BORDER = 'rgba(201,168,76,0.25)';

/* ─── Confetti particle ─── */
const COLORS = ['#C9A84C', '#F0D080', '#27623A', '#2C2416', '#FDF6E3', '#E8C97A'];

function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      opacity: 1,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        if (frame > 120) p.opacity -= 0.008;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 280) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}
    />
  );
}

/* ─── Step indicator ─── */
function Step({ icon: Icon, label, done, active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: done ? GOLD : active ? GOLD_PALE : '#F3EDE3',
        border: `2px solid ${done ? GOLD : active ? GOLD : BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .4s',
        boxShadow: done ? `0 0 0 6px rgba(201,168,76,0.15)` : 'none',
      }}>
        <Icon size={20} color={done ? '#fff' : active ? GOLD : MUTED} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: done ? DEEP : MUTED, textAlign: 'center', letterSpacing: '.03em' }}>
        {label}
      </span>
    </div>
  );
}

function StepConnector({ done }) {
  return (
    <div style={{ flex: 1, height: 2, background: BORDER, borderRadius: 2, position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 2,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        width: done ? '100%' : '0%', transition: 'width .8s ease',
      }} />
    </div>
  );
}

/* ─── Main Component ─── */
export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [visible, setVisible] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [countdown, setCountdown] = useState(15);

  // Data passed via navigate state or sessionStorage
  const orderNumber = location.state?.orderNumber || sessionStorage.getItem('orderNumber') || 'ORD-XXXXXXXX';
  const pinCode = location.state?.pinCode || '';
  const deliveryAddress = location.state?.address || '';
  const paymentMethod = location.state?.paymentMethod || 'Online';
  const grandTotal = location.state?.grandTotal || '';

  useEffect(() => {
    // Entrance animation
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowConfetti(true), 400);

    // Fetch EDD
    if (pinCode) {
      axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/shipping/edd?pincode=${pinCode}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      ).then(res => {
        if (res.data.success) setEstimatedDelivery(res.data);
      }).catch(() => { });
    }

    // Countdown to orders
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup sessionStorage
    sessionStorage.removeItem('orderNumber');

    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'I just ordered from Icchhapurti!', text: 'Manifest your desires with the Seven Chakra Pen 🌟', url: window.location.origin });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${CREAM}; font-family: 'DM Sans', sans-serif; }

        .ty-fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .ty-fade-up.visible { opacity: 1; transform: translateY(0); }

        .ty-card {
          background: #fff;
          border: 1px solid ${BORDER};
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 24px rgba(26,18,9,0.06);
        }

        .ty-btn-primary {
          background: ${GOLD};
          color: ${DEEP};
          border: none;
          border-radius: 10px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: .03em;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background .2s, transform .15s;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          justify-content: center;
        }
        .ty-btn-primary:hover { background: #b8952e; transform: translateY(-1px); }

        .ty-btn-ghost {
          background: transparent;
          color: ${MUTED};
          border: 1.5px solid ${BORDER};
          border-radius: 10px;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: border-color .2s, color .2s;
          font-family: 'DM Sans', sans-serif;
          justify-content: center;
        }
        .ty-btn-ghost:hover { border-color: ${GOLD}; color: ${GOLD}; }

        .ty-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EDF7F1;
          color: ${GREEN};
          border: 1px solid rgba(39,98,58,0.25);
          border-radius: 99px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .04em;
        }

        .ty-pulse {
          animation: ty-pulse 2s ease-in-out infinite;
        }
        @keyframes ty-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(201,168,76,0); }
        }

        .ty-shimmer {
          background: linear-gradient(90deg, ${GOLD_PALE} 25%, #fff 50%, ${GOLD_PALE} 75%);
          background-size: 200% 100%;
          animation: ty-shimmer 1.8s infinite;
          border-radius: 8px;
        }
        @keyframes ty-shimmer { to { background-position: -200% 0; } }

        @media(max-width: 600px) {
          .ty-actions { flex-direction: column !important; }
          .ty-hero-icon { width: 80px !important; height: 80px !important; }
          .ty-hero-icon svg { width: 36px !important; height: 36px !important; }
          .ty-meta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Confetti active={showConfetti} />

      {/* Announcement bar */}
      <div style={{ background: DEEP, color: GOLD_LIGHT, textAlign: 'center', fontSize: 12, padding: '9px 16px', letterSpacing: '.06em', fontWeight: 500 }}>
        🌟 Thank you for choosing Icchhapurti — Your manifestation journey begins now
      </div>

      {/* Page */}
      <div style={{ minHeight: '100vh', background: CREAM, paddingBottom: 60 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px' }}>

          {/* Hero card */}
          <div className={`ty-fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0s' }}>
            <div style={{
              background: DEEP, borderRadius: 20, padding: '40px 32px', textAlign: 'center',
              marginBottom: 24, position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative circles */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,168,76,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,168,76,0.06)' }} />

              {/* Checkmark icon */}
              <div className="ty-hero-icon ty-pulse" style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))',
                border: `2px solid rgba(201,168,76,0.4)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <CheckCircle size={44} color={GOLD} strokeWidth={1.5} />
              </div>

              <div className="ty-badge" style={{ marginBottom: 14, background: 'rgba(39,98,58,0.15)', color: '#6EBB8A', border: '1px solid rgba(39,98,58,0.3)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6EBB8A', flexShrink: 0, animation: 'ty-pulse 1.5s infinite', display: 'inline-block' }} />
                Payment Confirmed
              </div>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600,
                color: GOLD_LIGHT, lineHeight: 1.2, marginBottom: 8,
              }}>
                Order Placed!
              </h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
                Your manifestation Tool is on its way to you ✨
              </p>

              {orderNumber && orderNumber !== 'ORD-XXXXXXXX' && (
                <div style={{
                  background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: 10, padding: '10px 20px', display: 'inline-block',
                }}>
                  <span style={{ fontSize: 12, color: GOLD, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 500 }}>Order ID</span>
                  <div style={{ fontSize: 16, fontWeight: 600, color: GOLD_LIGHT, marginTop: 2, letterSpacing: '.04em' }}>
                    #{orderNumber}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step tracker */}
          <div className={`ty-card ty-fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '.1s', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 20 }}>Order Progress</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <Step icon={CheckCircle} label="Order Placed" done={true} />
              <StepConnector done={true} />
              <Step icon={Package} label="Being Packed" active={true} />
              <StepConnector done={false} />
              <Step icon={Truck} label="Shipped" />
              <StepConnector done={false} />
              <Step icon={MapPin} label="Delivered" />
            </div>
          </div>

          {/* Delivery estimate */}
          <div className={`ty-card ty-fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '.2s', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: GOLD_PALE, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={16} color={GOLD} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: MUTED, letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: 500 }}>Estimated Delivery</p>
                {estimatedDelivery ? (
                  <p style={{ fontSize: 17, fontWeight: 600, color: DEEP, fontFamily: "'Cormorant Garamond', serif" }}>
                    {estimatedDelivery.deliveryDate}
                  </p>
                ) : (
                  <div className="ty-shimmer" style={{ height: 20, width: 160, marginTop: 4 }} />
                )}
              </div>
            </div>
            {estimatedDelivery?.message && (
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{estimatedDelivery.message}</p>
            )}
            {deliveryAddress && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={14} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{deliveryAddress}</p>
              </div>
            )}
          </div>

          {/* Order meta */}
          <div className={`ty-card ty-fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '.3s', marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: GOLD, marginBottom: 14 }}>Order Summary</p>
            <div className="ty-meta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Payment Method', value: paymentMethod === 'razorpay' ? 'Online (Card / UPI)' : paymentMethod === 'wallet' ? 'Wallet' : paymentMethod },
                { label: 'Amount Paid', value: grandTotal ? `${grandTotal}` : '—' },
                { label: 'Confirmation', value: 'Email & SMS Sent' },
                { label: 'Support', value: 'support@icchhapurti.com' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: CREAM, borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: DEEP }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's next */}
          <div className={`ty-card ty-fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '.38s', marginBottom: 20, background: GOLD_PALE, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles size={16} color={GOLD} />
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: GOLD }}>What's Next</p>
            </div>
            {[
              { num: '1', text: 'You ll receive an order confirmation email within 10 minutes.' },
              { num: '2', text: 'Your Item will be packed and dispatched within 24 hours.' },
              { num: '3', text: 'Track your order anytime from the Orders section.' },
              { num: '4', text: 'When your item arrives — begin your manifestation ritual. 🌟' },
            ].map(({ num, text }) => (
              <div key={num} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: `1px solid ${BORDER}`, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: GOLD,
                  color: DEEP, fontWeight: 700, fontSize: 11, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {num}
                </div>
                <p style={{ fontSize: 13, color: INK, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className={`ty-fade-up ${visible ? 'visible' : ''}`} style={{ transitionDelay: '.45s' }}>
            <div className="ty-actions" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button className="ty-btn-primary" style={{ flex: 1 }} onClick={() => navigate('/orders')}>
                <Package size={16} />
                View My Orders
                <ArrowRight size={16} />
              </button>
              <button className="ty-btn-ghost" onClick={handleShare}>
                <Share2 size={15} />
                Share
              </button>
            </div>

            <button className="ty-btn-ghost" style={{ width: '100%', marginBottom: 20 }} onClick={() => navigate('/')}>
              ← Continue Shopping
            </button>

            {/* Auto-redirect notice */}
            <p style={{ textAlign: 'center', fontSize: 12, color: MUTED }}>
              Redirecting to your orders in{' '}
              <span style={{ fontWeight: 600, color: GOLD }}>{countdown}s</span>…
            </p>
          </div>

        </div>
      </div>
    </>
  );
}