import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlogsPage() {
  const latestBlogs = [
    {
      id: 1,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1565734441533-b9ff7154a045?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=400&h=300&fit=crop"
    }
  ];

  const ourLatestBlogs = [
    {
      id: 1,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1606327054629-64d85f8f3b6b?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=400&h=300&fit=crop"
    }
  ];

  const mostReadBlogs = [
    {
      id: 1,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
    }
  ];
const Navigate = useNavigate()
  const BlogCard = ({ blog }) => (
    <div onClick={()=>Navigate("/blogs/4")} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-orange-300/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-2">{blog.title}</h3>
        <p className="text-orange-300 text-sm">{blog.category}</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden ">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-800/30 via-transparent to-transparent"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[5%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[80%] animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[30%] left-[60%] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[50%] left-[25%] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[85%] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[85%] left-[35%] animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[45%] animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[65%] left-[15%] animate-pulse" style={{animationDelay: '3.5s'}}></div>
      </div>

      {/* Spiral */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-orange-300/50 via-orange-400/30 to-transparent blur-sm animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 pb-12 max-w-7xl mx-auto">
        {/* Explore Out Latest Blog Section */}
        <div className="px-6 py-6">
          <h2 className="text-white text-xl font-bold mb-6">Explore Out Latest Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Our Latest Blogs Section */}
        <div className="px-6 py-6">
          <h2 className="text-white text-xl font-bold mb-6">Our Latest Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ourLatestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

        {/* Most Read Blogs Section */}
        <div className="px-6 py-6">
          <h2 className="text-white text-xl font-bold mb-6">Most Read Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mostReadBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}