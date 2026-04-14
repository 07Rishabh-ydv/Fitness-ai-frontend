import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperPlaneRight } from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const INTENT_COLORS = {
  WORKOUT: '#007AFF',
  NUTRITION: '#FF9500',
  DIETARY_ADVICE: '#34C759',
  GENERAL_HEALTH: '#AF52DE',
  OTHER: '#A1A1AA'
};

const INTENT_LABELS = {
  WORKOUT: 'Workout Advice',
  NUTRITION: 'Nutrition Guide',
  DIETARY_ADVICE: 'Dietary Plan',
  GENERAL_HEALTH: 'Health Tips',
  OTHER: 'General'
};

// Custom markdown components for organized rendering
const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-base font-bold text-[#FF3B30] uppercase tracking-wide border-b border-[#27272A] pb-2 mb-3 mt-4 first:mt-0"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-[#FF3B30] uppercase tracking-wide border-b border-[#27272A]/50 pb-1.5 mb-2.5 mt-4 first:mt-0"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-bold text-[#007AFF] mt-3 mb-1.5 first:mt-0"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xs font-bold text-[#FF9500] uppercase tracking-wide mt-2.5 mb-1 first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-[13px] leading-[1.7] text-[#E4E4E7] mb-2.5 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-3 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-3 ml-1 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[13px] leading-[1.6] text-[#E4E4E7] flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] mt-[7px] flex-shrink-0" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#A1A1AA]">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#007AFF] pl-3 my-2.5 bg-[#007AFF]/5 py-2 pr-3">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <pre className="bg-[#0A0A0A] border border-[#27272A] p-3 my-2.5 overflow-x-auto">
          <code className="text-xs text-[#34C759] font-mono">{children}</code>
        </pre>
      );
    }
    return <code className="bg-[#27272A] text-[#FF9500] px-1.5 py-0.5 text-xs font-mono">{children}</code>;
  },
  hr: () => <hr className="border-[#27272A] my-3" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-xs border border-[#27272A]">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#1A1A1A] border-b border-[#27272A]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#A1A1AA]">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-xs text-[#E4E4E7] border-b border-[#27272A]/50">{children}</td>
  ),
};

const ChatInterface = ({ messages, isLoading, onSendMessage, inputMessage, setInputMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="bg-[#111111] border border-[#27272A] h-[calc(100vh-120px)] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-hide" data-testid="chat-messages">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div
                className="w-40 h-40 mx-auto mb-6 opacity-15"
                style={{
                  backgroundImage: `url('https://static.prod-images.emergentagent.com/jobs/642fb84d-8ee6-4082-a35e-cd6b395c1a21/images/b2b3f6487a2d7402387dd8aec96926070e4cdfb032dda552d8acb5bcb654d94c.png')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
              <h3
                className="text-2xl font-bold tracking-tight uppercase mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Start Your Fitness Journey
              </h3>
              <p className="text-[#A1A1AA] text-sm mb-6">
                Ask me about workouts, nutrition, or health advice
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Create a beginner workout plan',
                  'What should I eat for muscle gain?',
                  'How much protein do I need daily?',
                  'Tips for better sleep and recovery'
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputMessage(q); }}
                    data-testid={`suggestion-${i}`}
                    className="text-xs text-left p-3 bg-[#0A0A0A] border border-[#27272A] text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div
                    className="bg-[#007AFF] text-white px-4 py-3 max-w-[75%] rounded-sm"
                    data-testid="user-message"
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-[88%] space-y-1.5">
                    {/* Intent Badge */}
                    {msg.intent && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: INTENT_COLORS[msg.intent] || '#A1A1AA' }}
                        />
                        <span
                          className="text-[10px] font-bold tracking-[0.2em] uppercase"
                          style={{ color: INTENT_COLORS[msg.intent] || '#A1A1AA' }}
                          data-testid="intent-badge"
                        >
                          {INTENT_LABELS[msg.intent] || msg.intent?.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    {/* Message Card */}
                    <div
                      className="bg-[#1A1A1A] text-white border border-[#27272A] overflow-hidden"
                      data-testid="ai-message"
                    >
                      {/* Colored top bar based on intent */}
                      <div
                        className="h-[2px]"
                        style={{ backgroundColor: INTENT_COLORS[msg.intent] || '#27272A' }}
                      />
                      <div className="px-5 py-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[88%] space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A1A1AA]">
                  Analyzing...
                </span>
              </div>
              <div className="bg-[#1A1A1A] border border-[#27272A] overflow-hidden">
                <div className="h-[2px] bg-[#FF3B30] animate-pulse" />
                <div className="px-5 py-4 flex gap-2">
                  <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#27272A]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about workouts, nutrition, or health..."
            data-testid="chat-input"
            className="flex-1 bg-[#0A0A0A] border border-[#27272A] px-4 py-3 text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF3B30] transition-all duration-200 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            data-testid="send-message-btn"
            className="bg-[#FF3B30] px-5 py-3 hover:bg-[#D32F2F] transition-all duration-200 disabled:opacity-50"
          >
            <PaperPlaneRight size={18} weight="bold" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
