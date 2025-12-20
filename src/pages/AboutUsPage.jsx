import React, { useState, useEffect } from 'react';

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/aboutUs`);
      const result = await response.json();
      
      if (result.success) {
        setAboutData(result.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!aboutData) return null;

  const stats = [
    { value: `${(aboutData.statistics.sellingProducts / 1000).toFixed(0)}K+`, label: "Selling Products" },
    { value: `${(aboutData.statistics.satisfiedCustomers / 1000).toFixed(0)}K+`, label: "Satisfied Customers" },
    { value: `${aboutData.statistics.worldwideHonors}+`, label: "Worldwide Honors" }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-800/30 via-transparent to-transparent"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[15%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[25%] left-[85%] animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[40%] left-[70%] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[60%] left-[20%] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[75%] left-[90%] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[85%] left-[40%] animate-pulse" style={{animationDelay: '2.5s'}}></div>
      </div>

      {/* Spiral */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-radial from-orange-300/60 via-orange-400/40 to-transparent blur-sm animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4">
          <h1 className="text-white text-lg sm:text-xl font-semibold">About Us</h1>
        </div>

        {/* Hero Section */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-tight">
              {aboutData.heroSection.title}
            </h2>
            {aboutData.heroSection.description && (
              <p className="text-white/80 text-sm mb-4">{aboutData.heroSection.description}</p>
            )}
            <div className="mt-4 sm:mt-6">
              {aboutData.heroSection.photos && aboutData.heroSection.photos.length > 0 ? (
                <img 
                  src={aboutData.heroSection.photos[0]} 
                  alt="Hero"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-xl"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop" 
                  alt="Team collaboration"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-xl"
                />
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 sm:px-6 py-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/5 rounded-lg p-3 sm:p-4">
                  <div className="text-orange-300 text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-white/60 text-xs sm:text-sm leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            {aboutData.customerRating && (
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900"></div>
                  ))}
                </div>
                <span className="text-white/80 text-xs sm:text-sm">Customers Member</span>
              </div>
            )}
          </div>
        </div>

        {/* Our Mission */}
        <div className="px-4 sm:px-6 py-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Our Mission</h3>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              {aboutData.ourMission.description}
            </p>
            {aboutData.ourMission.photos && aboutData.ourMission.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutData.ourMission.photos.map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`Mission ${index + 1}`}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-xl"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Our Vision */}
        <div className="px-4 sm:px-6 py-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
              <div className="flex-1 w-full">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Our Vision</h3>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                  {aboutData.ourVision.description}
                </p>
              </div>
              {aboutData.ourVision.photos && aboutData.ourVision.photos.length > 0 && (
                <img 
                  src={aboutData.ourVision.photos[0]} 
                  alt="Vision"
                  className="w-full md:w-48 h-48 sm:h-56 md:h-64 object-cover rounded-xl"
                />
              )}
            </div>
          </div>
        </div>

        {/* Our Team */}
        {/* <div className="px-4 sm:px-6 py-4 pb-8 sm:pb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Our Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {aboutData.ourTeam.map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 sm:mb-4 border-2 sm:border-4 border-white/20">
                    <img 
                      src={member.photos && member.photos.length > 0 ? member.photos[0] : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 text-center">{member.name}</h4>
                  <p className="text-orange-300 text-xs mb-2">{member.role}</p>
                  <p className="text-white/60 text-xs text-center leading-tight hidden sm:block">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}