import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import {
  Star,
  Loader2,
  ShoppingCart,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";
import CartSidebar from "./CartSidebar";
import ProductCard from "./ProductCard";

const PaymentModal = lazy(() => import("../pages/PaymentModal"));

export default function OurProducts({ countryCurrency, country }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page] = useState(1);
  const [limit] = useState(4);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  const { setCount } = useHeader();
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");

  const cacheKey = useMemo(() => `products_${countryCurrency}_${page}_${limit}`, [countryCurrency, page, limit]);
  const CACHE_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    fetchProducts();
  }, [countryCurrency, page]);

  const fetchProducts = async () => {
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);

    if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      setProducts(JSON.parse(cached));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [productsResponse, wishlistResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=${page}&limit=${limit}&currencyCode=${countryCurrency || "INR"}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
          }
        ),
        token ? fetch(
          `${import.meta.env.VITE_API_URL}/api/user/wishlist/getWishlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ) : Promise.resolve(null)
      ]);

      if (!productsResponse.ok) {
        throw new Error(`HTTP error! status: ${productsResponse.status}`);
      }

      const [productsData, wishlistData] = await Promise.all([
        productsResponse.json(),
        wishlistResponse ? wishlistResponse.json() : Promise.resolve(null)
      ]);

      if (productsData.success) {
        let productsList = productsData.products || productsData.data || [];

        if (wishlistData?.success && wishlistData.data) {
          const wishlistedIds = new Set(
            wishlistData.data.map(item => item?._id || item.productId)
          );

          productsList = productsList.map(product => ({
            ...product,
            isWishlisted: wishlistedIds.has(product._id || product.id),
          }));
        }

        setProducts(productsList);
        sessionStorage.setItem(cacheKey, JSON.stringify(productsList));
        sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = useCallback(async (product) => {
    try {
      const cartData = {
        productId: product._id || product.id,
        quantity: 1,
        totalAmount: Number(String(product.price).replace(/[^0-9.]/g, "")) || 0,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/cart/addToCart?&currencyCode=${countryCurrency || "INR"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add to cart");
      }

      if (result.success) {
        localStorage.setItem("cart", result.data.products.length);
        setCount(result.data.products.length);
        setCartSidebarOpen(true)
      }

      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: result }));
    } catch (error) {
      throw error;
    }
  }, [token, setCount]);

  const handleWishlistUpdate = useCallback((productId, isWishlisted) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        (product._id || product.id) === productId
          ? { ...product, isWishlisted }
          : product
      )
    );
    sessionStorage.removeItem(cacheKey);
    sessionStorage.removeItem(`${cacheKey}_time`);
  }, [cacheKey]);

  if (loading) {
    return (
      <div className="min-h-screen shadow-[inset_0_0_120px_rgba(88,28,135,0.25)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-lg p-6 max-w-sm w-full text-center border bg-white border-gray-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            We couldn't load the products right now. Please try again
          </h3>
          <button
            onClick={fetchProducts}
            className="px-3 py-2 text-md rounded-md text-white font-medium bg-red-500 hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative py-2 px-3">
      <div className="absolute top-0 left-0 right-0 w-full z-10 pointer-events-none">
        <img src="/shape.png" alt="" className="w-full block" loading="lazy" />
      </div>

      <div className="max-w-7xl mx-auto md:mt-20">
        <div className="relative flex flex-col md:flex-row items-center gap-4 my-10 md:my-25">
          <h2
            className="mx-auto text-center text-3xl md:text-4xl font-extrabold animate-fade-in bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
              backgroundSize: "200% 200%",
              animation: "goldShine 3s linear infinite",
            }}
          >
            Manifestation Tool
          </h2>

          <button
            onClick={() => Navigate("/products")}
            className="md:absolute hidden md:block md:right-0 cursor-pointer text-white px-6 py-2 rounded-lg bg-[#a17b0a] font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            View All
          </button>
        </div>

        {products.length > 0 ? (
          <>
            {/* Mobile: 4 products in 2 cols */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:hidden">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  country={country}
                  onAddToCart={handleAddToCart}
                  onWishlistUpdate={handleWishlistUpdate}
                  setCartSidebarOpen={setCartSidebarOpen}
                  openPayment={openPayment}
                  setOpenPayment={setOpenPayment}
                  countryCurrency={countryCurrency}
                />
              ))}
            </div>

            {/* Desktop: 3 products in 3 cols */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-6">
              {products.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  country={country}
                  onAddToCart={handleAddToCart}
                  onWishlistUpdate={handleWishlistUpdate}
                  setCartSidebarOpen={setCartSidebarOpen}
                  openPayment={openPayment}
                  setOpenPayment={setOpenPayment}
                  countryCurrency={countryCurrency}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-700">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Products Found
              </h3>
              <p className="text-gray-400">
                We could not find any products at the moment.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => Navigate("/products")}
          className="my-5 md:hidden block text-white px-6 py-2 rounded-lg bg-[#a17b0a] font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          View All
        </button>

        <CartSidebar
          countryCurrency={countryCurrency}
          isOpen={cartSidebarOpen}
          onClose={() => setCartSidebarOpen(false)}
          onCheckout={() => {
            setCartSidebarOpen(false);
            setOpenPayment(true);
          }}
        />

        {cartSidebarOpen && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-51 animate-fadeIn" />
        )}

        {openPayment && (
          <Suspense fallback={null}>
            <PaymentModal
              country_name={country}
              countryCurrency={countryCurrency}
              isOpen={openPayment}
              onClose={() => setOpenPayment(false)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}