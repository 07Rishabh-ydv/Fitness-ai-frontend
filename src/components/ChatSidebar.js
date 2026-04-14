import React from 'react';
import { motion } from 'framer-motion';
import { ChatCircleText, Plus, Trash } from '@phosphor-icons/react';

const ChatSidebar = ({ sessions, currentSession, onSelectSession, onNewChat, onDeleteSession }) => {
  return (
    <div className="bg-[#111111] border border-[#27272A] p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg sm:text-xl font-bold tracking-tight uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          CHATS
        </h2>
        <button
          onClick={onNewChat}
          data-testid="new-chat-btn"
          className="p-2 bg-[#FF3B30] hover:bg-[#D32F2F] transition-colors"
        >
          <Plus size={14} weight="bold" />
        </button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-hide">
        {sessions.length === 0 && (
          <p className="text-xs text-[#A1A1AA] text-center py-8 uppercase tracking-wide">
            No conversations yet
          </p>
        )}
        {sessions.map((session) => (
          <motion.div
            key={session.chat_session_id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group"
          >
            <button
              onClick={() => onSelectSession(session.chat_session_id)}
              data-testid={`chat-session-${session.chat_session_id}`}
              className={`w-full text-left p-3 border border-[#27272A] hover:bg-[#1A1A1A] transition-all duration-200 relative ${
                currentSession === session.chat_session_id ? 'bg-[#1A1A1A] border-l-2 border-l-[#FF3B30]' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <ChatCircleText size={14} className="text-[#007AFF] mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">
                    {session.first_message?.substring(0, 40) || 'New Chat'}
                  </p>
                  <p className="text-[10px] text-[#A1A1AA] mt-1">
                    {session.message_count} msgs
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.chat_session_id);
                  }}
                  data-testid={`delete-session-${session.chat_session_id}`}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#27272A] transition-all"
                >
                  <Trash size={12} className="text-[#A1A1AA]" />
                </button>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
