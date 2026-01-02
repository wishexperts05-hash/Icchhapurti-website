import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";
import DOMPurify from "dompurify";

/* -------------------- IMPROVED HTML Decode Helper -------------------- */
const decodeHTML = (html = "") => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  const decoded = txt.value;
  
  // Additional explicit decoding for common entities
  return decoded
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
};

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

  /* -------------------- Fetch Blog -------------------- */
  const fetchBlogDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/blogs/get-blog-by-id/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
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

  /* -------------------- Related Blogs -------------------- */
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
          setRelatedBlogs(
            result.data.filter((b) => b._id !== id).slice(0, 3)
          );
        }
      }
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    }
  };

  /* -------------------- Loading -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-400" />
      </div>
    );
  }

  /* -------------------- Error -------------------- */
  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 rounded-xl p-6 text-center">
          <h3 className="text-white text-xl mb-2">Error Loading Blog</h3>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="relative z-10 max-w-7xl mx-auto pb-12">

        {/* Back Button */}
        <div className="px-4 pt-6">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
        </div>

        {/* Blog Card */}
        <div className="px-4 py-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">

            {/* Title */}
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-white/70 text-sm mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{blog.createdBy?.name || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{blog.pubishedAt || "N/A"}</span>
              </div>
            </div>

            {/* Featured Image */}
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-80 object-cover rounded-xl mb-6"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
                }}
              />
            )}

            {/* -------------------- BLOG BODY (FIXED) -------------------- */}
            <div
              className="blog-content text-white/90 text-base md:text-lg leading-relaxed"
              style={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(decodeHTML(blog.body), {
                  ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                    'ul', 'ol', 'li', 
                    'a', 'img', 
                    'blockquote', 'code', 'pre',
                    'span', 'div',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td'
                  ],
                  ALLOWED_ATTR: [
                    'href', 'src', 'alt', 'class', 'style', 
                    'target', 'rel', 'title'
                  ]
                })
              }}
            />
          </div>
        </div>

        {/* Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <div className="px-4 mt-8">
            <h2 className="text-white text-2xl font-bold mb-4">
              More Related Blogs
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedBlogs.map((b) => (
                <div
                  key={b._id}
                  onClick={() => navigate(`/blogs/${b._id}`)}
                  className="bg-white/10 rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:bg-white/15 transition-all duration-300"
                >
                  <img
                    src={
                      b.imageUrl ||
                      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b"
                    }
                    alt={b.title}
                    className="h-40 w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=Blog+Image";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold line-clamp-2 mb-2">
                      {b.title}
                    </h3>
                    <p className="text-orange-300 text-sm">
                      {b.pubishedAt || "Recent"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* -------------------- CUSTOM STYLES -------------------- */}
      <style jsx>{`
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }
        
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #fbbf24;
          font-weight: 700;
        }
        
        .blog-content h1 {
          font-size: 2rem;
        }
        
        .blog-content h2 {
          font-size: 1.75rem;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
        }
        
        .blog-content ul,
        .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        
        .blog-content strong,
        .blog-content b {
          font-weight: 600;
          color: white;
        }
        
        .blog-content em,
        .blog-content i {
          font-style: italic;
        }
        
        .blog-content a {
          color: #fdba74;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #fb923c;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #fb923c;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .blog-content code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        
        .blog-content pre {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .blog-content pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .blog-content th,
        .blog-content td {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem;
          text-align: left;
        }
        
        .blog-content th {
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}