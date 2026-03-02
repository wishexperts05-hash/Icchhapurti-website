import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHeader } from "../context/HeaderContext";
import { ArrowBigRight } from "lucide-react";
import { ArrowBigLeft } from "lucide-react";
import CartSidebar from "../components/CartSidebar";
import ProductCard from "../components/ProductCard";

export default function ProductsPage({ countryCurrency, country }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const { setCount } = useHeader();
  const Navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);

  // Memoize cache key
  const cacheKey = useMemo(() =>
    `products_${countryCurrency}_${page}_${limit}_${debounceSearch}`,
    [countryCurrency, page, limit, debounceSearch]
  );
  const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

  useEffect(() => {
    fetchProducts();
  }, [page, debounceSearch, countryCurrency]);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebounceSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  const fetchProducts = async () => {
    // Check cache first
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);

    if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      const cachedData = JSON.parse(cached);
      setProducts(cachedData.products);
      setTotalProducts(cachedData.totalProducts);
      setTotalPages(cachedData.totalPages);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [productsResponse, wishlistResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=${page}&limit=${limit}&search=${debounceSearch}&currencyCode=${countryCurrency || "INR"}`,
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
        const total = productsData.pagination.totalRecords;
        const pages = productsData.pagination.totalPages || Math.ceil(total / limit);
        setTotalProducts(total);
        setTotalPages(pages);

        sessionStorage.setItem(cacheKey, JSON.stringify({
          products: productsList,
          totalProducts: total,
          totalPages: pages
        }));
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
        totalAmount: product.price || 0,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/cart/addToCart?currencyCode=${countryCurrency || "INR"}`,
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
        localStorage.setItem("cart", result?.data?.products.length);
        setCount(result.data?.products?.length);
        setCartSidebarOpen(true);
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

  const handlePrev = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const handleNext = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-[#D3AF37]/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Error Loading Products
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#D3AF37] to-[#D3AF37] hover:from-[#D3AF37] hover:to-[#D3AF37] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{t("common.ourProducts")}</h2>
            <p className="text-gray-400 text-sm">{t("home.tagline")}</p>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-72 px-4 py-2 rounded-full text-sm text-slate-100 placeholder-slate-400 bg-white/5 border border-transparent relative shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_35px_rgba(0,0,0,0.6)] backdrop-blur outline-none transition-all duration-300 focus:shadow-[0_0_8px_2px_rgba(255,0,120,0.8)] focus:border-[#D3AF37] animate-borderPulse"
            placeholder="Search Products By Name..."
          />
        </div>

        {products.length > 0 ? (
          /* Always 2-col on mobile, 3-col on desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
            {products.map((product) => (
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
      </div>
    </div>
  );
}