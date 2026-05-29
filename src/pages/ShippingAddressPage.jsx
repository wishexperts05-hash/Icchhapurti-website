import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, ArrowRight, Edit2, Trash2, Plus, MapPin } from "lucide-react";

// Add to your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

const styles = `
  .addr-page {
    font-family: 'DM Sans', sans-serif;
    background: #FAF6EE;
    max-width: 860px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
    min-height: 100vh;
    color: #1a1a1a;
  }

  .addr-back-btn {
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
  .addr-back-btn:hover { color: #BA7517; }

  .addr-title-block {
    padding: 1.25rem 0 1.5rem;
    border-bottom: 0.5px solid #e8e2d4;
    margin-bottom: 1.5rem;
  }
  .addr-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #BA7517;
    margin-bottom: 5px;
    font-weight: 500;
  }
  .addr-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    margin: 0 0 5px;
    color: #1a1a1a;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }
  .addr-subtitle {
    font-size: 13px;
    color: #888;
    font-weight: 300;
    margin: 0;
  }

  .addr-count {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 1rem;
    letter-spacing: 0.03em;
  }

  .addr-list { display: flex; flex-direction: column; gap: 0.75rem; }

  .addr-card {
    border: 0.5px solid #e5ddd0;
    border-radius: 12px;
    padding: 1.125rem 1.25rem 0.875rem;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    animation: fadeUp 0.32s ease both;
  }
  .addr-card:hover { border-color: #EF9F27; }
  .addr-card.selected {
    border: 1.5px solid #EF9F27;
    background: #fffdf7;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .addr-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .addr-info { flex: 1; }

  .addr-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 3px;
  }
  .addr-name { font-size: 14.5px; font-weight: 500; color: #1a1a1a; }
  .addr-phone { font-size: 13px; color: #999; }

  .addr-default-badge {
    font-size: 9.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: #FAEEDA;
    color: #854F0B;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
    border: 0.5px solid #FAC775;
  }

  .addr-street {
    font-size: 13px;
    color: #888;
    line-height: 1.65;
    font-weight: 300;
    margin: 0 0 0.875rem;
  }

  .addr-radio {
    width: 18px;
    height: 18px;
    min-width: 18px;
    border-radius: 50%;
    border: 1.5px solid #d5cfc4;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.18s;
    background: #fff;
    flex-shrink: 0;
  }
  .addr-radio.checked { border-color: #EF9F27; }
  .addr-radio-dot {
    width: 8px;
    height: 8px;
    background: #EF9F27;
    border-radius: 50%;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.15s, transform 0.15s;
  }
  .addr-radio.checked .addr-radio-dot { opacity: 1; transform: scale(1); }

  .addr-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    border-top: 0.5px solid #f0ebe1;
    padding-top: 0.75rem;
  }
  .addr-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    color: #aaa;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    transition: color 0.15s;
    letter-spacing: 0.02em;
  }
  .addr-action-btn.edit:hover { color: #BA7517; }
  .addr-action-btn.remove:hover { color: #c0392b; }
  .addr-action-btn:disabled { opacity: 0.45; cursor: default; }
  .addr-action-sep { width: 1px; height: 12px; background: #ece6da; }

  .addr-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 0.875rem;
    margin-top: 1.25rem;
    background: transparent;
    border: 1.5px dashed #FAC775;
    border-radius: 12px;
    color: #BA7517;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    text-decoration: none;
  }
  .addr-add-btn:hover { background: #fffbf0; border-color: #EF9F27; }

  .addr-proceed-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 0.9rem;
    margin-top: 0.875rem;
    background: #BA7517;
    border: none;
    border-radius: 10px;
    color: #FAEEDA;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s;
  }
  .addr-proceed-btn:hover { background: #854F0B; }
  .addr-proceed-btn:disabled { opacity: 0.5; cursor: default; }

  .addr-empty {
    text-align: center;
    padding: 3.5rem 1rem;
    color: #aaa;
  }
  .addr-empty-icon {
    width: 52px;
    height: 52px;
    background: #faf6ee;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    color: #FAC775;
  }
  .addr-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 6px;
  }
  .addr-empty-sub { font-size: 13px; font-weight: 300; }

  .addr-loader {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ShippingAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/address/getAllAddress`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
        if (data.data?.length > 0) setSelected(data.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Remove this address?");
    if (!confirmDelete) return;
    try {
      setDeleteLoading(id);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/address/deleteAddress/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        fetchAddresses();
      } else {
        alert(result.message || "Failed to delete address.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="addr-loader">
          <Loader2 size={36} strokeWidth={1.5} style={{ animation: "spin 1s linear infinite", color: "#EF9F27" }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="addr-page">

        {/* Back */}
        <button className="addr-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          Back
        </button>

        {/* Title */}
        <div className="addr-title-block">
          <div className="addr-eyebrow">Delivery</div>
          <h1 className="addr-title">Shipping Address</h1>
          <p className="addr-subtitle">Choose where we should deliver your order</p>
        </div>

        {/* Address count */}
        {addresses.length > 0 && (
          <p className="addr-count">
            {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
          </p>
        )}

        {/* Empty state */}
        {addresses.length === 0 ? (
          <div className="addr-empty">
            <div className="addr-empty-icon">
              <MapPin size={22} strokeWidth={1.5} />
            </div>
            <div className="addr-empty-title">No addresses yet</div>
            <p className="addr-empty-sub">Add a delivery address to get started</p>
          </div>
        ) : (
          <div className="addr-list">
            {addresses.map((addr, idx) => (
              <div
                key={addr._id}
                className={`addr-card${selected === addr._id ? " selected" : ""}`}
                style={{ animationDelay: `${idx * 0.07}s` }}
                onClick={() => setSelected(addr._id)}
              >
                <div className="addr-card-top">
                  <div className="addr-info">
                    <div className="addr-name-row">
                      <span className="addr-name">{addr.fullName}</span>
                      <span className="addr-phone">{addr.phoneNumber}</span>
                      {idx === 0 && <span className="addr-default-badge">Default</span>}
                    </div>
                    <p className="addr-street">
                      {addr.street}, {addr.city},<br />
                      {addr.state}, {addr.country} — {addr.pinCode}
                    </p>
                  </div>
                  <div className={`addr-radio${selected === addr._id ? " checked" : ""}`}>
                    <div className="addr-radio-dot" />
                  </div>
                </div>

                <div className="addr-actions">
                  <Link
                    to={`/address-form/${addr._id}`}
                    className="addr-action-btn edit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit2 size={13} strokeWidth={1.75} />
                    Edit
                  </Link>
                  <div className="addr-action-sep" />
                  <button
                    className="addr-action-btn remove"
                    onClick={(e) => handleDelete(e, addr._id)}
                    disabled={deleteLoading === addr._id}
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                    {deleteLoading === addr._id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new address */}
        <Link to="/address-form" className="addr-add-btn">
          <Plus size={16} strokeWidth={2} />
          Add new address
        </Link>

        {/* Proceed CTA */}
        {addresses.length > 0 && (
          <button className="addr-proceed-btn" disabled={!selected}>
            Deliver here
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        )}

      </div>
    </>
  );
};

export default ShippingAddressPage;