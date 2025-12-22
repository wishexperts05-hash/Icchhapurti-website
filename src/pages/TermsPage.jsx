import React, { useEffect, useState } from "react";

const TermsPage = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/privacyPolicyTermsAndConditions/termsAndCondition`,
        { 
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data?.success) {
        const termsContent = data.termsAndCondition?.content;
        if (termsContent) {
          setContent(termsContent);
        } else {
          setError("Terms content is not available at this time.");
        }
      } else {
        setError("Failed to load terms and conditions. Please try again later.");
      }
    } catch (err) {
      console.error("Failed to load Terms & Conditions", err);
      
      if (err.name === 'AbortError') {
        setError("Request timed out. Please check your connection and try again.");
      } else if (err.message.includes('Server error')) {
        setError(err.message + ". Please try again later.");
      } else if (err.message.includes('Failed to fetch')) {
        setError("Unable to reach the server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleRetry = () => {
    fetchTerms();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
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

      <div className="min-h-screen flex flex-col items-center px-4 py-10 relative z-10">
        <div className="w-full max-w-5xl rounded-lg p-8 bg-white/10 backdrop-blur border border-white/10 shadow-2xl">
          <h2 className="text-white font-bold text-3xl mb-2">Terms & Conditions</h2>
          <div className="text-gray-300 text-sm mb-6">Effective Date: 1st January, 2025</div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300 text-sm">Loading terms and conditions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-red-300 font-semibold mb-1">Error Loading Content</h3>
                  <p className="text-red-200 text-sm mb-3">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded text-red-200 text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && content && (
            <div
              className="text-gray-200 leading-relaxed text-sm policy-content prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {!loading && !error && !content && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400">No terms and conditions available.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .policy-content h1,
        .policy-content h2,
        .policy-content h3 {
          color: #fff;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .policy-content p {
          margin-bottom: 1rem;
        }

        .policy-content ul,
        .policy-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .policy-content li {
          margin-bottom: 0.5rem;
        }

        .policy-content a {
          color: #60a5fa;
          text-decoration: underline;
        }

        .policy-content a:hover {
          color: #93c5fd;
        }

        .policy-content strong {
          color: #fff;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default TermsPage;