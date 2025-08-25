import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../../App.css";
import { editHost } from "../../api/gateway.js";

function AgentInfoCard({ agent, sessionId, onClose }) {
  const [editing, setEditing] = useState(false);
  const [setting, setSetting] = useState(agent.setting);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await editHost(sessionId, agent.name, setting);
      setEditing(false);
    } catch (err) {
      console.error("Failed to edit host:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="agent-info-overlay" onClick={onClose}>
      <div className="agent-info-card" onClick={(e) => e.stopPropagation()}>
        <button className="agent-info-close-button" onClick={onClose}>×</button>
        <div className="agent-info-title">Agent: {agent.name}</div>

        {editing ? (
          <>
            <textarea
              className="agent-info-setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              style={{ whiteSpace: "pre-wrap", minHeight: "6rem" }}
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                className="agent-add-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                className="agent-add-button"
                onClick={() => {
                  setEditing(false);
                  setSetting(agent.setting);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div
            className="agent-info-setting"
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}
            title="Click to edit"
          >
            {setting}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function AgentCard({ agent, sessionId }) {
  const [showDetail, setShowDetail] = useState(false);
  if (!agent) return null;

  return (
    <>
      <div
        className="client-card expanded"
        onClick={() => setShowDetail(true)}
      >
        <div className="client-entry">
          <span className="entry-key">Host Agent:</span>
          <span className="entry-value">{agent.name}</span>
        </div>
        <div className="client-entry">
          <span className="entry-key">Setting:</span>
          <span className="entry-value">(click to view/edit)</span>
        </div>
      </div>
      {showDetail && (
        <AgentInfoCard
          agent={agent}
          sessionId={sessionId}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

export default AgentCard;
