import { useEffect, useState } from "react";
import axios from "axios";
import { Wallet } from "lucide-react";

export default function RedeemPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  //   const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);


  const token = localStorage.getItem("token")
  const fetchBalance = async () => {
    try {
      //   const { data } = await axios.get(`/api/wallet/balance/${user._id}`);
      //   setBalance(data.balance || 0);


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


    } catch (err) {
      console.log("Balance fetch failed:", err);
    }
  };

  //   const fetchTransactions = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `/api/wallet/transactions/${user._id}`
  //       );
  //       setTransactions(data.transactions || []);
  //     } catch (err) {
  //       console.log("Transaction fetch failed:", err);
  //     }
  //   };

  const handleRedeem = async () => {
    if (!amount) return alert("Enter redeem amount");
    if (Number(amount) > balance) return alert("Not enough balance!");


    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/redeemHistory/redeem`,
        {
          // userId: user._id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(data.message || "Redeem success!");
      setAmount("");
      fetchBalance();
      // fetchTransactions();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Redeem failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className=" bg-white max-w-4xl mx-auto relative overflow-hidden p-4 text-slate-900">

  {/* Page Title */}
  <h1 className="font-bold text-xl mb-4 text-slate-900">
    Redeem
  </h1>

  {/* Wallet Card */}
  <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 mb-4 shadow-lg border border-amber-200">
    <div className="flex flex-col items-center">

      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-3 shadow">
        <Wallet className="text-white" size={24} />
      </div>

      <p className="text-slate-600 text-sm mb-1">
        Available Balance
      </p>

      <h2 className="text-slate-900 text-3xl font-bold mb-4">
        ₹ {balance.toFixed(2)}
      </h2>

      <button
        disabled={loading}
        onClick={handleRedeem}
        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-2 rounded-full font-semibold transition-all shadow disabled:opacity-60"
      >
        {loading ? "Processing..." : "Redeem"}
      </button>
    </div>
  </div>

  {/* Redeem Amount */}
  <div className="flex flex-col sm:flex-row items-end gap-6 w-full py-6">

    <div className="flex-1 w-full">
      <label className="block text-slate-700 text-sm mb-2 font-medium">
        Enter Redeem Amount
      </label>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-slate-50 rounded-md py-3 px-4 text-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
        type="number"
        placeholder="₹ 1000"
      />
    </div>

    <button
      onClick={handleRedeem}
      disabled={loading}
      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-md px-10 py-3 transition shadow disabled:opacity-60"
    >
      {loading ? "Loading..." : "Redeem Now"}
    </button>
  </div>

</div>

  );
}
