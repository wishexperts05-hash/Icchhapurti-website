import React, { useEffect, useState } from "react";

const PrivacyPage = () => {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/user/privacyPolicyTermsAndConditions/privacyPolicy`;

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success && data?.privacyPolicy?.content) {
        setPolicy(data.privacyPolicy.content);
      } else {
        setError("Privacy policy content is not available.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (err.message.includes("Server error")) {
        setError(err.message);
      } else {
        setError("Unable to load privacy policy.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const sanitizeHTML = (html) => {
    if (!html) return "";
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, "");
  };

  const cleanHTML = sanitizeHTML(policy);

  return (
    <div
      className="min-h-screen relative overflow-hidden "
    >

      {/* Background Rings */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 border border-purple-400/30 rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-64 h-64 border border-purple-300/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 border border-pink-400/30 rounded-full"></div>
      </div>


      {/* MAIN WRAPPER (NO bg-white HERE) */}
      <div className="min-h-screen flex justify-center items-start px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* CONTENT CARD */}
        <div className="w-full max-w-4xl rounded-2xl p-6 sm:p-8 lg:p-12
          bg-white/95 backdrop-blur-xl border border-white/10 shadow-2xl">

          {/* Header */}
          <div className="mb-8 pb-6 border-b">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-sm">Last Updated: 1st January, 2025</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-20">
              <div className="w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700">Loading privacy policy...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={fetchPrivacyPolicy}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && cleanHTML && (
            <div
              className="policy-content text-black"
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
          )}

          {!loading && !error && !cleanHTML && (
            <div className="text-center py-20 text-gray-500">
              No privacy policy available.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%,100%{opacity:.3}
          50%{opacity:1}
        }
        .policy-content h1,.policy-content h2,.policy-content h3{
          font-weight:700;margin-top:2.5rem
        }
        .policy-content p{line-height:1.8;margin-bottom:1rem}
        .policy-content ul{margin-left:1.5rem;list-style:disc}
      `}</style>
    </div>
  );
};

export default PrivacyPage;
