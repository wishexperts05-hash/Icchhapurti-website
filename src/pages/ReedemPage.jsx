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


    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWYxNTQ5YmFjZmM4MGY0OGEzNzMwNiIsImlhdCI6MTc2MzY0NDc0NiwiZXhwIjoxNzY2MjM2NzQ2fQ.jDIJvr4OiTUhBOGuc_YAI7bFg29dw0Clah2z7XRZSwo"
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
        <div className="min-h-screen  relative overflow-hidden p-4">
            <h1 className="text-white font-bold text-xl mb-4">Redeem</h1>

            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-xl p-6 mb-4 shadow-2xl border border-red-700/50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                        <Wallet className="text-white" size={24} />
                    </div>

                    <p className="text-amber-400 text-sm mb-1">Available Balance</p>
                    <h2 className="text-white text-3xl font-bold mb-4">₹ {balance}</h2>

                    <button
                        disabled={loading}
                        onClick={handleRedeem}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                    >
                        {loading ? "Processing..." : "Redeem"}
                    </button>
                </div>
            </div>

            {/* Redeem Amount */}
            <div className="flex items-center justify-between gap-6 w-full py-6">
                <div className="flex-1">
                    <label className="block text-white text-sm mb-2">
                        Enter Redeem Amount
                    </label>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white rounded-md py-3 px-4 text-lg border-none outline-none"
                        type="number"
                        placeholder="₹ 1000"
                    />
                </div>

                <button
                    onClick={handleRedeem}
                    disabled={loading}
                    className="bg-[#C8AC5B] mt-5 hover:bg-yellow-600 text-white font-semibold rounded-md px-10 py-3 transition"
                >
                    {loading ? "Loading..." : "Redeem Now"}
                </button>
            </div>

            {/* Transaction History */}
            {/* <h2 className="text-white text-lg font-semibold mb-2">History</h2>
      <div className="space-y-3 max-h-[40vh] overflow-y-auto">
        {transactions.map((item) => (
          <div
            key={item._id}
            className={`p-4 rounded-lg shadow-md flex justify-between ${
              item.type === "credit"
                ? "bg-green-900/40 border border-green-600/50"
                : "bg-red-900/40 border border-red-600/50"
            }`}
          >
            <div>
              <p className="text-white font-semibold">{item.title}</p>
              <p className="text-gray-300 text-sm">{item.desc}</p>
              <p className="text-gray-400 text-xs">
                {item.date} | {item.time}
              </p>
            </div>

            <p
              className={`text-lg font-bold ${
                item.type === "credit" ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.type === "credit" ? "+" : "-"}₹{item.amount}
            </p>
          </div>
        ))}
      </div> */}
        </div>
    );
}
