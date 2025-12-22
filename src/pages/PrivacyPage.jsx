import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

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
      } catch {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const cleanHTML = DOMPurify.sanitize(policy);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="min-h-screen flex justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-lg rounded-lg p-8">
          <h2 className="text-white font-bold text-lg mb-2">
            Privacy Policy
          </h2>

          {loading && <p className="text-gray-300">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && (
            <div
              className="policy-content text-gray-200 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cleanHTML }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
