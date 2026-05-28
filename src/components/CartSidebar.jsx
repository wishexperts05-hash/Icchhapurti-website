import { useState, useEffect } from 'react';
import { X, Loader2, ShoppingCart, AlertCircle, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '../context/HeaderContext';
import ProgressOfferBar from './ProgressOfferBar';

/* ─── Design tokens ─── */
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#F0D080';
const GOLD_PALE = '#FDF6E3';
const DEEP = '#1A1209';
const INK = '#2C2416';
const MUTED = '#7A6F60';
const CREAM = '#FAF6EE';
const GREEN = '#27623A';
const RED = '#DC2626';
const BORDER = 'rgba(201,168,76,0.25)';

export default function CartSidebar({ isOpen, onClose, countryCurrency, onCheckout }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { setCount } = useHeader();

  useEffect(() => {
    if (isOpen) {
      if (token) { setIsGuest(false); fetchCartData(); }
      else { setIsGuest(true); loadGuestCart(); setLoading(false); }
    }
  }, [isOpen, token]);

  const loadGuestCart = () => {
    try { setCartItems(JSON.parse(localStorage.getItem('cartItems') || '[]')); }
    catch { setCartItems([]); }
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/cart/cartItems?currencyCode=${countryCurrency}`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      setCartItems(data.data || []);
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const extractPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return Number(price.replace(/[^0-9.]/g, ''));
    return 0;
  };

  const updateQuantity = async ({ id, cartId, delta, price }) => {
    if (isGuest) { updateGuestQuantity(id, delta); return; }
    const item = cartItems.find(i => i._id === cartId);
    const newQty = Math.max(1, Number(item.quantity) + delta);
    const numericPrice = extractPrice(price);
    const prev = [...cartItems];
    setCartItems(items => items.map(i => i._id === cartId ? { ...i, quantity: newQty, totalAmount: numericPrice * newQty } : i));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/cart/updateQuantity?currencyCode=${countryCurrency}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: id, quantity: newQty, totalAmount: numericPrice * newQty }) }
      );
      const result = await res.json();
      if (!res.ok || !result.success) { setCartItems(prev); }
    } catch { setCartItems(prev); }
  };

  const updateGuestQuantity = (productId, delta) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const idx = cart.findIndex(i => (i.productId || i.product._id) === productId);
    if (idx > -1) {
      cart[idx].quantity = Math.max(1, cart[idx].quantity + delta);
      cart[idx].totalAmount = cart[idx].quantity * extractPrice(cart[idx].product.price);
      localStorage.setItem('cartItems', JSON.stringify(cart));
      localStorage.setItem('cart', cart.reduce((s, i) => s + i.quantity, 0));
      setCartItems(cart);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };

  const removeItem = async (id) => {
    if (isGuest) { removeGuestItem(id); return; }
    setRemovingId(id);
    const prev = [...cartItems];
    setCartItems(items => items.filter(i => i.product._id !== id));
    const oldCount = Number(localStorage.getItem('cart')) || 0;
    const newCount = Math.max(oldCount - 1, 0);
    localStorage.setItem('cart', newCount); setCount(newCount);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/removeFromCart/${id}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (!res.ok || !result.success) { setCartItems(prev); localStorage.setItem('cart', oldCount); }
    } catch { setCartItems(prev); localStorage.setItem('cart', oldCount); }
    finally { setRemovingId(null); }
  };

  const removeGuestItem = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]').filter(i => (i.productId || i.product._id) !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    localStorage.setItem('cart', total); setCount(total);
    setCartItems(cart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const currencySymbol = cartItems[0]?.currencySymbol || '₹';
  const totalPrice = cartItems.reduce((s, i) => s + Number(extractPrice(i.totalAmount)), 0);
  const totalItems = cartItems.reduce((s, i) => s + Number(i.quantity), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .cs-scroll::-webkit-scrollbar { width: 4px; }
        .cs-scroll::-webkit-scrollbar-track { background: transparent; }
        .cs-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 99px; }
        .cs-scroll::-webkit-scrollbar-thumb:hover { background: ${GOLD}; }
        .cs-item { transition: border-color .18s, box-shadow .18s; }
        .cs-item:hover { border-color: ${GOLD} !important; box-shadow: 0 2px 12px rgba(201,168,76,0.1); }
        .cs-qty-btn { transition: background .15s, transform .1s; }
        .cs-qty-btn:hover:not(:disabled) { background: ${GOLD} !important; color: #fff !important; transform: scale(1.08); }
        .cs-remove-btn { transition: background .15s, color .15s; }
        .cs-remove-btn:hover { background: #FEF2F2 !important; color: ${RED} !important; }
        .cs-checkout-btn { transition: background .2s, box-shadow .2s, transform .15s; }
        .cs-checkout-btn:hover { background: #b8952e !important; box-shadow: 0 6px 20px rgba(201,168,76,0.35) !important; transform: translateY(-1px); }
        .cs-checkout-btn:active { transform: translateY(0); }
        .cs-browse-btn:hover { background: ${DEEP} !important; color: ${GOLD_LIGHT} !important; }
        @keyframes cs-spin { to { transform: rotate(360deg); } }
        @keyframes cs-slidein { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes cs-fadeitem { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ── Drawer ── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%',
        width: '100%', maxWidth: 400,
        background: '#fff', zIndex: 52,
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
        boxShadow: isOpen ? '-8px 0 40px rgba(26,18,9,0.15)' : 'none',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{ background: DEEP, padding: '20px 20px 18px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={18} color={GOLD} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.1 }}>
                  Your Cart
                </h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, marginTop: 2 }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background .18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ── Progress offer bar ── */}
        {cartItems.length > 0 && (
          <ProgressOfferBar confettiOrigin={{ x: 0.95, y: 0.6 }} currentStep={0} />
        )}

        {/* ── Body ── */}
        <div className="cs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', background: CREAM }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12 }}>
              <div style={{ width: 36, height: 36, border: `3px solid ${BORDER}`, borderTopColor: GOLD, borderRadius: '50%', animation: 'cs-spin 1s linear infinite' }} />
              <p style={{ color: MUTED, fontSize: 14 }}>Loading cart…</p>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12, textAlign: 'center' }}>
              <AlertCircle size={36} color={RED} />
              <p style={{ color: RED, fontSize: 14 }}>{error}</p>
              <button onClick={fetchCartData} style={{ background: GOLD, color: DEEP, border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10, textAlign: 'center', padding: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: GOLD_PALE, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <ShoppingCart size={28} color={GOLD} />
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: DEEP }}>Cart is empty</p>
              <p style={{ fontSize: 13, color: MUTED, maxWidth: 220 }}>Add products to your cart and they'll appear here</p>
              <button
                className="cs-browse-btn"
                onClick={() => { navigate('/products'); onClose(); }}
                style={{ marginTop: 8, background: GOLD, color: DEEP, border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background .2s, color .2s' }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="cs-item"
                  style={{
                    background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12,
                    padding: '12px 14px', display: 'flex', gap: 12,
                    opacity: removingId === (isGuest ? item.productId || item.product._id : item.product._id) ? 0.4 : 1,
                    transition: 'opacity .2s',
                    animation: 'cs-fadeitem .25s ease',
                  }}
                >
                  {/* Image */}
                  <div
                    onClick={() => { navigate(`/product/${item.product._id || item.product.id}`); onClose(); }}
                    style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', border: `1px solid ${BORDER}` }}
                  >
                    <img
                      src={item?.product?.images?.[0] || '/placeholder.png'}
                      alt={item?.product?.name || 'Product'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.src = '/placeholder.png'; }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      onClick={() => { navigate(`/product/${item.product._id || item.product.id}`); onClose(); }}
                      style={{ fontSize: 13, fontWeight: 600, color: DEEP, marginBottom: 3, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}
                    >
                      {item.product.name}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 8, fontFamily: "'Cormorant Garamond',serif" }}>
                      {item.product.price}
                    </p>

                    {/* Qty + remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          className="cs-qty-btn"
                          onClick={() => updateQuantity({ id: isGuest ? (item.productId || item.product._id) : item.product._id, cartId: item._id, delta: -1, price: item.product.price })}
                          disabled={item.quantity <= 1}
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${BORDER}`, background: '#fff', color: MUTED, cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity <= 1 ? 0.4 : 1 }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ width: 28, height: 28, background: GOLD, color: DEEP, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          className="cs-qty-btn"
                          onClick={() => updateQuantity({ id: isGuest ? (item.productId || item.product._id) : item.product._id, cartId: item._id, delta: 1, price: item.product.price })}
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${BORDER}`, background: '#fff', color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        className="cs-remove-btn"
                        onClick={() => removeItem(isGuest ? (item.productId || item.product._id) : item.product._id)}
                        style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${BORDER}`, background: '#fff', color: MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: DEEP }}>{currencySymbol}{extractPrice(item.totalAmount).toLocaleString('en-IN')}</span>
                    {item.quantity > 1 && (
                      <span style={{ fontSize: 10, color: MUTED }}>{item.quantity}× {item.product.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Trust strip ── */}
        {cartItems.length > 0 && (
          <div style={{
            background: GOLD_PALE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 20, padding: '9px 16px', flexShrink: 0, flexWrap: 'wrap',
          }}>
            {[
              { icon: <Truck size={13} color={GOLD} />, text: 'Fast Shipping' },
              { icon: <ShieldCheck size={13} color={GREEN} />, text: 'Secure Checkout' },
              { icon: <Package size={13} color={MUTED} />, text: 'Easy Returns' },
            ].map(({ icon, text }) => (
              <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, fontWeight: 500 }}>
                {icon} {text}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        {cartItems.length > 0 && (
          <div style={{ background: '#fff', borderTop: `1px solid ${BORDER}`, padding: '16px 18px 20px', flexShrink: 0 }}>
            {/* Subtotal row */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600, color: DEEP }}>
                {currencySymbol}{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <p style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>
              Final price (with discounts) shown at checkout
            </p>

            {/* Checkout button */}
            <button
              className="cs-checkout-btn"
              onClick={onCheckout}
              style={{
                width: '100%', background: GOLD, color: DEEP, border: 'none',
                borderRadius: 12, padding: '15px 20px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', letterSpacing: '.02em',
                boxShadow: '0 4px 14px rgba(201,168,76,0.25)',
              }}
            >
              <span>Proceed to Checkout</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Payment icons */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {['/paytm.png', '/phonepay.jpg', '/gpay.jpg'].map((src, i) => (
                    <div key={src} style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: '#fff', border: '2px solid rgba(201,168,76,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginLeft: i !== 0 ? -8 : 0,
                    }}>
                      <img src={src} alt="" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
                <ArrowRight size={16} />
              </div>
            </button>

            {/* Continue shopping */}
            <button
              onClick={onClose}
              style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: MUTED, fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '6px 0', textAlign: 'center', transition: 'color .18s' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = MUTED}
            >
              ← Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}