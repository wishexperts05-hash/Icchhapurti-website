import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CosmicChatSupport() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const chatAreaRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  const fetchChatHistory = async (conversationId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/chat/getPreviousConversation`,
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch chat history');
      const data = await res.json();
      if (data.success) {
        setConversation(data.data.conversation);
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;
    const messageToSend = inputValue;
    setInputValue('');

    const dummyMsg = {
      _id: `dummy-${Date.now()}`,
      message: "Your message has been received. Our team will respond shortly.",
      sender: { userType: 'Admin', Username: 'Support', profileImage: null },
      createdAt: new Date().toISOString(),
      isDummy: true,
    };
    setMessages(prev => [...prev, dummyMsg]);

    try {
      setSending(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/chat/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: messageToSend })
        }
      );
      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setMessages(prev => prev.filter(m => !m.isDummy));
          fetchChatHistory();
        }, 3000);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setInputValue(messageToSend);
      setMessages(prev => prev.filter(m => !m.isDummy));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const navigate = useNavigate();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const isCurrentUser = (message) => {
    return message.sender.userType === 'User' &&
      (message.sender.userId === currentUser?._id ||
        message.sender.userId === currentUser?.id);
  };

  return (
    <div style={{ height: '100dvh' }} className="flex flex-col relative overflow-hidden">
      {/* Spiral background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-radial from-orange-300/80 via-orange-400/60 to-transparent blur-sm animate-pulse pointer-events-none"></div>

      {/* Main Container */}
      <div
        style={{ backgroundColor: "#FAF6EE", height: '100dvh' }}
        className="relative z-10 flex flex-col max-w-4xl mx-auto w-full overflow-hidden"
      >
        {/* Header — back button + title on the same bar */}
        <div
          style={{ backgroundColor: "#FAF6EE", borderBottom: "1px solid #E5DDD0" }}
          className="flex-shrink-0 flex items-center gap-3 px-4 sm:px-6 md:px-10 py-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center justify-between flex-1 min-w-0">
            <h1 className="text-gray-900 text-xl font-semibold truncate">Chat Support</h1>
            {conversation && (
              <span className="text-sm text-gray-500 flex-shrink-0">
                {conversation.participants.find(p => p.userType === 'Admin')?.userType || 'Support'}
              </span>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-5 flex flex-col gap-4"
          style={{ minHeight: 0 }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isUser = isCurrentUser(message);
              const senderInitial = message.sender.Username?.charAt(0).toUpperCase() || 'U';

              return (
                <div
                  key={message._id}
                  className={`flex gap-3 max-w-[70%] animate-[slideIn_0.3s_ease-out] ${isUser ? 'self-end flex-row-reverse' : 'self-start'
                    } ${message.isSending ? 'opacity-70' : ''}`}
                >
                  {/* Avatar */}
                  {message.sender.profileImage ? (
                    <img
                      src={message.sender.profileImage}
                      alt={message.sender.Username}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isUser ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                      {senderInitial}
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-xl text-sm leading-relaxed relative ${isUser
                          ? 'bg-orange-400 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                        }`}
                    >
                      {message.message}
                      {message.isSending && (
                        <Loader2 className="w-3 h-3 animate-spin absolute -right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                      )}
                    </div>
                    <div className={`flex items-center gap-2 text-xs text-gray-400 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <span>{isUser ? 'You' : 'Admin'}</span>
                      <span>•</span>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <div
          style={{ backgroundColor: "#D7D1C5", borderTop: "1px solid #C8C0B5" }}
          className="flex-shrink-0 px-3 sm:px-6 md:px-10 py-3 sm:py-4"
        >
          <div className="flex gap-2 sm:gap-3 bg-white/60 rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 border border-white/40">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type message here..."
              disabled={sending || loading}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 text-xs sm:text-sm placeholder-gray-400 disabled:opacity-50 min-w-0"
            />
            <button
              onClick={sendMessage}
              disabled={sending || loading || inputValue.trim() === ''}
              className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0"
            >
              {sending ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  <span className="hidden sm:inline">Sending</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}