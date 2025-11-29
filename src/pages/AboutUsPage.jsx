import React from 'react';

export default function AboutUsPage() {
  const stats = [
    { value: "50K+", label: "Lorem ipsum dolor sit amet consectetur" },
    { value: "15K+", label: "Lorem ipsum dolor sit amet consectetur" },
    { value: "10+", label: "Lorem ipsum dolor sit amet consectetur" }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "David Klinz",
      role: "CEO & Founder",
      description: "As head of the company, he run its daylight to execute",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "David Klinz",
      role: "CEO & Founder",
      description: "As head of the company, he run its daylight to execute",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "David Klinz",
      role: "CEO & Founder",
      description: "As head of the company, he run its daylight to execute",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "David Klinz",
      role: "CEO & Founder",
      description: "As head of the company, he run its daylight to execute",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden ">
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-radial from-orange-300/60 via-orange-400/40 to-transparent blur-sm animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-6 py-4">
          <h1 className="text-white text-lg font-semibold">About Us</h1>
        </div>

        {/* Hero Section */}
        <div className="px-6 py-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-white text-3xl font-bold mb-4">
              Quality Items For Every Desk<br />& Every Day.
            </h2>
            <div className="mt-6">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop" 
                alt="Team collaboration"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. Lorem ipsum is simply dummy text of the printing and typesetting Lorem is to make a type specimen book.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-orange-300 text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900"></div>
                ))}
              </div>
              <span className="text-white/80 text-sm">Customers Member</span>
            </div>

            <div className="mt-6 flex gap-4">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop" 
                alt="Desktop setup"
                className="w-32 h-24 object-cover rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" 
                alt="Office supplies"
                className="w-32 h-24 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="px-6 py-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-white text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.
            </p>
            <div className="mt-6">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" 
                alt="Analytics"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Our Vision */}
        <div className="px-6 py-4">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h3 className="text-white text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. Lorem ipsum is simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. Lorem ipsum is simply dummy text of the printing and typesetting Lorem ipsum is to make a type specimen book.
                </p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop" 
                alt="Menu"
                className="w-48 h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="px-6 py-4 pb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-white text-2xl font-bold mb-8 text-center">Our Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white/20">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{member.name}</h4>
                  <p className="text-orange-300 text-xs mb-2">{member.role}</p>
                  <p className="text-white/60 text-xs text-center">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}