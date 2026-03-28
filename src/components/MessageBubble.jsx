import React, { useState } from "react";
import { FiCornerUpLeft, FiCheck, FiSmile } from "react-icons/fi";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function avatarColor(name) {
  const palette = [
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
  return palette[Math.abs(h) % palette.length];
}

function initials(name) {
  return name ? name.slice(0, 2).toUpperCase() : "??";
}

export default function MessageBubble({
  message,
  isMe,
  messages,
  onReply,
  onReact,
  myId,
}) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const repliedMsg = message.replyTo
    ? messages.find((m) => m.id === message.replyTo.id)
    : null;
  const hasReactions =
    message.reactions && Object.keys(message.reactions).length > 0;

  return (
    <div
      className={`flex items-end gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"} mb-1`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar */}
      {!isMe && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 select-none"
          style={{ background: avatarColor(message.username) }}
        >
          {initials(message.username)}
        </div>
      )}

      <div
        className={`flex flex-col max-w-[72%] ${isMe ? "items-end" : "items-start"}`}
      >
        {!isMe && (
          <span className="text-xs font-bold text-brand-500 mb-1 ml-1 font-mono">
            {message.username}
          </span>
        )}

        {/* Reply preview */}
        {repliedMsg && (
          <div
            className={`flex items-stretch gap-0 rounded-xl overflow-hidden mb-1 max-w-full cursor-default
            ${isMe ? "bg-brand-50 border border-brand-100" : "bg-surface-100 border border-surface-200"}`}
          >
            <div className="w-1 flex-shrink-0 bg-brand-400" />
            <div className="flex flex-col py-1.5 px-2.5 min-w-0">
              <span className="text-xs font-bold text-brand-500 font-mono truncate">
                {repliedMsg.username}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {repliedMsg.imageUrl
                  ? "📷 Photo"
                  : repliedMsg.text.slice(0, 60)}
                {repliedMsg.text.length > 60 ? "…" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-3.5 py-2.5 rounded-2xl shadow-bubble
          ${
            isMe
              ? "bg-brand-500 text-white rounded-br-sm"
              : "bg-white text-gray-800 border border-surface-200 rounded-bl-sm"
          }`}
        >
          {/* Image */}
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="shared"
              className="rounded-xl max-w-full max-h-48 object-cover mb-2 block"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {message.text && (
            <p className="text-sm leading-relaxed break-words">
              {message.text}
            </p>
          )}

          <div className={`flex items-center gap-1 mt-1 justify-end`}>
            <span
              className={`text-[10px] font-mono ${isMe ? "text-brand-200" : "text-gray-400"}`}
            >
              {fmtTime(message.timestamp)}
            </span>
            {isMe && <FiCheck className="text-brand-200 text-xs" />}
          </div>
        </div>

        {/* Reactions display */}
        {hasReactions && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(message.reactions).map(
              ([emoji, users]) =>
                users.length > 0 && (
                  <button
                    key={emoji}
                    onClick={() => onReact(message.id, emoji)}
                    className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full border transition-all
                    ${
                      users.includes(myId)
                        ? "bg-brand-100 border-brand-300 text-brand-700"
                        : "bg-white border-surface-200 text-gray-600 hover:border-brand-300"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="font-mono font-semibold">
                      {users.length}
                    </span>
                  </button>
                ),
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div
        className={`flex flex-col gap-1 transition-opacity duration-150 relative
        ${showActions ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={() => onReply(message)}
          className="w-7 h-7 rounded-full bg-white border border-surface-200 text-gray-400 hover:text-brand-500 hover:border-brand-300
            flex items-center justify-center text-sm shadow-sm transition-all"
        >
          <FiCornerUpLeft />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowReactions((p) => !p)}
            className="w-7 h-7 rounded-full bg-white border border-surface-200 text-gray-400 hover:text-brand-500 hover:border-brand-300
              flex items-center justify-center text-sm shadow-sm transition-all"
          >
            <FiSmile />
          </button>
          {showReactions && (
            <div
              className={`absolute bottom-full mb-1 bg-white border border-surface-200 rounded-2xl shadow-card p-1.5 flex gap-1 z-50 animate-pop
              ${isMe ? "right-0" : "left-0"}`}
            >
              {QUICK_REACTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    onReact(message.id, e);
                    setShowReactions(false);
                  }}
                  className="w-8 h-8 text-lg flex items-center justify-center rounded-xl hover:bg-brand-50 transition-colors"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
