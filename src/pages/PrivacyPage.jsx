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

  const sanitizeHTML = (html) => {
    if (!html) return "";
    
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    cleaned = cleaned.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
    
    return cleaned;
  };

  const cleanHTML = sanitizeHTML(policy);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 border border-purple-400/30 rounded-full"></div>
        <div className="absolute top-40 right-1/3 w-64 h-64 border border-purple-300/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 border border-pink-400/30 rounded-full"></div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
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

      <div className="min-h-screen flex justify-center items-start px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/10 shadow-2xl">
          {/* Header Section */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <h1 className="text-white font-bold text-3xl sm:text-4xl lg:text-5xl mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">Last Updated: 1st January, 2025</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-14 h-14 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-6"></div>
              <p className="text-gray-300 text-base">Loading privacy policy...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <svg className="w-7 h-7 text-red-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <h3 className="text-red-300 font-semibold text-lg mb-2">Error Loading Content</h3>
                  <p className="text-red-200 text-sm sm:text-base mb-4 leading-relaxed">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg text-red-200 text-sm sm:text-base font-medium transition-all hover:scale-105 active:scale-95"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && cleanHTML && (
            <div className="policy-content ">
              <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !cleanHTML && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-gray-400 text-base sm:text-lg">No privacy policy available.</p>
            </div>
          )}
        </div>
      </div>

 <style>{`
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  /* Typography Hierarchy */
  .policy-content h1 {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
    margin-top: 5rem;         /* more space on top */
    margin-bottom: 1.25rem;
    line-height: 1.2;
  }

  .policy-content h2 {
    color: #ffffff;
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 5.5rem;       /* more space on top */
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .policy-content h3 {
    color: #f3f4f6;
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 5.25rem;      /* more space on top */
    margin-bottom: 0.875rem;
    line-height: 1.4;
  }

  .policy-content h4 {
    color: #f3f4f6;
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 3rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .policy-content h5 {
    color: #e5e7eb;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 2.75rem;
    margin-bottom: 0.625rem;
    line-height: 1.5;
  }

  .policy-content h6 {
    color: #e5e7eb;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 2.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  /* First heading adjustment – keep a bit of space, not 0 */
  .policy-content > h1:first-child,
  .policy-content > h2:first-child,
  .policy-content > h3:first-child {
    margin-top: 2rem;
  }

  /* EXTRA: heading inside list item (after number) */
  .policy-content li h1,
  .policy-content li h2,
  .policy-content li h3,
  .policy-content li h4,
  .policy-content li h5,
  .policy-content li h6 {
    margin-top: 1.75rem;      /* space between number and heading block */
  }

  /* Paragraphs */
  .policy-content p {
    color: #e5e7eb;
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1.25rem;
  }

  /* Lists */
  .policy-content ul,
  .policy-content ol {
    margin-left: 1.75rem;
    margin-bottom: 1.5rem;
    padding-left: 0.5rem;
    color: #e5e7eb;
    font-size: 1rem;
    line-height: 1.8;
  }

  .policy-content ul {
    list-style-type: disc;
  }

  .policy-content ol {
    list-style-type: decimal;
  }

  /* EXTRA spacing after number heading (ordered list) */
  .policy-content ol li {
    position: relative;
    margin-bottom: 1.75rem;      /* space between items */
    padding-left: 0.75rem;       /* gap between number and text */
    text-indent: 0;              /* keep all lines aligned */
  }

  .policy-content ul li {
    margin-bottom: 1.25rem;
    padding-left: 0.5rem;
  }

  .policy-content li::marker {
    color: #60a5fa;
  }

  .policy-content ul ul,
  .policy-content ol ol,
  .policy-content ul ol,
  .policy-content ol ul {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  /* Links */
  .policy-content a {
    color: #c4b5fd;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
    transition: all 0.2s ease;
  }

  .policy-content a:hover {
    color: white;
    text-decoration-thickness: 2px;
  }

  /* Strong/Bold */
  .policy-content strong,
  .policy-content b {
    color: #ffffff;
    font-weight: 600;
  }

  /* Emphasis/Italic */
  .policy-content em,
  .policy-content i {
    font-style: italic;
    color: #f3f4f6;
  }

  /* Code */
  .policy-content code {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fbbf24;
    padding: 0.2rem 0.4rem;
    border-radius: 0.375rem;
    font-size: 0.9em;
    font-family: 'Courier New', monospace;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .policy-content pre {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1.25rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .policy-content pre code {
    background-color: transparent;
    padding: 0;
    border: none;
    font-size: 0.875rem;
    color: #e5e7eb;
  }

  /* Blockquotes */
  .policy-content blockquote {
    border-left: 4px solid #60a5fa;
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    background-color: rgba(96, 165, 250, 0.05);
    border-radius: 0 0.5rem 0.5rem 0;
    font-style: italic;
    color: #d1d5db;
  }

  .policy-content blockquote p:last-child {
    margin-bottom: 0;
  }

  /* Tables */
  .policy-content table {
    width: 100%;
    margin: 1.5rem 0;
    border-collapse: collapse;
    font-size: 0.9375rem;
    overflow: hidden;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .policy-content th,
  .policy-content td {
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.875rem 1rem;
    text-align: left;
    color: #e5e7eb;
  }

  .policy-content th {
    background-color: rgba(96, 165, 250, 0.15);
    color: #ffffff;
    font-weight: 600;
  }

  .policy-content tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.03);
  }

  .policy-content tr:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  /* Horizontal Rule */
  .policy-content hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin: 2rem 0;
  }

  /* Images */
  .policy-content img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  /* Responsive Text */
  @media (max-width: 640px) {
    .policy-content h1 {
      font-size: 1.75rem;
    }

    .policy-content h2 {
      font-size: 1.5rem;
    }

    .policy-content h3 {
      font-size: 1.25rem;
    }

    .policy-content p,
    .policy-content ul,
    .policy-content ol {
      font-size: 0.9375rem;
    }

    .policy-content table {
      font-size: 0.875rem;
    }

    .policy-content th,
    .policy-content td {
      padding: 0.625rem 0.75rem;
    }
  }
`}</style>


    </div>
  );
};

export default PrivacyPage;