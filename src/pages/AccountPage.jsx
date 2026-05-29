import { useState } from 'react';
import {
  User, MapPin, Package, Gift, MessageCircle,
  ChevronRight, Share2, Copy, Check, X,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Add to your index.html:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

const styles = `
  .ac-page {
    font-family: 'DM Sans', sans-serif;
    background: #FAF6EE;
    max-width: 760px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
    min-height: 100vh;
    color: #1a1a1a;
  }

  /* ── Header ── */
  .ac-header {
    padding: 1.75rem 0 1.25rem;
    border-bottom: 0.5px solid #e8e2d4;
    margin-bottom: 1.75rem;
  }
  .ac-eyebrow {
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #BA7517;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .ac-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    margin: 0;
    color: #1a1a1a;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }

  /* ── Avatar card ── */
  .ac-avatar-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.125rem 1.25rem;
    border: 0.5px solid #e5ddd0;
    border-radius: 14px;
    background: #faf8f4;
    margin-bottom: 1.75rem;
    animation: fadeUp 0.28s ease both;
  }
  .ac-avatar-ring {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1.5px solid #EF9F27;
    padding: 2px;
    flex-shrink: 0;
  }
  .ac-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
  .ac-avatar-fallback {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #FAEEDA;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #BA7517;
  }
  .ac-user-name {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    margin: 0 0 2px;
  }
  .ac-user-sub {
    font-size: 12.5px;
    color: #999;
    font-weight: 300;
    margin: 0;
  }
  .ac-share-btn {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: #BA7517;
    background: #FAEEDA;
    border: 0.5px solid #FAC775;
    border-radius: 20px;
    padding: 5px 12px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ac-share-btn:hover { background: #FAC775; border-color: #EF9F27; }

  /* ── Section label ── */
  .ac-section-label {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #777;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  /* ── Menu ── */
  .ac-menu { display: flex; flex-direction: column; gap: 2px; margin-bottom: 1.5rem; }

  .ac-menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 0.875rem;
    border-radius: 10px;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s;
    animation: fadeUp 0.28s ease both;
    border: none;
    background: none;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .ac-menu-item:hover { background: #fffbf0; }
  .ac-menu-item.danger:hover { background: #fff5f5; }

  .ac-menu-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ac-menu-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: #faf8f4;
    border: 0.5px solid #e8e2d4;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
  }
  .ac-menu-item:hover .ac-menu-icon { background: #FAEEDA; border-color: #FAC775; }
  .ac-menu-item.danger:hover .ac-menu-icon { background: #fff0f0; border-color: #ffc5c5; }

  .ac-menu-label {
    font-size: 14.5px;
    font-weight: 400;
    color: #1a1a1a;
  }
  .ac-menu-item.danger .ac-menu-label { color: #c0392b; }

  .ac-menu-chevron {
    color: #ccc;
    transition: color 0.15s, transform 0.15s;
  }
  .ac-menu-item:hover .ac-menu-chevron { color: #BA7517; transform: translateX(2px); }
  .ac-menu-item.danger:hover .ac-menu-chevron { color: #e05252; }

  .ac-divider {
    height: 0.5px;
    background: #e8e2d4;
    margin: 0.75rem 0;
  }

  /* ── Modal overlay ── */
  .ac-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
    animation: fadeOverlay 0.18s ease;
  }
  @keyframes fadeOverlay {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .ac-modal {
    background: #fff;
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 560px;
    padding: 1.5rem 1.25rem 2.5rem;
    animation: slideUp 0.22s ease;
  }
  @keyframes slideUp {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .ac-modal-handle {
    width: 36px;
    height: 4px;
    background: #e5ddd0;
    border-radius: 2px;
    margin: 0 auto 1.25rem;
  }
  .ac-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }
  .ac-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
  .ac-modal-close {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 0.5px solid #e5ddd0;
    background: #faf8f4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #888;
    transition: background 0.15s;
  }
  .ac-modal-close:hover { background: #f0ebe1; color: #333; }

  /* Link copy row */
  .ac-link-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.75rem 1rem;
    border: 0.5px solid #e5ddd0;
    border-radius: 10px;
    background: #faf8f4;
    margin-bottom: 1.25rem;
  }
  .ac-link-text {
    flex: 1;
    font-size: 12.5px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 300;
  }
  .ac-copy-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    color: #BA7517;
    background: #FAEEDA;
    border: 0.5px solid #FAC775;
    border-radius: 7px;
    padding: 5px 10px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .ac-copy-btn:hover { background: #FAC775; }
  .ac-copy-btn.copied { color: #2e7d32; background: #e8f5e9; border-color: #a5d6a7; }

  /* Share via */
  .ac-share-label {
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #777;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  .ac-share-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .ac-share-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 1rem;
    border: 0.5px solid #e5ddd0;
    border-radius: 10px;
    background: #faf8f4;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 400;
    color: #1a1a1a;
    transition: border-color 0.15s, background 0.15s;
    text-align: left;
    width: 100%;
  }
  .ac-share-option:hover { border-color: #EF9F27; background: #fffbf0; }
  .ac-share-option svg { flex-shrink: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function AccountPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/?ref=${user?.referralCode || user?._id || 'default'}`;

  const initials = (user?.name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const menuItems = [
    { link: '/view-profile', icon: User, label: 'Profile' },
    { link: '/addresses', icon: MapPin, label: 'Shipping Address' },
    { link: '/orders', icon: Package, label: 'My Orders' },
    { link: '/refer-programme', icon: Gift, label: 'Referral Program' },
    { link: '/chat-support', icon: MessageCircle, label: 'Chat Support' },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join me!', text: 'Use my referral link 🎁', url: referralLink });
      } catch (e) {
        if (e.name !== 'AbortError') setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  const shareVia = (url) => window.open(url, '_blank');
  const wa = () => shareVia(`https://wa.me/?text=${encodeURIComponent('Join me! 🎁\n' + referralLink)}`);
  const tg = () => shareVia(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me! 🎁')}`);
  const fb = () => shareVia(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`);
  const tw = () => shareVia(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me! 🎁')}`);

  return (
    <>
      <style>{styles}</style>
      <div className="ac-page">

        {/* Header */}
        <div className="ac-header">
          <div className="ac-eyebrow">My account</div>
          <h1 className="ac-title">Account</h1>
        </div>

        {/* Avatar card */}
        <div className="ac-avatar-card">
          <div className="ac-avatar-ring">
            {user?.profileImage
              ? <img src={user.profileImage} alt={user.name} className="ac-avatar-img" />
              : <div className="ac-avatar-fallback">{initials}</div>
            }
          </div>
          <div>
            <p className="ac-user-name">{user?.name || 'Guest'}</p>
            <p className="ac-user-sub">{user?.email || 'No email on file'}</p>
          </div>
          <button className="ac-share-btn" onClick={handleShare}>
            <Share2 size={12} strokeWidth={2} />
            Refer
          </button>
        </div>

        {/* Menu */}
        <div className="ac-section-label">Navigation</div>
        <div className="ac-menu">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="ac-menu-item"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="ac-menu-left">
                <div className="ac-menu-icon">
                  <item.icon size={16} strokeWidth={1.75} color="#BA7517" />
                </div>
                <span className="ac-menu-label">{item.label}</span>
              </div>
              <ChevronRight size={16} strokeWidth={1.75} className="ac-menu-chevron" />
            </Link>
          ))}

          <div className="ac-divider" />

          <button
            className="ac-menu-item danger"
            style={{ animationDelay: `${menuItems.length * 0.05}s` }}
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          >
            <div className="ac-menu-left">
              <div className="ac-menu-icon">
                <LogOut size={16} strokeWidth={1.75} color="#c0392b" />
              </div>
              <span className="ac-menu-label">Log out</span>
            </div>
            <ChevronRight size={16} strokeWidth={1.75} className="ac-menu-chevron" />
          </button>
        </div>

      </div>

      {/* Share modal — bottom sheet */}
      {showShareModal && (
        <div className="ac-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>
            <div className="ac-modal-handle" />

            <div className="ac-modal-header">
              <h2 className="ac-modal-title">Share your link</h2>
              <button className="ac-modal-close" onClick={() => setShowShareModal(false)}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Copy row */}
            <div className="ac-link-row">
              <span className="ac-link-text">{referralLink}</span>
              <button
                className={`ac-copy-btn${copied ? ' copied' : ''}`}
                onClick={copyToClipboard}
              >
                {copied
                  ? <><Check size={12} strokeWidth={2.5} /> Copied</>
                  : <><Copy size={12} strokeWidth={2} /> Copy</>
                }
              </button>
            </div>

            {/* Share via */}
            <div className="ac-share-label">Share via</div>
            <div className="ac-share-grid">
              <button className="ac-share-option" onClick={wa}>
                <svg width="20" height="20" fill="#25D366" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>

              <button className="ac-share-option" onClick={tg}>
                <svg width="20" height="20" fill="#229ED9" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.098.155.23.171.324.016.093.036.306.02.472z" />
                </svg>
                Telegram
              </button>

              <button className="ac-share-option" onClick={fb}>
                <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>

              <button className="ac-share-option" onClick={tw}>
                <svg width="20" height="20" fill="#1DA1F2" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter / X
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}