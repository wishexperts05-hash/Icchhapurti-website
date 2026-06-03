import { useState, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react';

export default function ProductImageGallery({ images = [], videos = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [imgError, setImgError] = useState({});
  const touchStartX = useRef(null);

  const allMedia = [
    ...images.map(img => ({ type: 'image', url: img })),
    ...videos.map(vid => ({ type: 'video', url: vid })),
  ];
  const media = allMedia.length > 0
    ? allMedia
    : [{ type: 'image', url: 'https://via.placeholder.com/600x600?text=No+Image' }];

  const go = useCallback((dir, inModal = false) => {
    if (inModal) {
      setModalIndex(p => (p + dir + media.length) % media.length);
    } else {
      setSelectedIndex(p => (p + dir + media.length) % media.length);
    }
  }, [media.length]);

  /* swipe support */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e, inModal = false) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1, inModal);
    touchStartX.current = null;
  };

  const openModal = (i) => { setModalIndex(i); setIsModalOpen(true); };
  const current = media[selectedIndex];
  const modalMedia = media[modalIndex];

  return (
    <>
      <style>{`
        .pgg-thumb::-webkit-scrollbar { display: none; }
        .pgg-thumb {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          width: 100%;
          max-width: 100%;
          padding: 10px 0 4px;
          margin-top: 2px;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pgg-fade-in { animation: pgg-fade .25s ease; }
        @keyframes pgg-fade { from { opacity: 0; } to { opacity: 1; } }
        .pgg-arrow { transition: background .18s, transform .18s; }
        .pgg-arrow:hover { background: rgba(0,0,0,0.55) !important; transform: translateY(-50%) scale(1.08); }
        .pgg-thumb-item {
          flex-shrink: 0;
          width: 68px;
          height: 68px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: opacity .18s, transform .18s;
        }
        .pgg-thumb-item:hover { opacity: 1 !important; transform: translateY(-2px); }
        @media(max-width: 768px) {
          .pgg-thumb-item {
            width: 50px;
            height: 50px;
          }
        }
        .pgg-fraction-badge {
          display: none;
        }
        .pgg-fraction-badge.show-desktop {
          display: block;
        }
        @media (max-width: 768px) {
          .pgg-fraction-badge {
            display: block !important;
          }
        }
      `}</style>

      {/* ── Main viewer ── */}
      <div
        style={{ position: 'relative', width: '100%', userSelect: 'none' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Image / Video */}
        <div
          className="pgg-fade-in"
          key={selectedIndex}
          style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
        >
          {current.type === 'image' ? (
            <img
              src={imgError[selectedIndex] ? 'https://via.placeholder.com/600x600?text=No+Image' : current.url}
              alt={`Product ${selectedIndex + 1}`}
              loading="eager"
              onError={() => setImgError(p => ({ ...p, [selectedIndex]: true }))}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                display: 'block',
                cursor: 'zoom-in',
              }}
              onClick={() => openModal(selectedIndex)}
            />
          ) : (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#000' }}>
              <video
                src={current.url}
                controls
                controlsList="nodownload"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
              <span style={{
                position: 'absolute', top: 10, left: 10, background: '#E53E3E',
                color: '#fff', padding: '3px 10px', borderRadius: 99,
                fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
                display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none',
              }}>
                <Play size={10} fill="#fff" /> VIDEO
              </span>
            </div>
          )}

          {/* Zoom hint overlay */}
          {current.type === 'image' && (
            <div
              onClick={() => openModal(selectedIndex)}
              style={{
                position: 'absolute', inset: 0, cursor: 'zoom-in',
                background: 'rgba(0,0,0,0)', transition: 'background .2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
            >
              <div style={{
                background: 'rgba(0,0,0,0.5)', color: '#fff',
                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: 0, transition: 'opacity .2s',
              }}
                className="pgg-zoom-hint"
              >
                <ZoomIn size={14} /> Click to zoom
              </div>
            </div>
          )}
        </div>

        {/* Prev / Next arrows (only when multiple) */}
        {media.length > 1 && (
          <>
            <button
              className="pgg-arrow"
              onClick={() => go(-1)}
              style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)', border: 'none',
                color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 5,
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="pgg-arrow"
              onClick={() => go(1)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.35)', border: 'none',
                color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 5,
              }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {media.length > 1 && media.length <= 8 && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6, zIndex: 5,
          }}>
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                style={{
                  width: i === selectedIndex ? 18 : 7,
                  height: 7, borderRadius: 99, border: 'none', cursor: 'pointer',
                  background: i === selectedIndex ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                  transition: 'all .25s', padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating Page Indicator */}
        {media.length > 1 && (
          <div
            className={`pgg-fraction-badge ${media.length > 8 ? 'show-desktop' : ''}`}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              zIndex: 5,
              pointerEvents: 'none',
              letterSpacing: '0.05em',
            }}
          >
            {selectedIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {media.length > 1 && (
        <div className="pgg-thumb">
          {media.map((m, i) => (
            <div
              key={i}
              className="pgg-thumb-item"
              onClick={() => setSelectedIndex(i)}
              style={{
                opacity: selectedIndex === i ? 1 : 0.45,
                outline: selectedIndex === i ? '2px solid #C9A84C' : '2px solid transparent',
                outlineOffset: 2,
              }}
            >
              {m.type === 'image' ? (
                <img
                  src={m.url}
                  alt={`Thumb ${i + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/68x68?text=?'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#E53E3E99,#7B000099)' }} />
                  <Play size={20} color="#fff" style={{ position: 'relative', zIndex: 1 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Lightbox modal ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.97)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={e => onTouchEnd(e, true)}
        >
          {/* Top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px', zIndex: 10,
            background: 'linear-gradient(rgba(0,0,0,0.6),transparent)',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>
              {modalIndex + 1} / {media.length}
            </span>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: 'none',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Main media */}
          <div
            key={modalIndex}
            className="pgg-fade-in"
            style={{
              maxWidth: '92vw', maxHeight: '80vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {modalMedia.type === 'image' ? (
              <img
                src={modalMedia.url}
                alt={`Full ${modalIndex + 1}`}
                style={{
                  maxWidth: '92vw', maxHeight: '80vh',
                  objectFit: 'contain', display: 'block', borderRadius: 4,
                }}
                onError={e => { e.target.src = 'https://via.placeholder.com/800x800?text=No+Image'; }}
              />
            ) : (
              <video
                src={modalMedia.url}
                controls autoPlay
                controlsList="nodownload"
                style={{ maxWidth: '92vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 4 }}
              />
            )}
          </div>

          {/* Prev / Next */}
          {media.length > 1 && (
            <>
              <button
                onClick={() => go(-1, true)}
                style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .2s', zIndex: 10,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => go(1, true)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .2s', zIndex: 10,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {media.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 8, maxWidth: '88vw', overflowX: 'auto',
              background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)',
              borderRadius: 12, padding: '8px 12px',
            }}>
              {media.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setModalIndex(i)}
                  style={{
                    flexShrink: 0, width: 52, height: 52, borderRadius: 6,
                    overflow: 'hidden', cursor: 'pointer',
                    opacity: modalIndex === i ? 1 : 0.45,
                    outline: modalIndex === i ? '2px solid #C9A84C' : '2px solid transparent',
                    outlineOffset: 2, transition: 'all .2s',
                    transform: modalIndex === i ? 'scale(1.1)' : 'none',
                  }}
                >
                  {m.type === 'image' ? (
                    <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={16} color="#fff" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .pgg-zoom-hint { opacity: 0 !important; }
        div:hover > .pgg-zoom-hint { opacity: 1 !important; }
      `}</style>
    </>
  );
}