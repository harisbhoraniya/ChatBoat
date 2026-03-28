import React from 'react';

export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers.length) return null;
  const label = typingUsers.length === 1
    ? `${typingUsers[0]} is typing`
    : `${typingUsers.slice(0,-1).join(', ')} and ${typingUsers.at(-1)} are typing`;

  return (
    <div className="flex items-center gap-2 px-4 pb-2 animate-fade-in">
      <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-2xl rounded-bl-sm px-3 py-2 shadow-bubble">
        {[1,2,3].map(i => (
          <span key={i}
            style={{animationDelay:`${(i-1)*0.2}s`}}
            className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block animate-bounce" />
        ))}
      </div>
      <span className="text-xs text-gray-400 font-mono italic">{label}…</span>
    </div>
  );
}
