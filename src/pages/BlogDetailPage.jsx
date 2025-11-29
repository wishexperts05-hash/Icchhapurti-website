import React from "react";

export default function BlogDetailPage() {
  const relatedBlogs = [
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
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "First Time Pen Selling Tips",
      category: "Asset Blog",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden ">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-800/30 via-transparent to-transparent"></div>
      {/* Stars */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[5%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[80%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[30%] left-[60%] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[50%] left-[25%] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[85%] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[85%] left-[35%] animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>
      {/* Spiral */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-radial from-orange-300/50 via-orange-400/30 to-transparent blur-sm animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 pb-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="px-4 sm:px-6 py-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6">Our Top Best Pens</h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8">
              <div className="flex-1">
                <p className="text-white/90 text-sm leading-relaxed text-justify">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>
              </div>
              <div className="w-full md:w-64 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1565735285106-c2d53c2e0e84?w=400&h=300&fit=crop"
                  alt="Workspace"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="px-4 sm:px-6 py-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/20">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Why do we use it?</h2>
            <p className="text-white/90 text-sm leading-relaxed text-justify mb-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry...
            </p>
            <p className="text-white/90 text-sm leading-relaxed text-justify mb-6">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8">
              <div className="flex-1">
                <p className="text-white/90 text-sm leading-relaxed text-justify">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </div>
              <div className="w-full md:w-72 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=400&fit=crop"
                  alt="Office supplies"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs Section */}
        <div className="px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-white text-lg sm:text-xl font-bold">More Related Blogs</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-orange-400 hover:bg-orange-500 rounded-lg flex items-center justify-center text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-orange-300/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-base mb-2">{blog.title}</h3>
                  <p className="text-orange-300 text-sm mb-3">{blog.category}</p>
                  <button className="text-orange-300 text-sm hover:text-orange-400 transition-colors">
                    Read Blog
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
