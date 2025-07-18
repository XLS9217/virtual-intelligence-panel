import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";

export default function StrategyModal({ strategy, onClose }) {
  const [editing, setEditing] = useState(null);
  const [editingMCP, setEditingMCP] = useState(null);
  const [promptDrafts, setPromptDrafts] = useState({});
  const [newMCPUrls, setNewMCPUrls] = useState({});
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setEditing(null);
        setEditingMCP(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditPrompt = (key, currentPrompt) => {
    setEditing(key);
    setEditingMCP(null);
    setPromptDrafts((prev) => ({ ...prev, [key]: currentPrompt }));
  };

  const handleUpdatePrompt = async (agentKey) => {
    const newPrompt = promptDrafts[agentKey];
    try {
      const resp = await fetch(
        `http://${__BACKEND_HOST__}/agent_setting_update/0?agent_name=${agentKey}&new_setting_prompt=${encodeURIComponent(newPrompt)}`,
        { method: "POST" }
      );
      if (resp.ok) setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMCPServer = async (agentKey) => {
    const url = newMCPUrls[agentKey];
    if (!url?.trim()) return;
    try {
      const resp = await fetch(
        `http://${__BACKEND_HOST__}/add_mcp_server/0?agent_name=${agentKey}&url=${encodeURIComponent(url)}`,
        { method: "POST" }
      );
      if (resp.ok) {
        setNewMCPUrls((prev) => ({ ...prev, [agentKey]: "" }));
        setEditingMCP(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return ReactDOM.createPortal(
    <div className="strategy-modal-overlay">
      <div className="strategy-modal-card" ref={modalRef}>
        <button className="strategy-modal-close" onClick={onClose}>×</button>
        <div className="strategy-modal-title">Strategy: {strategy.strategy}</div>

        <div className="strategy-agent-list">
          {Object.entries(strategy.agents || {}).map(([key, agent]) => {
            const isPromptEditing = editing === key;
            const isMCPEditing = editingMCP === key;

            return (
              <div key={key} className="strategy-agent-card">
                <div><em>Agent:</em> <strong>{agent.name}</strong></div>
                <div><em>LLM:</em> {agent.llm_model}</div>

                <div
                  className={`hover-box ${isPromptEditing ? "editing" : ""}`}
                  onClick={() => handleEditPrompt(key, agent.setting_prompt)}
                >
                  <em>Prompt:</em>
                  {isPromptEditing ? (
                    <div className="prompt-edit-wrapper">
                      <textarea
                        className="strategy-agent-input"
                        value={promptDrafts[key] || ""}
                        rows={3}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setPromptDrafts((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="update-button absolute-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdatePrompt(key);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <span>{agent.setting_prompt}</span>
                  )}
                </div>

                {agent.mcp_servers && (
                  <div
                    className={`hover-box mcp-server-section ${isMCPEditing ? "editing" : ""}`}
                    onClick={() => {
                      setEditing(null);
                      setEditingMCP(key);
                    }}
                  >
                    <div><em>MCP Servers:</em></div>
                    <ul className="mcp-server-list">
                      {agent.mcp_servers.map((url, i) => (
                        <li key={i} className="mcp-url">{url}</li>
                      ))}
                    </ul>
                    {isMCPEditing && (
                      <div className="prompt-edit-wrapper">
                        <input
                          type="text"
                          className="strategy-agent-input"
                          value={newMCPUrls[key] || ""}
                          placeholder="Add new MCP URL"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setNewMCPUrls((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="update-button absolute-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddMCPServer(key);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
