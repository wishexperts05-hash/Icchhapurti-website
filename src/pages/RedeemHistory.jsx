import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RedeemHistory() {
    const [activeTab, setActiveTab] = useState('approved');
    const [currentPage, setCurrentPage] = useState(1);
    const [allItems, setAllItems] = useState([]); // all items fetched for page
    const [filteredItems, setFilteredItems] = useState([]); // after status filter
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const pageSize = 5;
    const tabs = [
        { id: 'pending', label: 'Pending' },
        { id: 'approved', label: 'Approved' },
        { id: 'rejected', label: 'Rejected' },
    ];

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWYxNTQ5YmFjZmM4MGY0OGEzNzMwNiIsImlhdCI6MTc2MzY0NDc0NiwiZXhwIjoxNzY2MjM2NzQ2fQ.jDIJvr4OiTUhBOGuc_YAI7bFg29dw0Clah2z7XRZSwo"

    useEffect(() => {
        const controller = new AbortController();
        async function fetchHistory() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/user/redeemHistory/getAllRedeemHistory?page=${currentPage}&limit=${pageSize}`,
                    {
                        signal: controller.signal,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error('Failed to load redeem history');
                const json = await res.json(); // { data: [], total: number }
                setAllItems(json.data || []);
                setTotal(json.total || 0);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
        return () => controller.abort();
    }, [currentPage]);

    // Filter items by activeTab status - map your activeTab to record status fields
    useEffect(() => {
        const mapTabToStatus = (tabId) => {
            switch (tabId) {
                case 'pending':
                    return 'Pending';
                case 'approved':
                    return 'Approved';
                case 'rejected':
                    return 'Rejected';
                default:
                    return '';
            }
        };
        const filterStatus = mapTabToStatus(activeTab);

        const filtered = allItems.filter(
            (item) =>
                item.adminApprovalStatus === filterStatus ||
                item.subAdminApprovalStatus === filterStatus
        );
        setFilteredItems(filtered);
    }, [activeTab, allItems]);

    return (
        <div className="min-h-screen  relative overflow-hidden">
            {/* Cosmic background and header omitted for brevity, keep your original UI */}
            <div className="relative z-10 max-w-7xl mx-auto p-4">
                <h1 className="text-white font-bold text-xl mb-6">Redeem History</h1>
                <div className="relative mb-6">
                    <div className="flex border-b border-slate-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCurrentPage(1);
                                }}
                                className={`flex-1 py-3 text-center text-sm font-medium transition-all duration-300 relative
                                    ${activeTab === tab.id
                                        ? 'text-amber-400'
                                        : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    {loading && (
                        <div className="text-center py-10 text-gray-400">
                            Loading {activeTab} redemptions...
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-10 text-red-400 text-sm">{error}</div>
                    )}

                    {!loading && !error && filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between py-4 border-b border-slate-700/50 hover:bg-slate-800/20 transition-colors px-2 rounded"
                        >
                            <div>
                                <p
                                    className={`text-xs ${activeTab === 'approved'
                                            ? 'text-green-400'
                                            : activeTab === 'pending'
                                                ? 'text-amber-400'
                                                : 'text-red-400'
                                        }`}
                                >
                                    {item.adminApprovalStatus || item.subAdminApprovalStatus}
                                </p>
                                <p className="text-gray-500 text-xs">{item.date}</p>
                            </div>
                            <div className="text-white text-sm font-semibold">₹ {item.amount}</div>
                        </div>
                    ))}

                    {!loading && !error && filteredItems.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            No {activeTab} redemptions found
                        </div>
                    )}
                </div>

                {!loading && !error && filteredItems.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-medium
                                ${page === currentPage
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
