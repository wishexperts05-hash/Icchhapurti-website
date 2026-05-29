import React, { useEffect, useState } from 'react';
import { Package, Check, ArrowLeft, MapPin, CreditCard, Tag, Loader } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Add to your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

const styles = `
  .od-page {
    font-family: 'DM Sans', sans-serif;
    background: #FAF6EE;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
    min-height: 100vh;
    color: #1a1a1a;
  }

  /* ── Back ── */
  .od-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #888;
    background: none;
    border: none;
    cursor: pointer;
    padding: 1.5rem 0 0;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    letter-spacing: 0.03em;
    transition: color 0.18s;
  }
  .od-back-btn:hover { color: #BA7517; }

  /* ── Header ── */
  .od-title-block {
    padding: 1.25rem 0 1.25rem;
    border-bottom: 0.5px solid #e8e2d4;
    margin-bottom: 1.75rem;
  }
  .od-eyebrow {
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #BA7517;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .od-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    margin: 0 0 0.625rem;
    color: #1a1a1a;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }

  /* ── Order meta row ── */
  .od-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .od-order-id {
    font-size: 12px;
    color: #888;
    letter-spacing: 0.04em;
    font-weight: 400;
  }
  .od-order-id span { color: #333; font-weight: 500; }
  .od-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: #ddd; }

  /* ── Status badges ── */
  .od-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .od-badge-dot { width: 5px; height: 5px; border-radius: 50%; }

  .od-badge.Placed, .od-badge.Processing { background: #e8f0fe; color: #1a56db; }
  .od-badge.Shipped   { background: #f3e8ff; color: #7c3aed; }
  .od-badge.Delivered { background: #e1f5e8; color: #1a6e38; }
  .od-badge.Cancelled { background: #fef2f2; color: #c0392b; }
  .od-badge.Returned  { background: #fff4e8; color: #b45309; }
  .od-badge.Refunded  { background: #fef9e7; color: #92640c; }
  .od-badge.default   { background: #f3f4f6; color: #555; }
  .od-badge.Paid      { background: #e1f5e8; color: #1a6e38; }
  .od-badge.Pending   { background: #fff4e8; color: #b45309; }
  .od-badge.Failed    { background: #fef2f2; color: #c0392b; }

  .od-badge.Placed .od-badge-dot, .od-badge.Processing .od-badge-dot { background: #1a56db; }
  .od-badge.Shipped .od-badge-dot   { background: #7c3aed; }
  .od-badge.Delivered .od-badge-dot { background: #1a6e38; }
  .od-badge.Cancelled .od-badge-dot { background: #c0392b; }
  .od-badge.Returned .od-badge-dot  { background: #b45309; }
  .od-badge.Refunded .od-badge-dot  { background: #92640c; }
  .od-badge.default .od-badge-dot   { background: #888; }
  .od-badge.Paid .od-badge-dot      { background: #1a6e38; }
  .od-badge.Pending .od-badge-dot   { background: #b45309; }
  .od-badge.Failed .od-badge-dot    { background: #c0392b; }

  /* ── Section ── */
  .od-section {
    margin-bottom: 1.75rem;
    animation: fadeUp 0.28s ease both;
  }
  .od-section-label {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #777;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* ── Product cards ── */
  .od-product-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.125rem;
    border: 0.5px solid #e5ddd0;
    border-radius: 12px;
    background: #fff;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
  }
  .od-product-card:last-child { margin-bottom: 0; }
  .od-product-card:hover { border-color: #EF9F27; background: #fffdf7; }

  .od-product-img {
    width: 54px;
    height: 54px;
    border-radius: 9px;
    overflow: hidden;
    flex-shrink: 0;
    border: 0.5px solid #e8e2d4;
    background: #faf8f4;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .od-product-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .od-product-img-placeholder { color: #ddd; }

  .od-product-info { flex: 1; min-width: 0; }
  .od-product-name {
    font-size: 13.5px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .od-product-qty {
    font-size: 12px;
    color: #888;
    font-weight: 400;
    margin-bottom: 4px;
  }
  .od-product-price {
    font-size: 13.5px;
    font-weight: 500;
    color: #BA7517;
  }
  .od-product-subtotal {
    font-size: 11.5px;
    color: #aaa;
    font-weight: 400;
    margin-left: 5px;
  }
  .od-returnable {
    font-size: 11px;
    color: #1a6e38;
    margin-top: 3px;
    font-weight: 400;
  }

  /* ── Timeline ── */
  .od-timeline { position: relative; padding-left: 1.5rem; }
  .od-timeline-line {
    position: absolute;
    left: 7px;
    top: 6px;
    bottom: 6px;
    width: 1px;
    background: linear-gradient(to bottom, #EF9F27, #e8e2d4);
  }
  .od-timeline-item {
    position: relative;
    margin-bottom: 1.25rem;
    padding-bottom: 0;
  }
  .od-timeline-item:last-child { margin-bottom: 0; }
  .od-timeline-dot {
    position: absolute;
    left: -1.5rem;
    top: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #EF9F27;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1.5px #EF9F27;
  }
  .od-timeline-dot.past {
    background: #e8e2d4;
    box-shadow: 0 0 0 1.5px #e8e2d4;
  }
  .od-timeline-status {
    font-size: 13.5px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 2px;
  }
  .od-timeline-note {
    font-size: 12.5px;
    color: #666;
    font-weight: 400;
    margin-bottom: 2px;
    line-height: 1.5;
  }
  .od-timeline-time {
    font-size: 11.5px;
    color: #aaa;
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  /* ── Info card (address / price) ── */
  .od-info-card {
    border: 0.5px solid #e5ddd0;
    border-radius: 12px;
    padding: 1rem 1.125rem;
    background: #faf8f4;
  }
  .od-info-card-header {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 0.875rem;
    padding-bottom: 0.75rem;
    border-bottom: 0.5px solid #e8e2d4;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .od-info-card-header svg { color: #BA7517; }

  /* Address */
  .od-addr-label {
    font-size: 13.5px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 3px;
  }
  .od-addr-line {
    font-size: 13px;
    color: #555;
    font-weight: 400;
    line-height: 1.6;
  }

  /* Price rows */
  .od-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    color: #555;
    padding: 5px 0;
    font-weight: 400;
  }
  .od-price-row.discount { color: #1a6e38; font-weight: 500; }
  .od-price-row.total {
    border-top: 0.5px solid #e8e2d4;
    margin-top: 6px;
    padding-top: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
  }
  .od-price-row.total span:last-child { color: #BA7517; }

  /* ── Loader / error ── */
  .od-loader {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    font-size: 13px;
    color: #aaa;
  }
  .od-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid #e8e2d4;
    border-top-color: #EF9F27;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .od-error-wrap {
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .od-error-msg { font-size: 14px; color: #c0392b; text-align: center; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const formatDateTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const StatusBadge = ({ label }) => {
  const cls = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled',
    'Returned', 'Refunded', 'Paid', 'Pending', 'Failed'].includes(label) ? label : 'default';
  return (
    <span className={`od-badge ${cls}`}>
      <span className="od-badge-dot" />
      {label}
    </span>
  );
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/orders/getOrderById/${orderId}`,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const json = await res.json();
        if (json.success) setOrder(json.data);
        else setError(json.message || 'Failed to fetch order');
      } catch { setError('Error fetching order details'); }
      finally { setLoading(false); }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="od-page">
        <div className="od-loader">
          <div className="od-spinner" />
          Loading order details…
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="od-page">
        <div className="od-error-wrap">
          <p className="od-error-msg">{error}</p>
        </div>
      </div>
    </>
  );

  if (!order) return null;

  const {
    orderId: oid, products, totalProducts,
    subtotalAmount, shippingAmount, discountAmount, grandTotal,
    shippingAddress, timeline, status, paymentMethod, paymentStatus
  } = order;

  return (
    <>
      <style>{styles}</style>
      <div className="od-page">

        <button className="od-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          Back
        </button>

        {/* Title */}
        <div className="od-title-block">
          <div className="od-eyebrow">Order details</div>
          <h1 className="od-title">Order Summary</h1>
          <div className="od-meta-row">
            <span className="od-order-id">Order <span>#{oid}</span></span>
            <span className="od-meta-dot" />
            <StatusBadge label={status} />
            <span className="od-meta-dot" />
            <StatusBadge label={paymentStatus} />
          </div>
        </div>

        {/* Products */}
        <div className="od-section" style={{ animationDelay: '0.04s' }}>
          <div className="od-section-label">
            {totalProducts} item{totalProducts !== 1 ? 's' : ''} ordered
          </div>
          {products.map((item) => (
            <div
              key={item.productId}
              className="od-product-card"
              onClick={() => navigate(`/product/${item.productId}/${encodeURIComponent(item.name || 'product')}`)}
            >
              <div className="od-product-img">
                {item.images?.[0]
                  ? <img src={item.images[0]} alt={item.name} />
                  : <Package size={20} strokeWidth={1.5} className="od-product-img-placeholder" />
                }
              </div>
              <div className="od-product-info">
                <p className="od-product-name">{item.name}</p>
                <p className="od-product-qty">Qty: {item.quantity}</p>
                <p className="od-product-price">
                  ₹{item.price}
                  <span className="od-product-subtotal">Subtotal: ₹{item.subtotal}</span>
                </p>
                {item.returnable && (
                  <p className="od-returnable">
                    ↩ Returnable{item.returnableDays ? ` within ${item.returnableDays} days` : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {timeline?.length > 0 && (
          <div className="od-section" style={{ animationDelay: '0.1s' }}>
            <div className="od-section-label">Order timeline</div>
            <div className="od-timeline">
              <div className="od-timeline-line" />
              {timeline.map((step, i) => (
                <div key={i} className="od-timeline-item">
                  <div className={`od-timeline-dot${i > 0 ? ' past' : ''}`}>
                    <Check size={7} color="#fff" strokeWidth={3} />
                  </div>
                  <div className="od-timeline-status">{step.status}</div>
                  {step.note && <div className="od-timeline-note">{step.note}</div>}
                  <div className="od-timeline-time">{formatDateTime(step.at)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery address */}
        {shippingAddress && (
          <div className="od-section" style={{ animationDelay: '0.16s' }}>
            <div className="od-section-label">Delivery address</div>
            <div className="od-info-card">
              <div className="od-info-card-header">
                <MapPin size={13} strokeWidth={2} />
                Shipping to
              </div>
              <div className="od-addr-label">{shippingAddress.label}</div>
              <div className="od-addr-line">
                {shippingAddress.street}, {shippingAddress.city} — {shippingAddress.pinCode}
              </div>
            </div>
          </div>
        )}

        {/* Payment method */}
        {paymentMethod && (
          <div className="od-section" style={{ animationDelay: '0.2s' }}>
            <div className="od-section-label">Payment</div>
            <div className="od-info-card">
              <div className="od-info-card-header">
                <CreditCard size={13} strokeWidth={2} />
                Payment method
              </div>
              <div className="od-addr-line">{paymentMethod}</div>
            </div>
          </div>
        )}

        {/* Price summary */}
        <div className="od-section" style={{ animationDelay: '0.24s' }}>
          <div className="od-section-label">Price breakdown</div>
          <div className="od-info-card">
            <div className="od-info-card-header">
              <Tag size={13} strokeWidth={2} />
              Order total
            </div>
            <div className="od-price-row">
              <span>Items ({totalProducts})</span>
              <span>₹{subtotalAmount}</span>
            </div>
            {discountAmount > 0 && (
              <div className="od-price-row discount">
                <span>Discount</span>
                <span>−₹{discountAmount}</span>
              </div>
            )}
            <div className="od-price-row">
              <span>Shipping</span>
              <span>{shippingAmount > 0 ? `₹${shippingAmount}` : 'Free'}</span>
            </div>
            <div className="od-price-row total">
              <span>Total paid</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default OrderDetailsPage;