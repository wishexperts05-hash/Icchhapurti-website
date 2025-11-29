import { useEffect, useState } from 'react';
import { Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});

  const [page, setPage] = useState(1);
  const limit = 4;

  // API CALLS
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get token from localStorage
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWYxNTQ5YmFjZmM4MGY0OGEzNzMwNiIsImlhdCI6MTc2MzY0NDc0NiwiZXhwIjoxNzY2MjM2NzQ2fQ.jDIJvr4OiTUhBOGuc_YAI7bFg29dw0Clah2z7XRZSwo"

      if (!token) {
        setError("Please login to view wallet");
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch balance
      const balanceRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
        { headers }
      );


      console.log(balanceRes, "balanceRes")
      if (!balanceRes.ok) {
        throw new Error('Failed to fetch balance');
      }

      const balanceData = await balanceRes.json();
      setBalance(balanceData.data || 0);

      // Fetch transactions
      const txRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getAllTransactions?page=${page}&limit=${limit}`,
        { headers }
      );

      if (!txRes.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const txData = await txRes.json();

      setTransactions(txData.data || []);

      // Set pagination info if available
      if (txData.pagination) {
        setPagination(txData.pagination);
      }

    } catch (err) {
      console.error("Error loading wallet:", err);
      setError(err.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [page]);

  const handlePreviousPage = () => {
    if (pagination.isPreviousPage) {
      setPage(p => p - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.isNextPage) {
      setPage(p => p + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        <h1 className="text-white font-bold text-xl mb-4">Wallet</h1>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-xl p-6 mb-4 shadow-lg border border-red-700/40">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
              <Wallet size={24} className="text-white" />
            </div>
            <p className="text-amber-400 text-sm">Available Balance</p>
            <h2 className="text-white text-3xl font-bold mb-4">
              ₹ {formatAmount(balance)}
            </h2>

            <Link
              to="/reedem"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-2 rounded-full font-semibold shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              Redeem
            </Link>
          </div>
        </div>

        <div className="text-center mb-4">
          <Link
            to="/reedem-history"
            className="text-amber-400 text-sm hover:text-amber-300 transition-colors"
          >
            See Redeem History
          </Link>
        </div>

        {/* Transaction History */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Transaction History</h2>
          {pagination.totalItems > 0 && (
            <span className="text-gray-400 text-sm">
              {pagination.totalItems} transactions
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm mt-2">Loading transactions...</p>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="text-center py-10 bg-slate-800/30 rounded-lg">
            <Wallet size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No Transactions Found</p>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <>
            <div className="space-y-1 mb-6">
              {transactions.map((tx) => {
                const isCredit = tx.type?.toLowerCase().includes("credit") ||
                  tx.type?.toLowerCase().includes("credited");

                return (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between py-3 border-b border-slate-700/40 px-3 rounded hover:bg-slate-800/20 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-semibold">
                        {tx.type || 'Transaction'}
                      </h3>
                      {tx.reason && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          {tx.reason}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(tx.date || tx.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isCredit ? "text-green-400" : "text-red-400"
                        }`}>
                        {isCredit ? "+" : "-"} ₹ {formatAmount(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  disabled={!pagination.isPreviousPage}
                  onClick={handlePreviousPage}
                  className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    Page {pagination.currentPage}
                  </span>
                  <span className="text-gray-400 text-sm">
                    of {pagination.totalPages}
                  </span>
                </div>

                <button
                  disabled={!pagination.isNextPage}
                  onClick={handleNextPage}
                  className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}