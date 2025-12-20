import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, X } from "lucide-react";

const AddReviewModal = ({ isOpen, onClose, productId }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto px-4 py-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">

        {/* ❌ Close Button (Always Visible) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/80 hover:bg-black text-white rounded-full p-2"
        >
          <X size={18} />
        </button>

        {/* Content Wrapper */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-6">
            Write a Review
          </h2>

          {/* ⭐ Rating */}
          <div className="mb-5">
            <p className="text-center text-gray-600 text-sm mb-2">Rating</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-7 h-7 cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.383-2.454a1 1 0 00-1.175 0l-3.383 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Review title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-full px-4 py-2.5 text-sm"
            />
          </div>

          {/* Review */}
          <div className="mb-4">
            <textarea
              rows={4}
              className="w-full border rounded-xl p-3 text-sm resize-none"
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          {/* Upload */}
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl cursor-pointer text-gray-500 hover:bg-gray-50">
              <Upload size={28} />
              <span className="text-xs mt-1">Add image or video</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => setMediaFiles([...e.target.files])}
                className="hidden"
              />
            </label>
          </div>

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {mediaFiles.map((file, i) =>
                file.type.startsWith("image") ? (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <video
                    key={i}
                    src={URL.createObjectURL(file)}
                    className="w-16 h-16 rounded-lg"
                    controls
                  />
                )
              )}
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-full"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
