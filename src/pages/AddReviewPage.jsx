import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddReviewPage = () => {
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(4);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();
    console.log(id, "id")
    const user = JSON.parse(localStorage.getItem("user"));

    // Fetch product by ID
    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/products/productById/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (data.success) {
                setProduct(data.data);
            }
        } catch (error) {
            console.log("Error fetching product", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Submit review
    const submitReview = async () => {
        if (!review.trim()) {
            alert("Please write your review");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                productId: id,
                stars: rating,
                comment: review,
            };

            console.log("Payload:", payload);

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/reviews/createOrUpdate`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (data.success) {
                alert("Review submitted successfully!");
                navigate(`/product/${id}`);
            }
        } catch (error) {
            console.error("Review Submit Error:", error);
            alert("Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    // if (loading) return <div className="text-white text-center mt-8">Loading...</div>;

    return (
        <div className="min-h-screen  flex justify-center items-center px-4">

            <div className="w-full max-w-3xl bg-white/10  border border-white/20 rounded-xl p-6">
                <h2 className="text-white text-2xl font-semibold mb-4 text-center">Add Review</h2>

                {/* Product info */}
                <div className="flex justify-center items-center gap-4 mb-4">
                    <img
                        src={product?.images[0]}
                        alt={product?.name}
                        className="w-16 h-16 rounded-md object-cover border border-gray-300"
                    />
                    <div>
                        <div className="text-white font-semibold">{product?.name}</div>
                        <div className="text-xs text-gray-300">
                            Delivered on {new Date(product?.updatedAt).toDateString()}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-400/50 mb-6" />

                {/* Rating */}
                <div className="flex justify-center items-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            onClick={() => setRating(star)}
                            className={`w-9 h-9 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-400"
                                }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1
              1 0 00.95.69h4.178c.969 0
              1.371 1.24.588 1.81l-3.383 2.455a1
              1 0 00-.364 1.118l1.287
              3.966c.3.922-.755 1.688-1.54
              1.118l-3.383-2.454a1
              1 0 00-1.175 0l-3.383
              2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1
              1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1
              1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                    ))}
                </div>

                {/* Review Input */}
                <textarea
                    className="w-full h-32 border border-white rounded-md p-4 text-white mb-6"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share details about your experience"
                />

                <div className="flex justify-center">
                    <button
                        className="bg-[#C8AC5B] hover:bg-yellow-600 text-white font-semibold rounded-md px-12 py-3 text-lg"
                        type="button"
                        onClick={submitReview}
                    >
                        {loading ? "Submitting" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddReviewPage;
