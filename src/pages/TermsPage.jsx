import React, { useEffect, useState } from "react";
import axios from "axios";

const TermsPage = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTerms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/privacyPolicyTermsAndConditions/termsAndCondition`); // ✓ update your endpoint
      if (res.data?.success) {
        setContent(res.data.termsAndCondition?.content || "");
      }
    } catch (err) {
      console.error("Failed to load Terms & Conditions", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full"></div>
        <div className="absolute top-40 left-1/3 w-64 h-64 border border-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full"></div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="min-h-screen flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-5xl rounded-lg p-8 bg-white/10 backdrop-blur border border-white/10">
          <h2 className="text-white font-bold text-lg mb-2">Terms & Conditions</h2>
          <div className="text-gray-100 text-sm mb-4">Effective Date: 1st January, 2025</div>

          {loading ? (
            <p className="text-gray-200 text-sm">Loading...</p>
          ) : (
            <div className="text-gray-200 whitespace-pre-line leading-relaxed text-sm">
              {content}
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

export default TermsPage;
