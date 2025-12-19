import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, Mail, MessageCircle, Search, Loader2 } from "lucide-react";

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/faq/list`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch FAQs");
        }

        const json = await res.json();
        setFaqs(json.data || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
        <p className="text-lg text-slate-300">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="relative  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-400/20 rounded-full" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl animate-bounce">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-300 text-md max-w-2xl mx-auto">
            Find answers to common questions about our services and features
          </p>
        </div>

        {/* Search Bar */}
        {/* <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
            />
          </div>
          {searchQuery && (
            <p className="text-center text-slate-400 text-sm mt-3">
              Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div> */}

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq._id}
              className={`group bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden border transition-all duration-300 transform hover:scale-[1.01] ${
                openFAQ === faq._id
                  ? "border-blue-500/50 shadow-xl shadow-blue-500/20"
                  : "border-slate-700/50 hover:border-slate-600/50"
              }`}
            >
              <button
                onClick={() => toggleFAQ(faq._id)}
                className="w-full px-6 py-6 flex items-start justify-between text-left transition-colors"
              >
                <div className="flex gap-4 flex-1">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-md font-semibold text-white pt-2 pr-4 group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      openFAQ === faq._id
                        ? "bg-blue-500 rotate-180"
                        : "bg-slate-700 group-hover:bg-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 text-white" />
                  </div>
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFAQ === faq._id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                    <p className="text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/60 rounded-2xl mb-4">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg">
                {searchQuery
                  ? "No FAQs match your search"
                  : "No FAQs available right now"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contact Section */}
        {/* <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-8 border border-blue-500/30 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-slate-300">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href="mailto:support@example.com"
              className="flex items-center gap-4 bg-slate-800/60 hover:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 transition-all hover:border-blue-500/50 hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Email Support</p>
                <p className="text-slate-400 text-sm">We'll respond within 24h</p>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-4 bg-slate-800/60 hover:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 transition-all hover:border-purple-500/50 hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Live Chat</p>
                <p className="text-slate-400 text-sm">Available Mon-Fri, 9am-6pm</p>
              </div>
            </a>
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}