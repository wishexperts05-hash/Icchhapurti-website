import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Calendar, User, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogDetail();
    fetchRelatedBlogs();
  }, [id]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/blogs/get-blog-by-id/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setBlog(result.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/blogs/all?page=1&limit=3`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Filter out current blog
          setRelatedBlogs(result.data.filter(b => b._id !== id).slice(0, 3));
        }
      }
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-400" />
          <p className="text-white text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 ">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Blog</h3>
          <p className="text-white/70 mb-4">{error || "Blog not found"}</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg font-medium transition-all"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden ">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-800/30 via-transparent to-transparent"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[5%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[80%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[30%] left-[60%] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[50%] left-[25%] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[85%] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Spiral Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-radial from-orange-300/50 via-orange-400/30 to-transparent blur-sm animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 pb-12 max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="px-4 sm:px-6 pt-6">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Blogs</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="px-4 sm:px-6 py-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
            {/* Blog Header */}
            <div className="mb-6">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                {blog.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.createdBy?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{blog.pubishedAt || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
              </div>
            )}

            {/* Blog Body */}
            <div className="prose prose-invert max-w-none">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {blog.body}
              </p>
            </div>
          </div>
        </div>

        {/* Linked Product Section */}
        {blog.linkedProduct && (
          <div className="px-4 sm:px-6 py-4">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <h2 className="text-white text-lg sm:text-xl font-bold mb-4">Featured Product</h2>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={blog.linkedProduct.imageUrl}
                    alt={blog.linkedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
                    {blog.linkedProduct.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    Product ID: {blog.linkedProduct.productId}
                  </p>
                  <button
                    onClick={() => navigate(`/product/${blog.linkedProduct._id}`)}
                    className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <div className="px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-white text-lg sm:text-xl font-bold">More Related Blogs</h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 bg-orange-400 hover:bg-orange-500 rounded-lg flex items-center justify-center text-white transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id}
                  onClick={() => navigate(`/blog/${relatedBlog._id}`)}
                  className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-orange-300/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-white/5">
                    <img
                      src={relatedBlog.imageUrl||"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-orange-300 text-xs sm:text-sm mb-3">
                      {relatedBlog.pubishedAt}
                    </p>
                    <button className="text-orange-300 text-sm hover:text-orange-400 transition-colors">
                      Read Blog →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}