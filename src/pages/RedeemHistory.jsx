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
  const token = localStorage.getItem("token")

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
        <div className="  relative overflow-hidden">
            {/* Cosmic background and header omitted for brevity, keep your original UI */}
           <div className="relative z-10 bg-white max-w-4xl mx-auto p-4 text-slate-900">

  {/* Title */}
  <h1 className="font-bold text-xl mb-6 text-slate-900">
    Redeem History
  </h1>

  {/* Tabs */}
  <div className="relative mb-6">
    <div className="flex border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            setCurrentPage(1);
          }}
          className={`flex-1 py-3 text-center text-sm font-medium transition-all relative
            ${
              activeTab === tab.id
                ? "text-amber-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
        >
          {tab.label}

          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          )}
        </button>
      ))}
    </div>
  </div>

  {/* Content */}
  <div className="space-y-1">

    {/* Loading */}
    {loading && (
      <div className="text-center py-10 text-slate-500 text-sm">
        Loading {activeTab} redemptions...
      </div>
    )}

    {/* Error */}
    {error && !loading && (
      <div className="text-center py-10 text-rose-600 text-sm">
        {error}
      </div>
    )}

    {/* Items */}
    {!loading &&
      !error &&
      filteredItems.map((item) => {
        const statusColor =
          activeTab === "approved"
            ? "text-emerald-600"
            : activeTab === "pending"
            ? "text-amber-600"
            : "text-rose-600";

        return (
          <div
            key={item._id}
            className="flex items-center justify-between py-4 px-2 border-b border-slate-200 hover:bg-slate-50 transition-colors rounded"
          >
            <div>
              <p className={`text-xs font-medium ${statusColor}`}>
                {item.adminApprovalStatus ||
                  item.subAdminApprovalStatus}
              </p>
              <p className="text-slate-500 text-xs">
                {item.date}
              </p>
            </div>

            <div className="text-slate-900 text-sm font-semibold">
              ₹ {item.amount}
            </div>
          </div>
        );
      })}

    {/* Empty */}
    {!loading && !error && filteredItems.length === 0 && (
      <div className="text-center py-10 text-slate-500">
        No {activeTab} redemptions found
      </div>
    )}
  </div>

  {/* Pagination */}
  {!loading && !error && filteredItems.length > 0 && (
    <div className="flex items-center justify-center gap-2 mt-8">

      <button
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center transition-colors"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${
                page === currentPage
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 flex items-center justify-center transition-colors"
        onClick={() =>
          setCurrentPage((p) => Math.min(totalPages, p + 1))
        }
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
