import React, { useState } from "react";
import "../App.css";

export default function AgentConfiguration() {
  const [agentName, setAgentName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [userInstruction, setUserInstruction] = useState("");

  const handleAddAgent = async () => {
    const data = {
      agent_name: agentName,
      session_id: sessionId,
      user_instruction: userInstruction
    };

    try {
      const resp = await fetch(`http://${__BACKEND_HOST__}/edit_host`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await resp.json();
      console.log("Edit Host Result:", result);
    } catch (err) {
      console.error("Failed to edit host:", err);
    }
  };

  return (
    <div className="agent-config-wrapper">
      <div className="agent-config-top-panel">
        <input
          type="text"
          placeholder="Agent Name"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className={`agent-input ${agentName ? "glow" : ""}`}
        />
        <input
          type="text"
          placeholder="Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className={`agent-input ${sessionId ? "glow" : ""}`}
        />
        <button onClick={handleAddAgent} className="agent-add-button">
            Edit Host
        </button>
      </div>

      <div className="agent-config-bottom-panel">
        <textarea
          placeholder="Enter agent instruction prompt here..."
          value={userInstruction}
          onChange={(e) => setUserInstruction(e.target.value)}
          className="agent-prompt-area"
        />
      </div>
    </div>
  );
}
