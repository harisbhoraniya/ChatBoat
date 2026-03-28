import React, { useState } from 'react';
import JoinScreen from './components/JoinScreen';
import ChatScreen from './components/ChatScreen';

export default function App() {
  const [session, setSession] = useState(null);
  return session
    ? <ChatScreen username={session.username} roomId={session.roomId} onLeave={() => setSession(null)} />
    : <JoinScreen onJoin={(u, r) => setSession({ username: u, roomId: r })} />;
}
