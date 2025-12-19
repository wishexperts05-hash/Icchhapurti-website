import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddReviewModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/products/productById/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.success) setProduct(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [isOpen, productId]);

  /* ---------------- SUBMIT REVIEW ---------------- */
  const submitReview = async () => {
    if (!review.trim()) return alert("Please write your review");

    setLoading(true);
    try {
      const payload = {
        productId,
        stars: rating,
        comment: review,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/reviews/createOrUpdate`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        alert("Review submitted successfully");
        onClose();
      }
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ SAFE CONDITIONAL RENDER */
  if (!isOpen) return null;

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed  inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 p-2 rounded-full"
        >
          <X className="text-white" size={18} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">
          Add Review
        </h2>

        {product && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src={product.images?.[0]}
              className="w-14 h-14 rounded-md object-cover"
              alt={product.name}
            />
            <p className="font-semibold">{product.name}</p>
          </div>
        )}

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              className={`w-8 h-8 cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.383-2.454a1 1 0 00-1.175 0l-3.383 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          ))}
        </div>

        <textarea
          className="w-full h-28 border rounded-md p-3 mb-5"
          placeholder="Share your experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={submitReview}
          className="w-full bg-[#C8AC5B] hover:bg-yellow-600 text-white font-semibold py-3 rounded-md"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default AddReviewModal;
