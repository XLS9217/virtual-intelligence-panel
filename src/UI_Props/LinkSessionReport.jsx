import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import StrategyCard from "./StrategyEdit";
import StrategyModal from "./StrategyEdit";

function ClientCard({ client }) {
  const [collapsed, setCollapsed] = useState(true);

  const collapsedText =
    client.ip ||
    Object.values(client).find((v) => typeof v === "string") ||
    "Client";

  return (
    <div
      className={`client-card ${!collapsed ? "expanded" : ""}`}
      onClick={() => setCollapsed((prev) => !prev)}
    >
      {collapsed ? (
        <div className="client-collapsed">({collapsedText})</div>
      ) : (
        Object.entries(client).map(([key, value]) => (
          <div key={key} className="client-entry">
            <span className="entry-key">{key}:</span>
            <span className="entry-value">{value}</span>
          </div>
        ))
      )}
    </div>
  );
}

function AgentInfoCard({ agent, onClose }) {
  return ReactDOM.createPortal(
    <div className="agent-info-overlay" onClick={onClose}>
      <div className="agent-info-card" onClick={(e) => e.stopPropagation()}>
        <button className="agent-info-close-button" onClick={onClose}>
          ×
        </button>
        <div className="agent-info-title">Agent: {agent.name}</div>
        <div className="agent-info-setting">{agent.setting}</div>
      </div>
    </div>,
    document.body
  );
}

function AgentCard({ agent }) {
  const [showDetail, setShowDetail] = useState(false);
  if (!agent) return null;

  return (
    <>
      <div
        className="client-card expanded"
        onClick={() => setShowDetail(true)}
      >
        <div className="client-entry">
          <span className="entry-key">Agent:</span>
          <span className="entry-value">{agent.name}</span>
        </div>
        <div className="client-entry">
          <span className="entry-key">Setting:</span>
          <span className="entry-value">(click to view)</span>
        </div>
      </div>
      {showDetail && (
        <AgentInfoCard agent={agent} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}

function MCPServerCard({ server }) {
  return (
    <div className="client-card expanded">
      <div className="client-entry">
        <span className="entry-key">MCP:</span>
        <span className="entry-value">{server}</span>
      </div>
    </div>
  );
}

function RawJsonModal({ data, onClose }) {
  // Deep clone and normalize newline formatting for display
  const cleaned = JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === "string") {
      return value.replace(/\\n/g, "!!!"); // in case string has literal \n
    }
    return value;
  }));

  return ReactDOM.createPortal(
    <div className="agent-info-overlay" onClick={onClose}>
      <div className="agent-info-card" onClick={(e) => e.stopPropagation()}>
        <button className="agent-info-close-button" onClick={onClose}>×</button>
        <div className="agent-info-title">Raw Session Report</div>
        <pre className="agent-info-setting" style={{
          fontSize: "0.9rem",
          whiteSpace: "pre-wrap",
          overflowY: "auto",
          maxHeight: "100%"
        }}>
          <code>{JSON.stringify(cleaned, null, 2)}</code>
        </pre>
      </div>
    </div>,
    document.body
  );
}


function LinkSessionReport() {
  const [report, setReport] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [showStrategyModal, setShowStrategyModal] = useState(false); // 👈 for controlling strategy modal

  useEffect(() => {
    fetch(`http://${__BACKEND_HOST__}/session_report/0`)
      .then(async (resp) => {
        const text = await resp.text();
        console.log(text);
        setReport(JSON.parse(text));
      })
      .catch(console.error);
  }, []);

  if (!report || !report.clients) return <div>Loading...</div>;

  return (
    <div className="section-report">
      <div className="section-title">Session ID: {report.session_id}</div>

      <button
        className="agent-add-button"
        onClick={() => setShowRaw(true)}
        style={{ marginBottom: "1rem" }}
      >
        Show Raw Report
      </button>

      {showRaw && (
        <RawJsonModal
          data={report}
          onClose={() => {
            console.log("close json modal");
            setShowRaw(false);
          }}
        />
      )}

      <button
        className="agent-add-button"
        onClick={() => setShowStrategyModal(true)}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <img src={"settings.png"} alt="settings" style={{ width: "1.5rem", height: "1.5rem" }} />
        <span className="entry-key">Strategy:</span>
        <span className="entry-value">{report.strategy?.strategy}</span>
      </button>

      {showStrategyModal && (
        <StrategyModal
          strategy={report.strategy}
          onClose={() => setShowStrategyModal(false)}
        />
      )}

      <MCPServerCard server={report.avaliable_mcp_server} />
      <AgentCard agent={report.agent} />

      <div className="client-list">
        {report.clients.map((client, index) => (
          <ClientCard key={index} client={client} />
        ))}
      </div>
    </div>
  );
}

export default LinkSessionReport;

