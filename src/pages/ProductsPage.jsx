import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Eye, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || !images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(p => (p + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovered, images]);

  if (!images || images.length === 0) {
    return (
      <div className="h-36 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative h-36 overflow-hidden group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setCurrent(0); }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="Product" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{ opacity: i === current ? 1 : 0 }} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
      ))}

      {isHovered && images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setCurrent(p => (p - 1 + images.length) % images.length); }} className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={14} className="text-gray-700" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrent(p => (p + 1) % images.length); }} className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={14} className="text-gray-700" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: i === current ? '#C9A227' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAddingToCart(true);

    try {
      await onAddToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id || product._id}`);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative group">
      {product.discount && (
        <div className="absolute top-2 left-2 z-10">
          <div className="px-2 py-1 rounded-md text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
            {product.discount}% OFF
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setLiked(!liked)} 
        className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
      >
        <Heart size={14} className="sm:w-4 sm:h-4" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : '#666'} />
      </button>

      <div style={{ background: 'linear-gradient(180deg, #e8f4f8 0%, #c8dce8 100%)' }}>
        <div className="h-48 sm:h-56 overflow-hidden flex items-center justify-center p-2">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 min-h-8 sm:min-h-10">
          {product.name || 'Untitled Product'}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(201,162,39,0.1)' }}>
            <Star size={10} className="sm:w-3 sm:h-3" fill="#C9A227" stroke="#C9A227"/>
            <span className="text-xs font-semibold" style={{ color: '#C9A227' }}>{product.overallRating || 0}</span>
          </div>
          <span className="text-xs text-gray-400">({product.totalReviews || '0'})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold" style={{ color: '#C9A227' }}>₹{product.price || 0}</span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart || addedToCart}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 sm:px-3 border-2 rounded-lg font-medium text-xs transition-all hover:bg-amber-50 disabled:opacity-70 disabled:cursor-not-allowed" 
            style={{ borderColor: '#C9A227', color: addedToCart ? '#22c55e' : '#C9A227' }}
          >
            {addingToCart ? (
              <Loader2 size={14} className="animate-spin" />
            ) : addedToCart ? (
              <>
                <Check size={14} /> <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14}/> <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
          <button 
            onClick={handleViewDetails} 
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 sm:px-3 rounded-lg font-medium text-xs text-white transition-all hover:opacity-90" 
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            <Eye size={14}/> <span className="hidden sm:inline">Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const Navigate = useNavigate()


  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart");
      Navigate('/login')
      return;
    }

    try {
      const cartData = {
        productId: product._id || product.id,
        quantity: 1,
        totalAmount: product.price || 0
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/addToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add to cart');
      }

      console.log('Added to cart successfully:', result);

      // Optional: Update cart count in header or show notification
      // You can dispatch an event here that your header component listens to
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: result }));
      Navigate("/cart")
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add product to cart. Please try again.');
      throw error;
    }
  };

  const [searchText, setSearchText] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");


  useEffect(() => {
    fetchProducts();
  }, [page, debounceSearch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebounceSearch(searchText);
      setPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);


  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=${page}&limit=${limit}&search=${debounceSearch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || data.data || []);
        setTotalProducts(data.pagination.totalRecords);
        setTotalPages(data.pagination.totalPages || Math.ceil((data.pagination.totalRecords || 0) / limit));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };


  if (error) return /* your error UI */;



  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between  gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Our Products</h2>
            <p className="text-gray-400 text-sm">Discover amazing deals on top products</p>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 w-full md:w-72 rounded-lg text-sm text-white placeholder-gray-400 bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400"
            placeholder="Search products..."
          />
        </div>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.length > 0 ? products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} onAddToCart={handleAddToCart} />
          ))

            : <span className='text-white text-center'>No Product Not found</span>
          }
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            Prev
          </button>

          <span className="text-white font-semibold text-lg">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            Next
          </button>
        </div>

        <p className="text-center text-gray-400 mt-3 text-sm">
          Showing {(page - 1) * limit + 1} – {Math.min(page * limit, totalProducts)} of {totalProducts} products
        </p>
      </div>
    </div>
  );
}
