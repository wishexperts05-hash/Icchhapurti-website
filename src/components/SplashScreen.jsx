import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/homePage"); // Redirect to login
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup when unmounted
  }, [navigate]);

  return (
    <div className="splash-container">

      {/* Background Image */}
      <div className="background-image"></div>
      <div className="background-dark-overlay"></div>

      {/* Logo on top */}
      <div className="logo">
        <img src="/logo-white.png" alt="Logo" />
      </div>

      {/* Centered Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="centered-video"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

    </div>
  );
};

export default SplashScreen;
