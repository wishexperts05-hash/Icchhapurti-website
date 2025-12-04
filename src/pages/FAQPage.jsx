import React, { useState, useEffect } from "react";

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/faq/list`, // adjust to your route
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // call FAQ API endpoint [web:101][web:103]

        if (!res.ok) {
          throw new Error("Failed to fetch FAQs");
        }

        const json = await res.json(); // { success, data: [...], pagination } [web:100][web:104]
        setFaqs(json.data || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center text-white">
        Loading FAQs...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* background stuff stays the same */}

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-6">FAQs</h1>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(faq._id)}
                className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-white transition-colors"
              >
                <div className="flex gap-4 flex-1">
                  <span className="text-2xl font-bold text-gray-800 flex-shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 pt-1">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      openFAQ === faq._id
                        ? "bg-orange-400 rotate-45"
                        : "bg-orange-300"
                    }`}
                  >
                    <span className="text-white text-xl font-bold">+</span>
                  </div>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === faq._id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {!faqs.length && (
            <p className="text-white/80 text-center">
              No FAQs available right now.
            </p>
          )}
        </div>

        {/* Contact section stays same */}
      </div>
    </div>
  );
}
