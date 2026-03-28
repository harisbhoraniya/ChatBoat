import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import {
  FiSend,
  FiLogOut,
  FiTrash2,
  FiUsers,
  FiX,
  FiCornerUpLeft,
  FiMessageCircle,
  FiChevronDown,
  FiSmile,
  FiImage,
  FiAnchor,
} from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "../hooks/useChat";

export default function ChatScreen({ username, roomId, onLeave }) {
  const {
    messages,
    typingUsers,
    onlineUsers,
    myId,
    sendMessage,
    addReaction,
    startTyping,
    stopTyping,
    clearMessages,
  } = useChat(roomId, username);

  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // { url, file }

  const msgEndRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const emojiRef = useRef(null);

  const scrollBottom = useCallback((smooth = true) => {
    msgEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  useLayoutEffect(() => {
    if (isNearBottom()) {
      scrollBottom(false);
    }
  }, [messages.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  };

  // Close emoji on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target))
        setShowEmoji(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSend = () => {
    if (!input.trim() && !imagePreview) return;
    sendMessage(
      input,
      replyTo
        ? { id: replyTo.id, username: replyTo.username, text: replyTo.text }
        : null,
      imagePreview?.url || null,
    );
    setInput("");
    setReplyTo(null);
    setImagePreview(null);
    setShowEmoji(false);
    setTimeout(() => scrollBottom(), 50);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.value ? startTyping() : stopTyping();
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview({ url: ev.target.result, file });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const grouped = messages.map((msg, i) => {
    const prev = messages[i - 1];
    return {
      ...msg,
      _grouped:
        prev &&
        prev.senderId === msg.senderId &&
        msg.timestamp - prev.timestamp < 120000,
    };
  });

  function avatarColor(name) {
    const p = [
      "#4f6ef7",
      "#f97316",
      "#10b981",
      "#f43f5e",
      "#8b5cf6",
      "#06b6d4",
      "#eab308",
    ];
    let h = 0;
    for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
    return p[Math.abs(h) % p.length];
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-surface-50 via-brand-50 to-surface-100">
      {/* Blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full bg-brand-100 opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-brand-200 opacity-15 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative flex flex-col w-full h-full bg-white overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-surface-100 bg-white/95 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0">
              <FiAnchor className="text-white text-base" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono text-brand-400 bg-brand-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                  Room
                </span>
                <span className="text-sm font-bold font-mono text-gray-800 truncate max-w-[140px]">
                  {roomId}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                <span className="text-xs text-gray-400 font-mono">
                  {onlineUsers.length} online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMembers((p) => !p)}
              className="relative w-8 h-8 rounded-xl border border-surface-200 text-gray-400 hover:text-brand-500 hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center text-sm transition-all"
            >
              <FiUsers />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                {onlineUsers.length}
              </span>
            </button>
            <button
              onClick={() => setShowClear(true)}
              className="w-8 h-8 rounded-xl border border-surface-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-sm transition-all"
            >
              <FiTrash2 />
            </button>
            <button
              onClick={onLeave}
              className="w-8 h-8 rounded-xl border border-surface-200 text-gray-400 hover:text-brand-500 hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center text-sm transition-all"
            >
              <FiLogOut />
            </button>
          </div>
        </header>

        {/* ── Members panel ── */}
        {showMembers && (
          <div className="bg-surface-50 border-b border-surface-200 px-5 py-3 flex-shrink-0 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400">
                Members ({onlineUsers.length})
              </span>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {onlineUsers.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white border border-surface-200 rounded-full px-3 py-1 text-xs font-mono text-gray-700"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                    style={{ background: avatarColor(u) }}
                  >
                    {u.slice(0, 2).toUpperCase()}
                  </div>
                  {u}
                  {u === username && (
                    <span className="text-[9px] bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-full font-bold">
                      you
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto chat-bg px-3 py-4 relative"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <FiMessageCircle size={40} className="opacity-30" />
              <p className="font-semibold text-gray-500">No messages yet</p>
              <p className="text-xs font-mono">Start the conversation!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 pb-2">
              {grouped.map((msg) => (
                <div key={msg.id} className={msg._grouped ? "mt-0.5" : "mt-3"}>
                  <MessageBubble
                    message={msg}
                    isMe={msg.senderId === myId}
                    messages={messages}
                    onReply={setReplyTo}
                    onReact={addReaction}
                    myId={myId}
                  />
                </div>
              ))}
              <TypingIndicator typingUsers={typingUsers} />
              <div ref={msgEndRef} />
            </div>
          )}

          {showScrollBtn && (
            <button
              onClick={() => scrollBottom()}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg hover:bg-brand-600 transition-all animate-fade-in"
            >
              <FiChevronDown />
            </button>
          )}
        </div>

        {/* ── Reply bar ── */}
        {replyTo && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-brand-50 border-t border-brand-100 flex-shrink-0 animate-fade-in">
            <FiCornerUpLeft className="text-brand-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-brand-500 font-mono">
                {replyTo.username}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {replyTo.imageUrl ? "📷 Photo" : replyTo.text}
              </div>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <FiX size={15} />
            </button>
          </div>
        )}

        {/* ── Image preview ── */}
        {imagePreview && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-surface-50 border-t border-surface-200 flex-shrink-0 animate-fade-in">
            <img
              src={imagePreview.url}
              alt="preview"
              className="w-12 h-12 rounded-xl object-cover border border-surface-200"
            />
            <div className="flex-1 text-xs text-gray-500 font-mono truncate">
              {imagePreview.file?.name}
            </div>
            <button
              onClick={() => setImagePreview(null)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiX size={15} />
            </button>
          </div>
        )}

        {/* ── Input ── */}
        <div className="px-4 py-3 bg-white border-t border-surface-100 flex-shrink-0">
          <div className="flex items-end gap-2 bg-surface-50 border-2 border-surface-200 rounded-2xl px-3 py-2 focus-within:border-brand-400 focus-within:shadow-glow transition-all duration-150">
            {/* Emoji picker toggle */}
            <div ref={emojiRef} className="relative self-end mb-0.5">
              <button
                onClick={() => setShowEmoji((p) => !p)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-all ${showEmoji ? "text-brand-500 bg-brand-50" : "text-gray-400 hover:text-brand-400 hover:bg-brand-50"}`}
              >
                <FiSmile />
              </button>
              {showEmoji && (
                <div className="absolute bottom-full left-0 mb-2 z-50 shadow-card rounded-2xl overflow-hidden animate-pop">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    height={350}
                    width={300}
                    searchDisabled
                    skinTonesDisabled
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              )}
            </div>

            {/* Image attach */}
            <button
              onClick={() => fileRef.current?.click()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-400 hover:bg-brand-50 transition-all self-end mb-0.5"
            >
              <FiImage />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFile}
            />

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300 font-display resize-none leading-relaxed py-1 max-h-28"
              style={{ scrollbarWidth: "none" }}
            />

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!input.trim() && !imagePreview}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all self-end flex-shrink-0
                ${
                  input.trim() || imagePreview
                    ? "bg-brand-500 text-white shadow-md hover:bg-brand-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-surface-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              <FiSend />
            </button>
          </div>
          <p className="text-[10px] text-gray-300 font-mono mt-1.5 text-right">
            Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* ── Clear confirm modal ── */}
      {showClear && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-card border border-surface-200 p-6 max-w-xs w-full animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Clear Chat?
            </h3>
            <p className="text-sm text-gray-500 text-center font-mono mb-5">
              All messages will be deleted for everyone in this room.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClear(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-surface-200 text-gray-500 font-semibold text-sm hover:border-brand-300 hover:text-brand-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearMessages();
                  setShowClear(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
