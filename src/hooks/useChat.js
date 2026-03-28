import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const MSG_KEY = (r) => `chatboat_msgs_${r}`;
const TYPE_KEY = (r) => `chatboat_typing_${r}`;
const ONL_KEY = (r) => `chatboat_online_${r}`;

export function useChat(roomId, username) {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const myId = useRef(uuidv4());
  const pollRef = useRef(null);
  const typeRef = useRef(null);

  // ✅ SAFE CHECK
  const isBrowser = typeof window !== "undefined";

  // 🔹 Load messages
  const loadMsgs = useCallback(() => {
    if (!isBrowser) return [];
    try {
      return JSON.parse(localStorage.getItem(MSG_KEY(roomId)) || "[]");
    } catch {
      return [];
    }
  }, [roomId, isBrowser]);

  // 🔹 Update presence
  const updatePresence = useCallback(() => {
    if (!isBrowser) return;
    try {
      const d = JSON.parse(localStorage.getItem(ONL_KEY(roomId)) || "{}");
      d[myId.current] = { username, ts: Date.now() };
      localStorage.setItem(ONL_KEY(roomId), JSON.stringify(d));
    } catch {}
  }, [roomId, username, isBrowser]);

  // 🔹 Clean inactive users
  const cleanPresence = useCallback(() => {
    if (!isBrowser) return [];
    try {
      const d = JSON.parse(localStorage.getItem(ONL_KEY(roomId)) || "{}");
      const now = Date.now();

      Object.keys(d).forEach((k) => {
        if (now - d[k].ts > 8000) delete d[k];
      });

      localStorage.setItem(ONL_KEY(roomId), JSON.stringify(d));
      return Object.values(d).map((u) => u.username);
    } catch {
      return [];
    }
  }, [roomId, isBrowser]);

  // 🔹 Stop typing
  const stopTyping = useCallback(() => {
    if (!isBrowser) return;
    try {
      const d = JSON.parse(localStorage.getItem(TYPE_KEY(roomId)) || "{}");
      delete d[myId.current];
      localStorage.setItem(TYPE_KEY(roomId), JSON.stringify(d));
    } catch {}
  }, [roomId, isBrowser]);

  // 🔹 Start typing
  const startTyping = useCallback(() => {
    if (!isBrowser) return;

    try {
      const d = JSON.parse(localStorage.getItem(TYPE_KEY(roomId)) || "{}");
      d[myId.current] = { username, ts: Date.now() };
      localStorage.setItem(TYPE_KEY(roomId), JSON.stringify(d));
    } catch {}

    if (typeRef.current) clearTimeout(typeRef.current);

    typeRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [roomId, username, stopTyping, isBrowser]);

  // 🔹 Send message
  const sendMessage = useCallback(
    (text, replyTo = null, imageUrl = null) => {
      if (!isBrowser) return;
      if (!text.trim() && !imageUrl) return;

      const msgs = loadMsgs();

      msgs.push({
        id: uuidv4(),
        senderId: myId.current,
        username,
        text: text.trim(),
        imageUrl,
        replyTo,
        timestamp: Date.now(),
        reactions: {},
      });

      localStorage.setItem(MSG_KEY(roomId), JSON.stringify(msgs));
      setMessages([...msgs]);

      stopTyping();
    },
    [roomId, username, loadMsgs, stopTyping, isBrowser],
  );

  // 🔹 Add reaction
  const addReaction = useCallback(
    (msgId, emoji) => {
      if (!isBrowser) return;

      const msgs = loadMsgs();
      const msg = msgs.find((m) => m.id === msgId);
      if (!msg) return;

      if (!msg.reactions) msg.reactions = {};
      if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

      const idx = msg.reactions[emoji].indexOf(myId.current);

      if (idx === -1) msg.reactions[emoji].push(myId.current);
      else msg.reactions[emoji].splice(idx, 1);

      if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];

      localStorage.setItem(MSG_KEY(roomId), JSON.stringify(msgs));
      setMessages([...msgs]);
    },
    [roomId, loadMsgs, isBrowser],
  );

  // 🔹 Clear messages
  const clearMessages = useCallback(() => {
    if (!isBrowser) return;
    localStorage.removeItem(MSG_KEY(roomId));
    setMessages([]);
  }, [roomId, isBrowser]);

  // 🔹 Main effect
  useEffect(() => {
    if (!roomId || !username || !isBrowser) return;

    const currentId = myId.current;

    updatePresence();
    setMessages(loadMsgs());

    pollRef.current = setInterval(() => {
      setMessages(loadMsgs());
      updatePresence();
      setOnlineUsers(cleanPresence());

      try {
        const d = JSON.parse(localStorage.getItem(TYPE_KEY(roomId)) || "{}");
        const now = Date.now();

        setTypingUsers(
          Object.entries(d)
            .filter(([id, v]) => id !== currentId && now - v.ts < 3000)
            .map(([, v]) => v.username),
        );
      } catch {
        setTypingUsers([]);
      }
    }, 500);

    return () => {
      clearInterval(pollRef.current);
      stopTyping();
    };
  }, [
    roomId,
    username,
    updatePresence,
    cleanPresence,
    loadMsgs,
    stopTyping,
    isBrowser,
  ]);

  return {
    messages,
    typingUsers,
    onlineUsers,
    myId: myId.current,
    sendMessage,
    addReaction,
    startTyping,
    stopTyping,
    clearMessages,
  };
}
