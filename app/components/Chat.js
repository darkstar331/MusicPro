import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { Send } from 'lucide-react';

export default function Chat() {
  const { data: session } = useSession();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null); // Use useRef to persist socket instance

  useEffect(() => {
    if (!session) return;

    // Initialize socket only if it's not already initialized
    if (!socketRef.current) {
      socketRef.current = io();

      // Handle incoming messages
      socketRef.current.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up when the component unmounts
      return () => {
        socketRef.current.disconnect();
        socketRef.current = null;
      };
    }
  }, [session]);

  if (!session) {
    return <p className="text-center">Please sign in to use the chat.</p>;
  }

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const messageData = {
        user: session.user.name,
        message: inputMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Emit the message to the server
      socketRef.current.emit('sendMessage', messageData);

      // Add the message to local state
      setMessages((prevMessages) => [...prevMessages, messageData]);

      setInputMessage('');
    }
  };

  return (
    <div className="flex h-[600px] w-full max-w-md flex-col rounded-md border-4 bg-background shadow-xl">
      {/* Chat Header */}
      <div className="flex items-center bg-black border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
          <div>
            <h2 className="font-semibold">{session.user.name}</h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 space-y-4 bg-[#181818] overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isSender = msg.user === session.user.name;
          return (
            <div
              key={index}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isSender
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {!isSender && (
                  <p className="mb-1 text-xs font-medium">{msg.user}</p>
                )}
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-right text-xs ${
                    isSender ? 'text-white/80' : 'text-black/60'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-[#181818]">
        <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2">
          <input
            type="text"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-50"
            disabled={!inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
