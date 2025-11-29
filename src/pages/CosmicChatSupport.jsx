import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function CosmicChatSupport() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const chatAreaRef = useRef(null);

  // Get current user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  // Fetch chat history
  const fetchChatHistory = async (conversationId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/chat/getPreviousConversation
`,
        {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch chat history');
      }

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

  // Send message
  const sendMessage = async () => {
    if (inputValue.trim() === '' ) return;

    // const tempMessage = {
    //   _id: `temp-${Date.now()}`,
    //   message: inputValue,
    //   sender: {
    //     userId: currentUser?._id || currentUser?.id,
    //     userType: 'User',
    //     Username: currentUser?.name || currentUser?.username || 'You',
    //     profileImage: currentUser?.profileImage || null
    //   },
    //   createdAt: new Date().toISOString(),
    //   isDeleted: false,
    //   isSending: true
    // };

    // setMessages(prev => [...prev, tempMessage]);
    const messageToSend = inputValue;
    setInputValue('');

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
          body: JSON.stringify({
            // conversationId: conversation._id,
            message: messageToSend
          })
        }
      );

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();

      if (data.success) {
        fetchChatHistory()
      }

      // Replace temp message with actual message from server
      // setMessages(prev => 
      //   prev.map(msg => 
      //     msg._id === tempMessage._id 
      //       ? { ...data.data.message, isSending: false }
      //       : msg
      //   )
      // );
    } catch (err) {
      console.error("Error sending message:", err);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      // Restore input value
      setInputValue(messageToSend);
    } finally {
      setSending(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversation on mount (you can pass conversationId as prop or get from route params)
  useEffect(() => {
    const conversationId = '69117b01621a69e4dab6af3c'; // Replace with actual ID from props/params
    if (conversationId) {
      fetchChatHistory(conversationId);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
    <div className="relative h-screen overflow-hidden ">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-800/30 via-transparent to-transparent"></div>

      {/* Stars */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[30%] left-[20%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[60%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[50%] left-[50%] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[10%] left-[80%] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[60%] left-[90%] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[80%] left-[33%] animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>

      {/* Spiral */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-radial from-orange-300/80 via-orange-400/60 to-transparent blur-sm animate-pulse"></div>

      {/* Main Container */}
      <div className="relative z-10 h-full flex flex-col max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-10 py-5 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-semibold">Chat Support</h1>
            {conversation && (
              <div className="text-sm text-white/70">
                {conversation.participants.find(p => p.userType === 'Admin')?.userType || 'Support'}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto px-10 py-5 flex flex-col gap-4"
        >
          { messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-white/50">
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

                  <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-xl text-sm leading-relaxed relative ${isUser
                          ? 'bg-orange-300/90 text-gray-800 rounded-br-sm'
                          : 'bg-white/95 text-gray-800 rounded-bl-sm'
                        }`}
                    >
                      {message.message}
                      {message.isSending && (
                        <Loader2 className="w-3 h-3 animate-spin absolute -right-5 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div className={`flex items-center gap-2 text-xs text-white/70 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <span>{message.sender.userType == "User" ? "You" : "Admin"}</span>
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
        <div className="px-10 py-5 bg-slate-900/80 backdrop-blur-lg">
          <div className="flex gap-3 bg-white/10 rounded-full px-5 py-3 border border-white/20">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type message here..."
              disabled={sending || loading}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/50 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={sending || loading || inputValue.trim() === ''}
              className="bg-blue-500/80 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}