// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useHeader } from "../context/HeaderContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const {  setList } = useHeader();
  useEffect(() => {
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }

    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/user/wishlist/getWishlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch wishlist");
        }

        // adjust if your field is different
        setItems(data.data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token, navigate]);

  const handleRemove = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRemovingId(productId);

      const res = await fetch(
        `${API_URL}/api/user/wishlist/removeFromWishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      // Update local state
      setItems((prev) =>
        prev.filter(
          (item) =>
            (item._id || item.id) !== productId
        )
      );

      setList((prev) => (prev - 1));
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      alert(err.message || "Failed to remove item. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleGoToProduct = (item) => {
    const id = item._id || item.id;
    if (!id) return;
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
 text-white">
        Loading wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center  text-red-400">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center 
 text-white px-4">
        <Heart className="w-12 h-12 text-pink-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Save products you love and come back anytime to purchase them.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:scale-105 transition-transform"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen 
 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-400 text-sm mt-1">
              You have {items.length} item{items.length > 1 ? "s" : ""} saved.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const id = item._id || item.id;
            const image =
              item.image ||
              "https://via.placeholder.com/300x200?text=No+Image";
            return (
              <div
                key={id}
                className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden group"
              >
                <button
                  onClick={() => handleRemove(id)}
                  disabled={removingId === id}
                  className="absolute top-3 right-3 z-10 w-9 h-9 cursor-pointer rounded-full bg-black/60 flex items-center justify-center text-red-400 hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div
                  onClick={() => handleGoToProduct(item)}
                  className="cursor-pointer"
                >
                  <div className="h-44 bg-slate-900 flex items-center justify-center">
                    <img
                      src={image}
                      alt={item.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-sm font-semibold line-clamp-2">
                      {item.name || "Unnamed Product"}
                    </h2>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {item.description || "No description available."}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-yellow-400">
                        ₹{item.price ?? 0}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleGoToProduct(item)}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-sm font-semibold transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Product
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
