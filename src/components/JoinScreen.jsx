import React, { useState } from "react";
import { FiUser, FiWifi, FiArrowRight, FiAnchor } from "react-icons/fi";

export default function JoinScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [ip, setIp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = "Username is required";
    else if (username.trim().length < 2) e.username = "Minimum 2 characters";
    if (!ip.trim()) e.ip = "Room IP is required";
    return e;
  };

  const handleJoin = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setTimeout(() => onJoin(username.trim(), ip.trim()), 700);
  };

  const onKey = (e) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-surface-50 via-brand-50 to-surface-100 p-4">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full bg-brand-100 opacity-40 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full bg-brand-200 opacity-20 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-card border border-surface-200 p-8 animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg mb-4">
            <FiAnchor className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-display tracking-tight">
            ChatBoat
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-mono">
            Room-Based Messenger
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 font-mono">
              Username
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 bg-surface-50
              ${errors.username ? "border-red-400 bg-red-50" : "border-surface-200 focus-within:border-brand-400 focus-within:shadow-glow focus-within:bg-white"}`}
            >
              <FiUser
                className={`flex-shrink-0 ${errors.username ? "text-red-400" : "text-gray-400"}`}
              />
              <input
                type="text"
                autoFocus
                maxLength={20}
                placeholder="Enter your name"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((p) => ({ ...p, username: "" }));
                }}
                onKeyDown={onKey}
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm font-display placeholder:text-gray-300"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-500 mt-1 font-mono">
                {errors.username}
              </p>
            )}
          </div>

          {/* IP / Room Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 font-mono">
              IP Address{" "}
              <span className="text-gray-300 normal-case">(room code)</span>
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 bg-surface-50
              ${errors.ip ? "border-red-400 bg-red-50" : "border-surface-200 focus-within:border-brand-400 focus-within:shadow-glow focus-within:bg-white"}`}
            >
              <FiWifi
                className={`flex-shrink-0 ${errors.ip ? "text-red-400" : "text-gray-400"}`}
              />
              <input
                type="text"
                maxLength={60}
                placeholder="e.g. 192.168.1.1"
                value={ip}
                onChange={(e) => {
                  setIp(e.target.value);
                  setErrors((p) => ({ ...p, ip: "" }));
                }}
                onKeyDown={onKey}
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm font-mono placeholder:text-gray-300"
              />
            </div>
            {errors.ip ? (
              <p className="text-xs text-red-500 mt-1 font-mono">{errors.ip}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Anyone entering the same IP joins your room
              </p>
            )}
          </div>

          {/* Join button */}
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700
              text-white font-bold text-sm tracking-wide transition-all duration-150 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? (
              <span className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{ animationDelay: `${i * 0.15}s` }}
                    className="w-2 h-2 rounded-full bg-white/70 inline-block animate-bounce"
                  />
                ))}
              </span>
            ) : (
              <>
                CONNECT <FiArrowRight />
              </>
            )}
          </button>
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400 font-mono flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            No account needed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-300 inline-block" />
            Same IP = same room
          </span>
          <p className="text-xs text-slate-800 ">Created by @harissticx</p>
        </div>
      </div>
    </div>
  );
}
