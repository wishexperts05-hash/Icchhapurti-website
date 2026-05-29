import { useState, useEffect } from 'react';
import { Package, ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Add to your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

const styles = `
  .op-page {
    font-family: 'DM Sans', sans-serif;
    background: #FAF6EE;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
    min-height: 100vh;
    color: #1a1a1a;
  }

  /* ── Back ── */
  .op-back-btn {
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
  .op-back-btn:hover { color: #BA7517; }

  /* ── Header ── */
  .op-title-block {
    padding: 1.25rem 0 1.5rem;
    border-bottom: 0.5px solid #e8e2d4;
    margin-bottom: 1.5rem;
  }
  .op-eyebrow {
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #BA7517;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .op-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    margin: 0 0 4px;
    color: #1a1a1a;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }
  .op-subtitle {
    font-size: 13px;
    color: #555;
    font-weight: 400;
    margin: 0;
  }

  /* ── Order count ── */
  .op-count {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 1rem;
    letter-spacing: 0.02em;
  }

  /* ── Order card ── */
  .op-list { display: flex; flex-direction: column; gap: 0.75rem; }

  .op-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.125rem;
    border: 0.5px solid #e5ddd0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    animation: fadeUp 0.28s ease both;
    text-decoration: none;
    color: inherit;
  }
  .op-card:hover { border-color: #EF9F27; background: #fffdf7; }

  /* ── Image ── */
  .op-img-wrap {
    width: 58px;
    height: 58px;
    border-radius: 9px;
    overflow: hidden;
    flex-shrink: 0;
    border: 0.5px solid #e8e2d4;
    background: #faf8f4;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .op-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .op-img-placeholder { color: #ddd; }

  /* ── Info ── */
  .op-info { flex: 1; min-width: 0; }

  .op-order-id {
    font-size: 11px;
    letter-spacing: 0.06em;
    color: #aaa;
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 3px;
  }
  .op-product-name {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
  }
  .op-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .op-price {
    font-size: 14px;
    font-weight: 500;
    color: #BA7517;
  }
  .op-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #ddd;
    flex-shrink: 0;
  }

  /* ── Status badge ── */
  .op-badge {
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
  .op-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .op-badge.Placed     { background: #e8f0fe; color: #1a56db; }
  .op-badge.Processing { background: #e8f0fe; color: #1a56db; }
  .op-badge.Shipped    { background: #f3e8ff; color: #7c3aed; }
  .op-badge.Delivered  { background: #e1f5e8; color: #1a6e38; }
  .op-badge.Cancelled  { background: #fef2f2; color: #c0392b; }
  .op-badge.Returned   { background: #fff4e8; color: #b45309; }
  .op-badge.Refunded   { background: #fef9e7; color: #92640c; }
  .op-badge.default    { background: #f3f4f6; color: #555; }

  .op-badge.Placed .op-badge-dot     { background: #1a56db; }
  .op-badge.Processing .op-badge-dot { background: #1a56db; }
  .op-badge.Shipped .op-badge-dot    { background: #7c3aed; }
  .op-badge.Delivered .op-badge-dot  { background: #1a6e38; }
  .op-badge.Cancelled .op-badge-dot  { background: #c0392b; }
  .op-badge.Returned .op-badge-dot   { background: #b45309; }
  .op-badge.Refunded .op-badge-dot   { background: #92640c; }
  .op-badge.default .op-badge-dot    { background: #888; }

  /* ── Chevron ── */
  .op-chevron {
    color: #ddd;
    flex-shrink: 0;
    transition: color 0.15s, transform 0.15s;
  }
  .op-card:hover .op-chevron { color: #BA7517; transform: translateX(2px); }

  /* ── Empty ── */
  .op-empty {
    text-align: center;
    padding: 3.5rem 1rem;
  }
  .op-empty-icon {
    width: 56px;
    height: 56px;
    background: #faf8f4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    border: 0.5px solid #e8e2d4;
    color: #FAC775;
  }
  .op-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 6px;
  }
  .op-empty-sub {
    font-size: 13px;
    color: #888;
    font-weight: 400;
    margin-bottom: 1.5rem;
  }
  .op-shop-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0.8rem 1.5rem;
    background: #BA7517;
    border: none;
    border-radius: 10px;
    color: #FAEEDA;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s;
  }
  .op-shop-btn:hover { background: #854F0B; }

  /* ── Error ── */
  .op-error {
    text-align: center;
    padding: 3rem 1rem;
  }
  .op-error-msg { font-size: 14px; color: #c0392b; margin-bottom: 1rem; }
  .op-retry-btn {
    padding: 0.7rem 1.5rem;
    background: #BA7517;
    border: none;
    border-radius: 10px;
    color: #FAEEDA;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.18s;
  }
  .op-retry-btn:hover { background: #854F0B; }

  /* ── Loader ── */
  .op-loader {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    color: #aaa;
    font-size: 13px;
  }
  .op-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid #e8e2d4;
    border-top-color: #EF9F27;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Pagination ── */
  .op-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 0.5px solid #e8e2d4;
  }
  .op-page-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    border: 0.5px solid #e5ddd0;
    background: #fff;
    color: #555;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .op-page-btn:hover:not(:disabled):not(.active) {
    border-color: #EF9F27;
    color: #BA7517;
    background: #fffbf0;
  }
  .op-page-btn.active {
    background: #BA7517;
    border-color: #BA7517;
    color: #FAEEDA;
  }
  .op-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .op-page-ellipsis { font-size: 13px; color: #bbb; padding: 0 2px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const STATUS_CLASS = {
  Placed: 'Placed', Processing: 'Processing', Shipped: 'Shipped',
  Delivered: 'Delivered', Cancelled: 'Cancelled',
  Returned: 'Returned', Refunded: 'Refunded'
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(currentPage); }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/orders/getMyOrders?page=${page}&limit=${ordersPerPage}`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const addPage = (n) => pages.push(
      <button
        key={n}
        className={`op-page-btn${currentPage === n ? ' active' : ''}`}
        onClick={() => handlePageChange(n)}
      >{n}</button>
    );
    const addEllipsis = (k) => pages.push(
      <span key={k} className="op-page-ellipsis">…</span>
    );

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);
      if (currentPage > 3) addEllipsis('e1');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) addPage(i);
      if (currentPage < totalPages - 2) addEllipsis('e2');
      addPage(totalPages);
    }
    return pages;
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="op-page">
        <div className="op-loader">
          <div className="op-spinner" />
          Loading orders…
        </div>
      </div>
    </>
  );

  // ── Error ─────────────────────────────────────────────────────
  if (error) return (
    <>
      <style>{styles}</style>
      <div className="op-page">
        <div className="op-error">
          <p className="op-error-msg">Something went wrong: {error}</p>
          <button className="op-retry-btn" onClick={() => fetchOrders(currentPage)}>Try again</button>
        </div>
      </div>
    </>
  );

  // ── Page ──────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="op-page">

        <button className="op-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          Back
        </button>

        <div className="op-title-block">
          <div className="op-eyebrow">Purchase history</div>
          <h1 className="op-title">My Orders</h1>
          <p className="op-subtitle">Track and manage your purchases</p>
        </div>

        {orders.length > 0 && (
          <p className="op-count">
            {orders.length} order{orders.length !== 1 ? 's' : ''} on this page
          </p>
        )}

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="op-empty">
            <div className="op-empty-icon">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </div>
            <div className="op-empty-title">No orders yet</div>
            <p className="op-empty-sub">Looks like you haven't placed any orders.</p>
            <button className="op-shop-btn" onClick={() => navigate('/')}>
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="op-list">
              {orders.map((order, i) => {
                const statusKey = STATUS_CLASS[order.status] || 'default';
                return (
                  <div
                    key={order._id}
                    className="op-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    {/* Image */}
                    <div className="op-img-wrap">
                      {order.image
                        ? <img src={order.image} alt={order.productName} />
                        : <Package size={22} strokeWidth={1.5} className="op-img-placeholder" />
                      }
                    </div>

                    {/* Info */}
                    <div className="op-info">
                      <div className="op-order-id">#{order.orderId}</div>
                      <div className="op-product-name">{order.productName}</div>
                      <div className="op-meta">
                        <span className="op-price">₹{Number(order.price).toFixed(2)}</span>
                        <span className="op-dot" />
                        <span className={`op-badge ${statusKey}`}>
                          <span className="op-badge-dot" />
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={16} strokeWidth={1.75} className="op-chevron" />
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="op-pagination">
                <button
                  className="op-page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={15} strokeWidth={2} />
                </button>

                {renderPagination()}

                <button
                  className="op-page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OrdersPage;