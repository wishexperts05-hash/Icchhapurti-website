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
import { useHeader } from "../context/HeaderContext";


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
            }, 3000);

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
                    currencySymbol: product.currencySymbol || "₹"
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
                setCartSidebarOpen(true)

            } else {
                await onAddToCart(product);

                if (isBuyNow) {
                    setOpenPayment(true)
                } else {
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                    // setCartSidebarOpen(true)
                }
            }
        } catch (error) {
            // setCartSidebarOpen(true)
        } finally {
            setAddingToCart(false);
            setBuyingNow(false);
        }
    };

    const handleBuyNow = async (e) => {
        e.stopPropagation();

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
        const productSlug = (product.name || "product")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-");

        navigate(`/product/${product.id || product._id}/${productSlug}`);
    };

    const toggleWishlist = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!token) {
            alert("Please login to manage wishlist");
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
                method: nextLiked ? "POST" : "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: nextLiked ? JSON.stringify({ productId }) : undefined,
            });

            const result = await res.json();
            if (!res.ok || !result.success) {
                throw new Error(result.message || "Failed to update wishlist");
            }
            setList((prev) => (nextLiked ? prev + 1 : prev - 1));

            setLiked(nextLiked);

            if (onWishlistUpdate) {
                onWishlistUpdate(productId, nextLiked);
            }

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

    return (
        <div className="relative group h-full">
            <div
                onClick={handleViewDetails}
                className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-purple-300 flex flex-col h-full"
            >
                {/* Sparkle icon on hover */}
                <div className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                </div>

                {/* Discount badge */}
                {product.discount && (
                    <div className="absolute top-2 left-2 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shadow-md">
                            <span className="text-white text-[10px] md:text-xs font-bold">
                                {product.discount}% OFF
                            </span>
                        </div>
                    </div>
                )}

                {/* Wishlist button */}
                <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className="absolute top-2 right-2 cursor-pointer z-20 w-7 h-7 md:w-9 md:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {wishlistLoading ? (
                        <Loader2 size={12} className="animate-spin text-gray-600 md:w-4 md:h-4" />
                    ) : (
                        <Heart
                            size={13}
                            fill={liked ? "#ef4444" : "none"}
                            stroke={liked ? "#ef4444" : "#374151"}
                            className="transition-all duration-300 md:w-4 md:h-4"
                        />
                    )}
                </button>

                {/* Product Image */}
                <div className="relative w-full h-[160px] sm:h-[200px] md:h-[320px] lg:h-[380px] bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                    <img
                        src={product.images?.[currentImageIndex] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/1000x1000?text=No+Image";
                        }}
                    />
                </div>

                {/* Content section */}
                <div className="p-2 sm:p-3 md:p-4 bg-white flex flex-col flex-1">

                    {/* Product name */}
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2 min-h-[2rem] md:min-h-[3.5rem]">
                        {product.name || "Untitled Product"}
                    </h3>

                    {/* Description — hidden on mobile to save space */}
                    {product.description && (() => {
                        try {
                            const parsed = JSON.parse(product.description);
                            const firstContent = parsed?.[0]?.content || "";
                            const cleanText = firstContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
                            return (
                                <p className="hidden md:block text-xs text-gray-500 mb-3 line-clamp-2">
                                    {cleanText}
                                </p>
                            );
                        } catch (e) {
                            return null;
                        }
                    })()}

                    {/* Rating */}
                    <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                        <div className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg bg-yellow-50 border border-yellow-200">
                            <Star size={10} fill="#eab308" stroke="#eab308" className="md:w-3 md:h-3" />
                            <span className="text-[10px] md:text-sm font-bold text-yellow-600">
                                {product.overallRating || 0}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs text-gray-400 hidden sm:inline">
                            ({product.totalReviews || "0"})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <span className="text-sm sm:text-base md:text-xl lg:text-2xl font-black text-gray-900">
                            {product.price || "₹0"}
                        </span>
                    </div>

                    {/* Features — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-3 mb-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
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
                    <div className="flex gap-1.5 md:gap-2 mt-auto">
                        <button
                            onClick={(e) => handleAddToCart({ e, isBuyNow: false })}
                            disabled={addingToCart || addedToCart || buyingNow}
                            className="flex-1 flex items-center justify-center cursor-pointer gap-1 md:gap-1.5 py-1.5 md:py-2.5 px-1.5 md:px-3 border-2 border-amber-600 rounded-lg md:rounded-xl font-bold text-[10px] sm:text-xs md:text-sm text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:shadow-md"
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 size={12} className="animate-spin md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Adding...</span>
                                </>
                            ) : addedToCart ? (
                                <>
                                    <Check size={12} className="text-green-600 md:w-4 md:h-4" />
                                    <span className="text-green-600">Added!</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={12} className="md:w-4 md:h-4 shrink-0" />
                                    <span>Cart</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={addingToCart || addedToCart || buyingNow}
                            className="flex-1 flex items-center cursor-pointer justify-center gap-1 md:gap-1.5 py-1.5 md:py-2.5 px-1.5 md:px-3 rounded-lg md:rounded-xl font-bold text-[10px] sm:text-xs md:text-sm text-white transition-all bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                        >
                            {buyingNow ? (
                                <>
                                    <Loader2 size={12} className="animate-spin md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Processing...</span>
                                    <span className="sm:hidden">Wait...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={12} fill="currentColor" className="md:w-4 md:h-4 shrink-0" />
                                    <span>Buy Now</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Stock status */}
                    {product.inStock !== undefined && (
                        <div className="mt-2 md:mt-3 flex items-center justify-center gap-1.5 text-[10px] md:text-xs">
                            {product.inStock ? (
                                <>
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-green-600 font-semibold">In Stock</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full" />
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