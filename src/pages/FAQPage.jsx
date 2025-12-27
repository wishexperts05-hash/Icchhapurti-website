import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, Loader2 } from "lucide-react";

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
          `${import.meta.env.VITE_API_URL}/api/user/faq/list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const json = await res.json();
        setFaqs(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
  text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold mb-1">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-sm">
            Quick answers to common questions
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className={`rounded-xl  border transition ${
                openFAQ === faq._id
                  ? "border-blue-500/50 bg-slate-800"
                  : "border-slate-700 bg-slate-800/60"
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq._id)}
                className="w-full px-4 py-3 flex items-center cursor-pointer justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-medium">
                    {faq.question}
                  </h3>
                </div>

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openFAQ === faq._id ? "rotate-180 text-blue-400" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Answer */}
              {openFAQ === faq._id && (
                <div className="px-4 pb-4 text-slate-300 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty */}
        {faqs.length === 0 && (
          <p className="text-center text-slate-400 text-sm mt-12">
            No FAQs available
          </p>
        )}
      </div>
    </div>
  );
}
