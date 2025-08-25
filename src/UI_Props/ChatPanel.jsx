import React, { useState, useEffect, useRef } from "react";
import "../App.css";

const RotatingLoader = () => <div className="rotating-loader" />;

const UserBubble = ({ content, isExpanded, toggle }) => (
  <div className="user-bubble-wrapper" onClick={toggle}>
    <div className="chat-bubble user-bubble">
      {isExpanded ? content : tryExtractContent(content)}
    </div>
  </div>
);

const AIBubble = ({ content, isExpanded, toggle }) => (
  <div className="ai-bubble-wrapper" onClick={toggle}>
    <div className="chat-bubble ai-bubble">
      {isExpanded ? content : tryExtractContent(content)}
    </div>
  </div>
);

function tryExtractContent(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed?.payload?.content !== undefined) {
      return parsed.payload.content;
    }
  } catch {
    // fallback
  }
  return jsonStr;
}

export default function ChatPanel({ socketUrl, sessionId  }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mode, setMode] = useState("user_chat");

  const socketRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      const init_msg = {
        role: "monitor",
        platform: "cli",
        session_id: sessionId,
      };
      socketRef.current.send(JSON.stringify(init_msg));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (
          parsed.type === "control" &&
          parsed.payload?.action === "thinking"
        ) {
          setIsThinking(parsed.payload.content === true);
          return;
        }

        const pretty = JSON.stringify(parsed, null, 2);
        setMessages((prev) => [
          ...prev,
          { content: pretty, fromUser: false, isExpanded: false },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { content: event.data, fromUser: false, isExpanded: false },
        ]);
      }
    };

    return () => socketRef.current.close();
  }, [socketUrl]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const outgoing = {
      type: mode,
      payload: { recognized: false, content: input },
    };

    setMessages((prev) => [
      ...prev,
      {
        content: JSON.stringify(outgoing, null, 2),
        fromUser: true,
        isExpanded: false,
      },
    ]);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(outgoing));
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleExpanded = (index) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  return (
    <div className="chat-panel">
      <div ref={historyRef} className="chat-history">
        {messages.length === 0 && (
          <div className="no-messages">No messages yet</div>
        )}
        {messages.map((msg, idx) =>
          msg.fromUser ? (
            <UserBubble
              key={idx}
              content={msg.content}
              isExpanded={msg.isExpanded}
              toggle={() => toggleExpanded(idx)}
            />
          ) : (
            <AIBubble
              key={idx}
              content={msg.content}
              isExpanded={msg.isExpanded}
              toggle={() => toggleExpanded(idx)}
            />
          )
        )}
        {isThinking && <RotatingLoader />}
      </div>

      <div className="chat-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message and press Enter to send..."
          className="chat-input"
        />
        <div className="chat-side-panel">
          <button
            className="mode-toggle-button"
            onClick={() =>
              setMode((prev) =>
                prev === "user_chat" ? "execute_strategy" : "user_chat"
              )
            }
          >
            Mode: {mode === "user_chat" ? "Chat" : "Action"}
          </button>
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
