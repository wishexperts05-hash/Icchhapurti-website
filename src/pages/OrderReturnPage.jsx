import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const REASONS = [
  "Product damaged",
  "Wrong item delivered",
  "Missing accessories",
  "Not satisfied with quality",
  "Other"
];

const OrderReturnPage = () => {
  const { id } = useParams(); // PRODUCT or ORDER ID
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  const [selected, setSelected] = useState(REASONS[0]);
  const [reason, setReason] = useState("");

  const handleChange = (val) => {
    setSelected(val);
    if (val !== "Other") setReason("");
  };

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/orders/getOrderById/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setProduct(data.order);
      } catch (error) {
        console.log("Fetch Error:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const submitReturn = async () => {
    if (selected === "Other" && !reason.trim()) {
      alert("Please write your reason");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        orderId: id,
        reason: selected,
        comment: reason,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/orders/return`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      if (data.success) {
        alert("Return request submitted successfully!");
        navigate("/my-orders");
      }
    } catch (error) {
      console.log("Submit Return Error:", error);
      alert("Failed to submit return request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* UI Background Stars (same as your design)… */}

      <div className="min-h-screen flex flex-col px-4 pt-12 items-center">
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/20">
          
          {/* Dynamic Order Info */}
          {product ? (
            <>
              <h1 className="text-white text-2xl font-bold mb-1">
                Order #{product?.orderNumber || id}
              </h1>
              <p className="text-gray-300 text-sm">{product?.productName}</p>
              <p className="text-gray-400 text-xs mb-6">
                Delivered on: {new Date(product?.deliveredAt).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-gray-300 mb-6">Loading order details...</p>
          )}

          <h2 className="text-white text-lg font-semibold mb-2">Return Reason</h2>

          <div className="mb-2 text-white font-medium">Choose a Reason</div>

          <div className="flex flex-col gap-2 mb-6">
            {REASONS.map((item) => (
              <label key={item} className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="radio"
                  className="accent-[#C8AC5B] w-4 h-4"
                  checked={selected === item}
                  onChange={() => handleChange(item)}
                  name="returnReason"
                />
                {item}
              </label>
            ))}
          </div>

          <textarea
            className="w-full h-32 border border-white rounded-md p-4 text-black text-base mb-6"
            placeholder="Write a Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={selected !== "Other"}
          />

          <div className="flex justify-center">
            <button
              onClick={submitReturn}
              className="bg-[#C8AC5B] hover:bg-yellow-600 text-white font-semibold rounded-md px-12 py-3 text-lg transition disabled:opacity-60"
              disabled={loading || (selected === "Other" && reason.trim() === "")}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderReturnPage;
