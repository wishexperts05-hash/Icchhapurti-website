import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Bell, BellOff, CheckCheck, Clock, Inbox } from 'lucide-react';
import { useHeader } from '../context/HeaderContext';

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

/* ─── Helpers ─── */
const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
};

/* ─── Skeleton loader ─── */
const Skeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F3EDE3', flexShrink: 0, animation: 'notif-shimmer 1.5s infinite' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ height: 14, width: '60%', borderRadius: 6, background: '#F3EDE3', animation: 'notif-shimmer 1.5s infinite' }} />
                    <div style={{ height: 11, width: '90%', borderRadius: 6, background: '#F3EDE3', animation: 'notif-shimmer 1.5s infinite' }} />
                    <div style={{ height: 11, width: '70%', borderRadius: 6, background: '#F3EDE3', animation: 'notif-shimmer 1.5s infinite' }} />
                </div>
            </div>
        ))}
    </div>
);

/* ─── Empty state ─── */
const EmptyState = ({ tab }) => (
    <div style={{ textAlign: 'center', padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: GOLD_PALE, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
            {tab === 'unread' ? <Bell size={28} color={GOLD} /> : <BellOff size={28} color={MUTED} />}
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: DEEP }}>
            {tab === 'unread' ? 'All caught up!' : 'Nothing here yet'}
        </p>
        <p style={{ fontSize: 13, color: MUTED, maxWidth: 260 }}>
            {tab === 'unread'
                ? 'You have no unread notifications. Check back later.'
                : 'Notifications you ve read will appear here.'}
        </p>
    </div>
);

/* ─── Notification Detail Modal ─── */
const NotifModal = ({ notification, onClose }) => {
    if (!notification) return null;
    return (
        <>
            <style>{`
        @keyframes notif-modal-in {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
            <div
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(26,18,9,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460,
                        boxShadow: '0 24px 64px rgba(26,18,9,0.25)',
                        animation: 'notif-modal-in .25s ease',
                        fontFamily: "'DM Sans', sans-serif", overflow: 'hidden',
                    }}
                >
                    {/* Top accent bar */}
                    <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` }} />

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: `1px solid ${BORDER}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: GOLD_PALE, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                <Bell size={18} color={GOLD} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 17, fontWeight: 700, color: DEEP, lineHeight: 1.3, marginBottom: 4 }}>
                                    {notification.title}
                                </h2>
                                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: MUTED }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={11} /> {formatDate(notification.createdAt)}
                                    </span>
                                    <span>{formatTime(notification.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3EDE3', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                        >
                            <X size={15} color={MUTED} />
                        </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px 24px' }}>
                        <p style={{ fontSize: 14, color: INK, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                            {notification.message}
                        </p>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '12px 24px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {notification.isRead ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: GREEN, background: '#EDF7F1', border: '1px solid rgba(39,98,58,0.2)', borderRadius: 99, padding: '4px 12px' }}>
                                <Check size={12} /> Read
                            </span>
                        ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: GOLD, background: GOLD_PALE, border: `1px solid ${BORDER}`, borderRadius: 99, padding: '4px 12px' }}>
                                <Bell size={12} /> New
                            </span>
                        )}
                        <button
                            onClick={onClose}
                            style={{ background: GOLD, color: DEEP, border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '.02em' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ─── Notification Row ─── */
const NotifRow = ({ item, onRead, onOpen, marking }) => (
    <div
        onClick={() => onOpen(item)}
        style={{
            background: '#fff',
            border: `1px solid ${item.isRead ? BORDER : 'rgba(201,168,76,0.5)'}`,
            borderLeft: `3px solid ${item.isRead ? 'transparent' : GOLD}`,
            borderRadius: 12,
            padding: '16px 18px',
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            cursor: 'pointer',
            transition: 'box-shadow .2s, border-color .2s',
            position: 'relative',
        }}
        className="notif-row"
    >
        {/* Avatar / icon */}
        <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: item.isRead ? '#F3EDE3' : GOLD_PALE,
            border: `1px solid ${item.isRead ? BORDER : GOLD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <Bell size={17} color={item.isRead ? MUTED : GOLD} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: item.isRead ? 500 : 700, color: DEEP, lineHeight: 1.4 }}>
                    {item.title}
                </h3>
                <span style={{ fontSize: 11, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {timeAgo(item.createdAt)}
                </span>
            </div>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.message}
            </p>
        </div>

        {/* Mark as read button */}
        {!item.isRead && (
            <button
                onClick={e => { e.stopPropagation(); onRead(item._id); }}
                disabled={marking}
                title="Mark as read"
                style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: GOLD_PALE, border: `1px solid ${BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: marking ? 'not-allowed' : 'pointer', flexShrink: 0,
                    transition: 'background .2s', opacity: marking ? 0.6 : 1,
                }}
                className="notif-read-btn"
            >
                {marking
                    ? <div style={{ width: 12, height: 12, border: `2px solid ${GOLD}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'notif-spin 1s linear infinite' }} />
                    : <Check size={13} color={GOLD} />
                }
            </button>
        )}
    </div>
);

/* ─── Main Component ─── */
export default function Notification() {
    const [activeTab, setActiveTab] = useState('unread');
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [markingAsRead, setMarkingAsRead] = useState({});
    const [markingAll, setMarkingAll] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
        const { setUnreadCount } = useHeader();
    const itemsPerPage = 6;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/get`, {
                headers: { Authorization: localStorage.getItem('token'), 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setNotifications(data.data || []);
        } catch (err) {
            console.error(err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            setMarkingAsRead(prev => ({ ...prev, [notificationId]: true }));
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/markAsRead/${notificationId}`, {
                method: 'PUT',
                headers: { Authorization: localStorage.getItem('token'), 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Failed to mark as read');
            setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
            const current = Number(localStorage.getItem('unreadCount')) || 0;
            const next = Math.max(0, current - 1);
            localStorage.setItem('unreadCount', next);
            setUnreadCount(next);
        } catch (err) {
            console.error(err);
        } finally {
            setMarkingAsRead(prev => ({ ...prev, [notificationId]: false }));
        }
    };

    const markAllAsRead = async () => {
        try {
            setMarkingAll(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/mark-all-read`, {
                method: 'PUT',
                headers: { Authorization: localStorage.getItem('token'), 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Failed to mark all as read');
            await fetchNotifications();
            localStorage.setItem('unreadCount', 0);
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        } finally {
            setMarkingAll(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
        if (!notification.isRead) await markAsRead(notification._id);
    };

    const closeModal = () => { setIsModalOpen(false); setSelectedNotification(null); };

    useEffect(() => {
        const filtered = notifications.filter(n => activeTab === 'unread' ? !n.isRead : n.isRead);
        setTotalPages(Math.max(Math.ceil(filtered.length / itemsPerPage), 1));
        const start = (currentPage - 1) * itemsPerPage;
        setFilteredNotifications(filtered.slice(start, start + itemsPerPage));
    }, [notifications, activeTab, currentPage]);

    useEffect(() => { fetchNotifications(); }, []);

    const handleTabChange = (id) => { setActiveTab(id); setCurrentPage(1); };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const readCount = notifications.filter(n => n.isRead).length;

    const TABS = [
        { id: 'unread', label: 'Unread', count: unreadCount },
        { id: 'read', label: 'Read', count: readCount },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: ${CREAM}; }
        @keyframes notif-shimmer {
          0%,100% { opacity: 1; } 50% { opacity: .45; }
        }
        @keyframes notif-spin { to { transform: rotate(360deg); } }
        .notif-row:hover {
          box-shadow: 0 4px 20px rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.5) !important;
        }
        .notif-read-btn:hover { background: ${GOLD} !important; }
        .notif-read-btn:hover svg { color: #fff !important; }
        .notif-tab-btn { transition: color .2s; }
        .notif-tab-btn:hover { color: ${GOLD} !important; }
        .notif-pg-btn:hover:not(:disabled) { border-color: ${GOLD} !important; color: ${GOLD} !important; }
        @media(max-width:600px){
          .notif-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .notif-mark-all { width: 100% !important; justify-content: center !important; }
        }
      `}</style>

            {/* Announcement bar */}
            <div style={{ background: DEEP, color: GOLD_LIGHT, textAlign: 'center', fontSize: 12, padding: '9px 16px', letterSpacing: '.06em', fontWeight: 500 }}>
                🌟 Stay aligned — your notifications keep you on track
            </div>

            <div style={{ minHeight: '100vh', background: CREAM, paddingBottom: 60 }}>
                <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>

                    {/* Page header */}
                    <div className="notif-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                        <div>
                            <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 6 }}>
                                Your Updates
                            </p>
                            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600, color: DEEP, lineHeight: 1.1 }}>
                                Notifications
                            </h1>
                        </div>

                        {/* {unreadCount > 0 && (
                            <button
                                className="notif-mark-all"
                                onClick={markAllAsRead}
                                disabled={markingAll}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'transparent', border: `1.5px solid ${BORDER}`,
                                    color: MUTED, borderRadius: 8, padding: '10px 18px',
                                    fontSize: 13, fontWeight: 500, cursor: markingAll ? 'not-allowed' : 'pointer',
                                    opacity: markingAll ? 0.6 : 1, transition: 'border-color .2s, color .2s',
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                {markingAll
                                    ? <div style={{ width: 14, height: 14, border: `2px solid ${GOLD}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'notif-spin 1s linear infinite' }} />
                                    : <CheckCheck size={15} />
                                }
                                Mark all as read
                            </button>
                        )} */}
                    </div>

                    {/* Summary chips */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 99, padding: '6px 16px', fontSize: 13, color: DEEP, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Bell size={14} color={GOLD} />
                            <strong>{unreadCount}</strong> unread
                        </div>
                        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 99, padding: '6px 16px', fontSize: 13, color: DEEP, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Check size={14} color={GREEN} />
                            <strong>{readCount}</strong> read
                        </div>
                        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 99, padding: '6px 16px', fontSize: 13, color: DEEP, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Inbox size={14} color={MUTED} />
                            <strong>{notifications.length}</strong> total
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, gap: 4, marginBottom: 20 }}>
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className="notif-tab-btn"
                                onClick={() => handleTabChange(tab.id)}
                                style={{
                                    flex: 1, padding: '10px 16px', borderRadius: 7, border: 'none',
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    transition: 'all .2s',
                                    background: activeTab === tab.id ? GOLD : 'transparent',
                                    color: activeTab === tab.id ? DEEP : MUTED,
                                }}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, borderRadius: 99, padding: '2px 7px',
                                        background: activeTab === tab.id ? 'rgba(26,18,9,0.15)' : GOLD_PALE,
                                        color: activeTab === tab.id ? DEEP : GOLD,
                                    }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <Skeleton />
                    ) : filteredNotifications.length === 0 ? (
                        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16 }}>
                            <EmptyState tab={activeTab} />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {filteredNotifications.map(item => (
                                <NotifRow
                                    key={item._id}
                                    item={item}
                                    onRead={markAsRead}
                                    onOpen={handleNotificationClick}
                                    marking={!!markingAsRead[item._id]}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && filteredNotifications.length > 0 && totalPages > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                            <button
                                className="notif-pg-btn"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    border: `1.5px solid ${BORDER}`, background: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === 1 ? 0.4 : 1, transition: 'all .2s',
                                    color: MUTED,
                                }}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                                <button
                                    key={pg}
                                    onClick={() => setCurrentPage(pg)}
                                    style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        background: pg === currentPage ? GOLD : '#fff',
                                        border: `1.5px solid ${pg === currentPage ? GOLD : BORDER}`,
                                        color: pg === currentPage ? DEEP : MUTED,
                                        fontWeight: pg === currentPage ? 700 : 400,
                                        fontSize: 14, cursor: 'pointer',
                                        transform: pg === currentPage ? 'scale(1.08)' : 'none',
                                        transition: 'all .2s',
                                    }}
                                >
                                    {pg}
                                </button>
                            ))}

                            <button
                                className="notif-pg-btn"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    border: `1.5px solid ${BORDER}`, background: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === totalPages ? 0.4 : 1, transition: 'all .2s',
                                    color: MUTED,
                                }}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal */}
            {isModalOpen && <NotifModal notification={selectedNotification} onClose={closeModal} />}
        </>
    );
}