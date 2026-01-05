import React from 'react';

const WaveDivider = ({ 
  backgroundColor = "#black", 
  waveColor = "#f3f4f6",
  style = "wave1" 
}) => {
  
  const waveStyles = {
    // Smooth single wave
    wave1: (
      <path d="M0,64 C320,100 420,20 640,64 L640,0 L0,0 Z" />
    ),
    
    // Double wave
    wave2: (
      <>
        <path d="M0,32 C160,80 320,0 640,32 L640,0 L0,0 Z" opacity="0.5" />
        <path d="M0,48 C160,96 320,16 640,48 L640,0 L0,0 Z" />
      </>
    ),
    
    // Sharp peaks
    wave3: (
      <path d="M0,64 L80,32 L160,64 L240,32 L320,64 L400,32 L480,64 L560,32 L640,64 L640,0 L0,0 Z" />
    ),
    
    // Gentle curve
    wave4: (
      <path d="M0,48 Q160,80 320,48 T640,48 L640,0 L0,0 Z" />
    ),
    
    // Wavy curve (most common)
    wave5: (
      <path d="M0,32 C80,64 160,0 240,32 S400,64 480,32 S640,0 640,32 L640,0 L0,0 Z" />
    )
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full z-10 pointer-events-none" 
         style={{ transform: 'translateY(50%)' }}>
      <svg 
        viewBox="0 0 640 64" 
        preserveAspectRatio="none"
        className="w-full h-auto block"
        style={{ height: '100px' }} // Adjust height as needed
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={waveColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={waveColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        <g fill={waveColor}>
          {waveStyles[style]}
        </g>
      </svg>
    </div>
  );
};

export default WaveDivider;