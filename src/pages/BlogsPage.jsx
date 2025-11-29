




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/blogs/all?page=1&limit=10`);
      setBlogs(res.data.data || []);
    } catch (error) {
      console.log("Error fetching blogs", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const BlogCard = ({ blog }) => (
    <div
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 
      hover:border-orange-300/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog?.imageUrl || "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-2">
          {blog.title}
        </h3>
        <p className="text-orange-300 text-sm">
          {blog.category || "Blog Category"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <div className="relative z-10 pb-12 max-w-7xl mx-auto">
        {/* Explore Our Latest Blog Section */}
        <div className="px-6 py-6">
          <h2 className="text-white text-xl font-bold mb-6">
            Explore Our Latest Blogs
          </h2>

          {blogs.length === 0 ? (
            <p className="text-gray-300">No blogs found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
