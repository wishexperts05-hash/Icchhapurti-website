import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHeader } from '../context/HeaderContext';

export default function Notification() {
    const [activeTab, setActiveTab] = useState('unread');
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [markingAsRead, setMarkingAsRead] = useState({});
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();
    const itemsPerPage = 5;

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/notifications/get`,
                {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!res.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await res.json();
            const allNotifications = data.data || [];

            setNotifications(allNotifications);

        } catch (err) {
            console.error("Error fetching notifications:", err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const { setCount, setList, setUnreadCount, wishlistCount } = useHeader();

    const markAsRead = async (notificationId) => {
        try {
            setMarkingAsRead(prev => ({ ...prev, [notificationId]: true }));

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/notifications/markAsRead/${notificationId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!res.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update local state
            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif._id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            );
            const current = Number(localStorage.getItem("unreadCount")) || 0;
            const newCount = Math.max(0, current - 1);
            localStorage.setItem("unreadCount", newCount);

            setUnreadCount(newCount)
        } catch (err) {
            console.error("Error marking notification as read:", err);
        } finally {
            setMarkingAsRead(prev => ({ ...prev, [notificationId]: false }));
        }
    };

    const handleNotificationClick = async (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);

        // If notification is unread, mark it as read
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };


    const markAllAsRead = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/notifications/mark-all-read`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!res.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            await fetchNotifications();

        } catch (err) {
            console.error("Error marking all notifications as read:", err);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        const filtered = notifications.filter(notif => {
            if (activeTab === 'unread') {
                return notif.isRead === false;
            } else {
                return notif.isRead === true;
            }
        });

        const total = Math.ceil(filtered.length / itemsPerPage);
        setTotalPages(Math.max(total, 1));

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedNotifications = filtered.slice(startIndex, endIndex);

        setFilteredNotifications(paginatedNotifications);
    }, [notifications, activeTab, currentPage]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(p => Math.max(p - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(p => Math.min(p + 1, totalPages));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-blue-500/20 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-white font-bold text-xl">{t("notification.title")}</h1>
                </div>

                {/* Tabs */}
                <div className="relative mb-6">
                    <div className="flex border-b border-slate-700">
                        {[
                            { id: 'unread', label: t("notification.unread"), count: unreadCount },
                            { id: 'read', label: t("notification.read"), count: notifications.filter(n => n.isRead).length },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-1 py-3 text-center text-sm font-medium transition-all duration-300 relative 
                                    ${activeTab === tab.id ? 'text-amber-400' : 'text-gray-400 hover:text-gray-300'}`}
                            >
                                <span>{tab.label}</span>
                                {tab.count > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-slate-700 text-gray-400'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notification List */}
                <div className="space-y-1 min-h-[400px]">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">{t("home.loading")}</div>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => handleNotificationClick(item)}
                                className="flex items-center justify-between py-4 border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors px-2 rounded group cursor-pointer"
                            >
                                <div className="flex-1 pr-4">
                                    <h3 className="text-white text-sm font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                        {item.message}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(item.createdAt).toLocaleDateString("en-GB")}{" "}
                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>

                                    {!item.isRead && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item._id);
                                            }}
                                            disabled={markingAsRead[item._id]}
                                            className="p-2 rounded-full bg-slate-700 hover:bg-amber-500 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                                            title="Mark as read"
                                        >
                                            {markingAsRead[item._id] ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Check size={16} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            No {activeTab} notifications found
                        </div>
                    )}
                </div>

                {/* Pagination UI */}
                {filteredNotifications.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 rounded-full bg-amber-500 text-white font-medium">
                                {currentPage}
                            </button>
                            <span className="text-gray-400 text-sm px-2">of {totalPages}</span>
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Notification Details Modal */}
            {isModalOpen && selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-xl border border-gray-200">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="text-base font-semibold text-gray-800">
                                {selectedNotification.title}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-3 space-y-3">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                    {new Date(selectedNotification.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                                <span>
                                    {new Date(selectedNotification.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>

                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {selectedNotification.message}
                            </div>

                            {selectedNotification.isRead && (
                                <div className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                    <Check size={14} />
                                    <span>Read</span>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}