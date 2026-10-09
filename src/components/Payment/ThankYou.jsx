import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Share2 } from 'lucide-react';
import axios from 'axios';

/* ─── Tokens ─── */
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#F0D080';
const GOLD_PALE = '#FDF6E3';
const DEEP = '#1A1209';
const MUTED = '#7A6F60';
const CREAM = '#FAF6EE';
const BORDER = 'rgba(201,168,76,0.25)';
const GREEN_BG = 'rgba(39,98,58,0.15)';
const GREEN_TEXT = '#6EBB8A';

/* ─── Confetti ─── */
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

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 80,
      w: 5 + Math.random() * 7,
      h: 9 + Math.random() * 9,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3.5,
      opacity: 1,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin;
        if (frame > 100) p.opacity -= 0.01;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 240) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }} />;
}

/* ─── Compact step pill ─── */
function StepPill({ label, done, active }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: done ? GOLD : active ? GOLD_PALE : '#F3EDE3',
        border: `2px solid ${done ? GOLD : active ? GOLD : BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: done ? '0 0 0 4px rgba(201,168,76,0.15)' : 'none',
        transition: 'all .4s',
      }}>
        {done
          ? <CheckCircle size={13} color="#fff" strokeWidth={2.5} />
          : active
            ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />
            : <div style={{ width: 7, height: 7, borderRadius: '50%', background: MUTED, opacity: .4 }} />
        }
      </div>
      <span style={{ fontSize: 9.5, fontWeight: 500, color: done ? DEEP : MUTED, letterSpacing: '.02em', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </div>
  );
}

function StepLine({ done }) {
  return (
    <div style={{ flex: 1, height: 2, background: BORDER, borderRadius: 2, marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 2,
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        width: done ? '100%' : '0%', transition: 'width .9s ease',
      }} />
    </div>
  );
}

/* ─── Main ─── */
export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [visible, setVisible] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  const orderNumber = location.state?.orderNumber || sessionStorage.getItem('orderNumber') || '';
  const pinCode = location.state?.pinCode || '';
  const deliveryAddress = location.state?.address || '';
  const paymentMethod = location.state?.paymentMethod || 'Online';
  const grandTotal = location.state?.grandTotal || '';
  const products = location.state?.products || [];

  const payLabel =
    paymentMethod === 'razorpay' || paymentMethod === 'Online (Card / UPI)'
      ? 'Online (Card / UPI)'
      : paymentMethod === 'wallet' || paymentMethod === 'Wallet'
        ? 'Wallet'
        : paymentMethod;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setShowConfetti(true), 350);
    if (pinCode) {
      axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/shipping/edd?pincode=${pinCode}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      ).then(r => { if (r.data.success) setEstimatedDelivery(r.data); }).catch(() => { });
    }
    sessionStorage.removeItem('orderNumber');
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: 'I just ordered from Icchhapurti!', text: 'Manifest your desires with the Seven Chakra Pen 🌟', url: window.location.origin });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500;600&display=swap');

        .ty-up {
          opacity: 0; transform: translateY(22px);
          transition: opacity .55s ease, transform .55s ease;
        }
        .ty-up.in { opacity: 1; transform: none; }

        @keyframes ty-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,.4); }
          50%      { box-shadow: 0 0 0 10px rgba(201,168,76,0); }
        }
        .ty-pulse { animation: ty-pulse 2s ease-in-out infinite; }

        @keyframes ty-shimmer { to { background-position: -200% 0; } }
        .ty-shimmer {
          background: linear-gradient(90deg,${GOLD_PALE} 25%,#fff 50%,${GOLD_PALE} 75%);
          background-size: 200% 100%;
          animation: ty-shimmer 1.8s infinite;
          border-radius: 6px;
        }

        .ty-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 14px; cursor: pointer;
          transition: background .18s, transform .12s, color .18s, border-color .18s;
          padding: 12px 18px; border: none;
        }
        .ty-btn-gold { background: ${GOLD}; color: ${DEEP}; }
        .ty-btn-gold:hover { background: #b8952e; transform: translateY(-1px); }
        .ty-btn-ghost { background: transparent; color: ${MUTED}; border: 1.5px solid ${BORDER}; }
        .ty-btn-ghost:hover { border-color: ${GOLD}; color: ${GOLD}; }

        @media(max-width:520px) {
          .ty-actions { flex-direction: column !important; }
          .ty-grid2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div style={{ background: DEEP, color: GOLD_LIGHT, textAlign: 'center', fontSize: 11.5, padding: '8px 16px', letterSpacing: '.06em', fontWeight: 500 }}>
        🌟 Your manifestation journey begins now — Thank you for choosing Icchhapurti
      </div>

      {/* Page */}
      <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px 40px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* ── Main card ── */}
          <div className={`ty-up ${visible ? 'in' : ''}`} style={{
            background: '#fff', borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${BORDER}`, boxShadow: '0 8px 40px rgba(26,18,9,0.09)',
          }}>

            {/* Dark hero strip */}
            <div style={{
              background: DEEP, padding: '28px 24px 24px', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative blobs */}
              <div style={{ position: 'absolute', top: -36, right: -36, width: 140, height: 140, borderRadius: '50%', background: 'rgba(201,168,76,.07)' }} />
              <div style={{ position: 'absolute', bottom: -28, left: -28, width: 110, height: 110, borderRadius: '50%', background: 'rgba(201,168,76,.05)' }} />

              {/* Check icon */}
              <div className="ty-pulse" style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 14px',
                background: 'linear-gradient(135deg,rgba(201,168,76,.22),rgba(201,168,76,.08))',
                border: '2px solid rgba(201,168,76,.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={34} color={GOLD} strokeWidth={1.5} />
              </div>

              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: GREEN_BG, color: GREEN_TEXT,
                border: '1px solid rgba(39,98,58,.3)', borderRadius: 99,
                padding: '4px 12px', fontSize: 11.5, fontWeight: 500, marginBottom: 10,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN_TEXT, display: 'inline-block' }} />
                Payment Confirmed
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: GOLD_LIGHT, lineHeight: 1.15, margin: '0 0 4px' }}>
                Order Placed! 🎉
              </h1>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,.5)', margin: 0 }}>
                Your manifestation tool is on its way ✨
              </p>

              {/* Order ID + Amount pill row */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                {orderNumber && (
                  <div style={{
                    background: 'rgba(201,168,76,.13)', border: '1px solid rgba(201,168,76,.28)',
                    borderRadius: 8, padding: '7px 14px', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 10, color: GOLD, letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 500 }}>Order ID</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: GOLD_LIGHT, letterSpacing: '.03em' }}>#{orderNumber}</div>
                  </div>
                )}
                {grandTotal && (
                  <div style={{
                    background: 'rgba(201,168,76,.13)', border: '1px solid rgba(201,168,76,.28)',
                    borderRadius: 8, padding: '7px 14px', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 10, color: GOLD, letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 500 }}>Amount Paid</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: GOLD_LIGHT }}>{grandTotal}</div>
                  </div>
                )}
                <div style={{
                  background: 'rgba(201,168,76,.13)', border: '1px solid rgba(201,168,76,.28)',
                  borderRadius: 8, padding: '7px 14px', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 10, color: GOLD, letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 500 }}>Via</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: GOLD_LIGHT }}>{payLabel}</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 20px 22px' }}>

              {/* Progress strip */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>Order Progress</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StepPill label="Placed" done />
                  <StepLine done />
                  <StepPill label="Packing" active />
                  <StepLine done={false} />
                  <StepPill label="Shipped" />
                  <StepLine done={false} />
                  <StepPill label="Delivered" />
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${BORDER}`, margin: '0 0 16px' }} />

              {/* Purchased Products */}
              {products.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.07em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>Items Purchased</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: GOLD_PALE, borderRadius: 10, padding: '9px 12px',
                        border: `1px solid ${BORDER}`,
                      }}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: `1px solid ${BORDER}` }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${BORDER}` }}>
                            <Package size={18} color={GOLD} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: DEEP, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>Qty: {item.quantity}{item.price ? ` · ${item.price}` : ''}</p>
                        </div>
                        <CheckCircle size={15} color={GOLD} strokeWidth={2} style={{ flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${BORDER}`, margin: '0 0 16px' }} />

              {/* Delivery + Address row */}
              <div className="ty-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {/* EDD */}
                <div style={{ background: GOLD_PALE, borderRadius: 10, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Truck size={13} color={GOLD} />
                    <span style={{ fontSize: 10, color: MUTED, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500 }}>Est. Delivery</span>
                  </div>
                  {estimatedDelivery
                    ? <p style={{ fontSize: 13, fontWeight: 600, color: DEEP, fontFamily: "'Cormorant Garamond', serif" }}>{estimatedDelivery.deliveryDate}</p>
                    : pinCode
                      ? <div className="ty-shimmer" style={{ height: 16, width: 100 }} />
                      : <p style={{ fontSize: 12, color: MUTED }}>–</p>
                  }
                </div>

                {/* Address */}
                <div style={{ background: GOLD_PALE, borderRadius: 10, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <MapPin size={13} color={GOLD} />
                    <span style={{ fontSize: 10, color: MUTED, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500 }}>Delivering to</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: DEEP, lineHeight: 1.45, fontWeight: 500 }}>
                    {deliveryAddress || '–'}
                  </p>
                </div>
              </div>

              {/* Quick info row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                {[
                  { icon: '📧', text: 'Confirmation email sent' },
                  { icon: '📦', text: 'Ships within 24 hrs' },
                  { icon: '💬', text: 'wishexperts05@gmail.com' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: CREAM, borderRadius: 8, padding: '7px 11px',
                    fontSize: 11.5, color: MUTED, border: `1px solid ${BORDER}`, flex: '1 1 auto',
                  }}>
                    <span>{icon}</span> {text}
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="ty-actions" style={{ display: 'flex', gap: 10 }}>
                <button className="ty-btn ty-btn-gold" style={{ flex: 1 }} onClick={() => navigate('/orders')}>
                  <Package size={15} />
                  View My Orders
                  <ArrowRight size={14} />
                </button>
                <button className="ty-btn ty-btn-ghost" onClick={handleShare}>
                  <Share2 size={14} />
                  Share
                </button>
              </div>

              <button
                className="ty-btn ty-btn-ghost"
                style={{ width: '100%', marginTop: 10 }}
                onClick={() => navigate('/')}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}