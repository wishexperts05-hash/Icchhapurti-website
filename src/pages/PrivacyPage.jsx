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
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success) {
        const policyContent = data.privacyPolicy?.content;
        if (policyContent) {
          setPolicy(policyContent);
        } else {
          setError("Privacy policy content is not available at this time.");
        }
      } else {
        setError("Unable to load privacy policy. Please try again later.");
      }
    } catch (err) {
      console.error("Failed to load Privacy Policy", err);

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
    fetchPrivacyPolicy();
  }, []);

  const handleRetry = () => {
    fetchPrivacyPolicy();
  };

  // Basic HTML sanitization (remove script tags and dangerous attributes)
  const sanitizeHTML = (html) => {
    if (!html) return "";
    
    // Remove script tags and their content
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers (onclick, onerror, etc.)
    cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    
    // Remove javascript: protocol
    cleaned = cleaned.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
    
    return cleaned;
  };

  const cleanHTML = sanitizeHTML(policy);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-1/4 w-96 h-96 border border-purple-400/30 rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-64 h-64 border border-purple-300/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 border border-pink-400/30 rounded-full"></div>
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

      <div className="min-h-screen flex justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/10 shadow-2xl">
          <h2 className="text-white font-bold text-3xl mb-2">
            Privacy Policy
          </h2>
          <div className="text-gray-300 text-sm mb-6">Last Updated: 1st January, 2025</div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300 text-sm">Loading privacy policy...</p>
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

          {!loading && !error && cleanHTML && (
            <div
              className="policy-content text-gray-200 text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
          )}

          {!loading && !error && !cleanHTML && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-gray-400">No privacy policy available.</p>
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

        .policy-content h1 {
          font-size: 1.5rem;
        }

        .policy-content h2 {
          font-size: 1.25rem;
        }

        .policy-content h3 {
          font-size: 1.125rem;
        }

        .policy-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .policy-content ul,
        .policy-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          padding-left: 0.5rem;
        }

        .policy-content li {
          margin-bottom: 0.5rem;
        }

        .policy-content a {
          color: #a78bfa;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .policy-content a:hover {
          color: #c4b5fd;
        }

        .policy-content strong {
          color: #fff;
          font-weight: 600;
        }

        .policy-content code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .policy-content blockquote {
          border-left: 4px solid #a78bfa;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #d1d5db;
        }

        .policy-content table {
          width: 100%;
          margin: 1rem 0;
          border-collapse: collapse;
        }

        .policy-content th,
        .policy-content td {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem;
          text-align: left;
        }

        .policy-content th {
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPage;