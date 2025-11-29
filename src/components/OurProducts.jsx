import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Eye, Heart, Loader2, Check } from 'lucide-react';
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
      <div className="h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  return (
    <div
      className="relative h-48 sm:h-56 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrent(0);
      }}
    >
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="Product"
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
          onError={e => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      ))}

      {isHovered && images.length > 1 && (
        <>
          <button
            onClick={e => {
              e.stopPropagation();
              setCurrent(p => (p - 1 + images.length) % images.length);
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={14} className="text-gray-700" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              setCurrent(p => (p + 1) % images.length);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={14} className="text-gray-700" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                backgroundColor: i === current ? '#C9A227' : 'rgba(255,255,255,0.5)',
              }}
            />
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

// export default ProductCard;

export default function OurProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=1&limit=8`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to add items to cart");
      navigate('/login');
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

      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: result }));
      navigate("/cart");
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add product to cart. Please try again.');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f1c2e 0%, #1a3352 50%, #0d2440 100%)' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-4" style={{ color: '#C9A227' }} />
          <p className="text-white text-base sm:text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, #0f1c2e 0%, #1a3352 50%, #0d2440 100%)' }}>
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Error Loading Products</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-5 sm:px-6 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 text-sm sm:text-base"
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, #0f1c2e 0%, #1a3352 50%, #0d2440 100%)' }}>
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl">📦</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
          <p className="text-sm sm:text-base text-gray-600">There are currently no products available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #0f1c2e 0%, #1a3352 50%, #0d2440 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">Our Products</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Discover amazing deals on top products</p>
          </div>
          <button 
            onClick={() => navigate('/products')} 
            className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all hover:gap-2" 
            style={{ backgroundColor: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)' }}
          >
            View All <ChevronRight size={16}/>
          </button>
        </div>
        
        {/* Mobile: 1 column, Desktop: 2 columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id || product._id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}