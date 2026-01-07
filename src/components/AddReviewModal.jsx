import React, { useState } from "react";
import axios from "axios";
import { Upload, X } from "lucide-react";

const MAX_FILES = 5;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];

const AddReviewModal = ({ isOpen, onClose,fetchProductReviews, productId }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const token = localStorage.getItem("token");

  // 📤 Media Upload Validation
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + mediaFiles.length > MAX_FILES) {
      alert("You can upload a maximum of 5 files.");
      return;
    }

    const invalidFile = files.find(
      (file) =>
        ![...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(file.type)
    );

    if (invalidFile) {
      alert("Only PNG, JPG, JPEG images and MP4 videos are allowed.");
      return;
    }

    setMediaFiles((prev) => [...prev, ...files]);
  };

  // ❌ Remove Media
  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  // 📩 Submit Review
 const handleSubmit = async () => {
  const hasRating = !!rating;
  const hasTitle = title?.trim().length > 0;
  const hasReview = review?.trim().length > 0;
  const hasImages = mediaFiles && mediaFiles.length > 0;

  if (!hasRating && !hasTitle && !hasReview && !hasImages) {
    alert("Please fill at least one field (rating, title, review, or image).");
    return;
  }

  const formData = new FormData();
  if (rating) formData.append("stars", rating);
  if (title) formData.append("title", title);
  if (review) formData.append("comment", review);
  formData.append("productId", productId);

  mediaFiles.forEach((file) => {
    formData.append("images", file);
  });

 try {
  setLoading(true);

  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/user/reviews/createOrUpdate`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("✅ Review submitted successfully!");
  fetchProductReviews();
  onClose();

} catch (error) {
  console.error("Review submit error:", error);

  let message = "Something went wrong. Please try again.";

  if (error.response) {
    // Server responded with status code
    message =
      error.response.data?.message ||
      error.response.data?.error ||
      `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request sent but no response
    message = "Server not responding. Please check your internet connection.";
  } else {
    // Something else happened
    message = error.message;
  }

  alert(`❌ ${message}`);

} finally {
  setLoading(false);
}

};


  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto px-4 py-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white rounded-full p-2"
        >
          <X size={18} />
        </button>

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
          <input
            type="text"
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-full px-4 py-2.5 text-sm mb-4"
          />

          {/* Review */}
          <textarea
            rows={4}
            className="w-full border rounded-xl p-3 text-sm resize-none mb-4"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          {/* Upload */}
          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl cursor-pointer text-gray-500 hover:bg-gray-50 mb-4">
            <Upload size={28} />
            <span className="text-xs mt-1">PNG / JPG / MP4 (Max 5)</span>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.mp4"
              onChange={handleMediaChange}
              className="hidden"
            />
          </label>

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="flex gap-3 mb-4 overflow-x-auto">
              {mediaFiles.map((file, i) => (
                <div key={i} className="relative">
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>

                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-16 h-16 rounded-lg object-cover"
                      alt="preview"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-16 h-16 rounded-lg"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            onClick={handleSubmit}
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
