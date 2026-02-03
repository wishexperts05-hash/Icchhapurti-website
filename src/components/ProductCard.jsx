
import { useState, useEffect } from "react";
import {
    Star,
    Loader2,
    Heart,
    ShoppingCart,
    Zap,
    Sparkles,
    Check,

} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { useHeader } from "../context/HeaderContext";

import PaymentModal from "../pages/PaymentModal";

export default function ProductCard({ product, country, countryCurrency, onAddToCart, onWishlistUpdate, openPayment, setOpenPayment, setCartSidebarOpen }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [liked, setLiked] = useState(product.isWishlisted || false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { setCount, setList } = useHeader();

    // Keep local liked in sync with backend flag
    useEffect(() => {
        setLiked(product.isWishlisted || false);
    }, [product.isWishlisted]);

    // Auto-slide images
    useEffect(() => {
        const images = product.images || [];
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000); // Change image every 3 seconds

            return () => clearInterval(interval);
        }
    }, [product.images]);


    const extractPrice = (price) => {
        if (typeof price === 'number') return price;
        if (typeof price === 'string') {
            return Number(price.replace(/[^0-9.]/g, ''));
        }
        return 0;
    };

    const handleAddToCart = async ({ e, isBuyNow }) => {
        e.stopPropagation();

        if (isBuyNow) {
            setBuyingNow(true);
        } else {
            setAddingToCart(true);
        }

        try {
            if (!token) {
                const cartItem = {
                    productId: product._id || product.id,
                    product: {
                        _id: product._id || product.id,
                        name: product.name,
                        price: product.price,
                        images: product.images,
                        image: product.images?.[0],
                    },
                    quantity: 1,
                    totalAmount: product.price || 0,
                };

                const existingCart = JSON.parse(
                    localStorage.getItem("cartItems") || "[]"
                );
                const existingItemIndex = existingCart.findIndex(
                    (item) => (item.productId || item.product._id) === cartItem.productId
                );

                if (existingItemIndex > -1) {
                    existingCart[existingItemIndex].quantity += 1;
                    existingCart[existingItemIndex].totalAmount =
                        existingCart[existingItemIndex].quantity * Number(extractPrice(product.price));
                } else {
                    existingCart.push(cartItem);
                }

                localStorage.setItem("cartItems", JSON.stringify(existingCart));
                const totalItems = existingCart.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );
                localStorage.setItem("cart", existingCart.length);
                setCount(existingCart.length);
                window.dispatchEvent(
                    new CustomEvent("cartUpdated", {
                        detail: { cart: existingCart, count: totalItems },
                    })
                );
                // navigate("/cart");
                setCartSidebarOpen(true)

            } else {
                await onAddToCart(product);

                if (isBuyNow) {
                    setOpenPayment(true)
                } else {
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                    // navigate("/cart")
                    setCartSidebarOpen(true)

                }
            }
        } catch (error) {
            // navigate("/cart");
            setCartSidebarOpen(true)
        } finally {
            setAddingToCart(false);
            setBuyingNow(false);
        }
    };

    const handleBuyNow = async (e) => {
        e.stopPropagation();
        // alert("buy now")

        if (token) {
            await handleAddToCart({ e, isBuyNow: true });
        } else {


            const cartItem = {
                productId: product._id || product.id,
                product: {
                    _id: product._id || product.id,
                    name: product.name,
                    price: product.price,
                    images: product.images,
                    image: product.images?.[0],
                },
                quantity: 1,
                totalAmount: product.price || 0,
            };

            const existingCart = JSON.parse(
                localStorage.getItem("cartItems") || "[]"
            );
            const existingItemIndex = existingCart.findIndex(
                (item) => (item.productId || item.product._id) === cartItem.productId
            );

            if (existingItemIndex > -1) {
                existingCart[existingItemIndex].quantity += 1;
                existingCart[existingItemIndex].totalAmount =
                    existingCart[existingItemIndex].quantity * product.price;
            } else {
                existingCart.push(cartItem);
            }

            localStorage.setItem("cartItems", JSON.stringify(existingCart));
            const totalItems = existingCart.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            localStorage.setItem("cart", totalItems);
            setCount(totalItems);
            window.dispatchEvent(
                new CustomEvent("cartUpdated", {
                    detail: { cart: existingCart, count: totalItems },
                })
            );
            setOpenPayment(true)
        }


    };

    const handleViewDetails = () => {
        navigate(`/product/${product.id || product._id}/${encodeURIComponent(product.name || "product")}`);
    };

    // TOGGLE wishlist: add if not liked, remove if liked
    const toggleWishlist = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!token) {
            alert("Please login to manage wishlist");
            // navigate("/login");
            return;
        }

        const productId = product._id || product.id;
        const nextLiked = !liked;

        setWishlistLoading(true);

        try {
            const url = nextLiked
                ? `${import.meta.env.VITE_API_URL}/api/user/wishlist/addToWishlist`
                : `${import.meta.env.VITE_API_URL}/api/user/wishlist/removeFromWishlist/${productId}`;

            const res = await fetch(url, {
                method: nextLiked ? "POST" : "DELETE", // Use DELETE for remove
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // Only send body for POST; DELETE usually does not require a body
                body: nextLiked ? JSON.stringify({ productId }) : undefined,
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                throw new Error(result.message || "Failed to update wishlist");
            }
            setList((prev) => (nextLiked ? prev + 1 : prev - 1));

            setLiked(nextLiked);

            // if parent passed onWishlistUpdate, keep product.isWishlisted in sync
            if (onWishlistUpdate) {
                onWishlistUpdate(productId, nextLiked);
            }

            // Dispatch event to invalidate wishlist cache
            window.dispatchEvent(new CustomEvent('wishlistUpdated', {
                detail: { productId, isWishlisted: nextLiked }
            }));
        } catch (err) {
            console.error("wishlist error", err);
            alert(err.message || "Failed to update wishlist");
        } finally {
            setWishlistLoading(false);
        }
    };
    // console.log(product, "product")



    return (
        <div className="relative group h-full">
            {
                openPayment && <PaymentModal country_name={country} isOpen={openPayment} onClose={() => setOpenPayment(false)} countryCurrency={countryCurrency} />
            }
            <div
                onClick={handleViewDetails}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-purple-300 flex flex-col h-full"
            >
                {/* Sparkle icon on hover */}
                <div className="absolute top-3 right-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Sparkles className="w-4 h-4" />
                </div>

                {/* Discount badge */}
                {product.discount && (
                    <div className="absolute top-3 left-3 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 py-1 rounded-full shadow-md">
                            <span className="text-white text-xs font-bold">
                                {product.discount}% OFF
                            </span>
                        </div>
                    </div>
                )}

                {/* Wishlist button */}
                <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className="absolute top-3 right-3 cursor-pointer z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {wishlistLoading ? (
                        <Loader2 size={16} className="animate-spin text-gray-600" />
                    ) : (
                        <Heart
                            size={16}
                            fill={liked ? "#ef4444" : "none"}
                            stroke={liked ? "#ef4444" : "#374151"}
                            className="transition-all duration-300"
                        />
                    )}
                </button>

                {/* Full-width image - FIXED HEIGHT */}
                <div className="relative  w-full  bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                    <img
                        src={product.images?.[currentImageIndex] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full   transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/1000x1000?text=No+Image";
                        }}
                    />
                </div>

                {/* Content section */}
                <div className="p-4 bg-white flex flex-col flex-1">
                    {/* Product name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name || "Untitled Product"}
                    </h3>

                    {/* Description */}
                    {product.description && (() => {
                        try {
                            const parsed = JSON.parse(product.description);
                            const firstContent = parsed?.[0]?.content || "";
                            const cleanText = firstContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
                            return (
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                    {cleanText}
                                </p>
                            );
                        } catch (e) {
                            return null;
                        }
                    })()}

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 border border-yellow-200">
                            <Star size={12} fill="#eab308" stroke="#eab308" />
                            <span className="text-sm font-bold text-yellow-600">
                                {product.overallRating || 0}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400">
                            ({product.totalReviews || "0"} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-black text-gray-900">
                            {product.price || "₹0"}
                        </span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                <Check size={10} className="text-green-600" />
                            </div>
                            <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <Zap size={10} className="text-blue-600" />
                            </div>
                            <span>Fast Delivery</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-auto">
                        <button
                            onClick={(e) => handleAddToCart({ e, isBuyNow: false })}
                            disabled={addingToCart || addedToCart || buyingNow}
                            className="flex-1 flex items-center justify-center cursor-pointer gap-1.5 py-2.5 px-3 border-2 border-amber-600 rounded-xl font-bold text-sm text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:shadow-md"
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="hidden sm:inline">Adding...</span>
                                </>
                            ) : addedToCart ? (
                                <>
                                    <Check size={16} className="text-green-600" />
                                    <span className="text-green-600 hidden sm:inline">Added!</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={16} />
                                    <span className="hidden sm:inline">Add to Cart</span>
                                    <span className="sm:hidden">Add to Cart</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={addingToCart || addedToCart || buyingNow}
                            className="flex-1 flex items-center cursor-pointer justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-sm text-white transition-all bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                        >
                            {buyingNow ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="hidden sm:inline">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={16} fill="currentColor" />
                                    <span className="hidden sm:inline">Buy Now</span>
                                    <span className="sm:hidden">Buy Now</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Stock status */}
                    {product.inStock !== undefined && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                            {product.inStock ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-green-600 font-semibold">In Stock</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    <span className="text-red-600 font-semibold">Out of Stock</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}
