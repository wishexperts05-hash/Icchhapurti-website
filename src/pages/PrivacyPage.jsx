import React, { useEffect, useState } from "react";
import axios from "axios";

const PrivacyPage = () => {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/user/privacyPolicyTermsAndConditions/privacyPolicy`;

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const { data } = await axios.get(API_URL);
        if (data.success) {
          setPolicy(data.privacyPolicy?.content || "");
        } else {
          setError("Unable to load privacy policy.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full"></div>
        <div className="absolute top-40 left-1/3 w-64 h-64 border border-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full"></div>
      </div>

      {/* Stars Animation */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="min-h-screen flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-lg rounded-lg p-8">
          <h2 className="text-white font-bold text-lg mb-2">Privacy & Policy</h2>
          <div className="text-gray-100 text-sm mb-4">
            Effective Date: 1st January, 2025
          </div>

          {/* Loading, Error & Data Display */}
          {loading && (
            <div className="text-gray-300 text-sm">Loading...</div>
          )}

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          {!loading && !error && (
            <div className="text-gray-200 whitespace-pre-line leading-relaxed text-sm">
              {policy}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPage;
