import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import StrategyCard from "./StrategyEdit";
import StrategyModal from "./StrategyEdit";
import "../api/gateway.js";
import { getSessionReport } from "../api/gateway.js";
import IconButton from "./Components/IconButton";
import AgentCard from "./SessionReport/AgentCard.jsx";

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

function RawJsonModal({ data, onClose }) {
  const cleaned = JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "string") {
        return value.replace(/\\n/g, "!!!");
      }
      return value;
    })
  );

  return ReactDOM.createPortal(
    <div className="agent-info-overlay" onClick={onClose}>
      <div className="agent-info-card" onClick={(e) => e.stopPropagation()}>
        <button className="agent-info-close-button" onClick={onClose}>
          ×
        </button>
        <div className="agent-info-title">Raw Session Report</div>
        <pre
          className="agent-info-setting"
          style={{
            fontSize: "0.9rem",
            whiteSpace: "pre-wrap",
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          <code>{JSON.stringify(cleaned, null, 2)}</code>
        </pre>
      </div>
    </div>,
    document.body
  );
}

function LinkSessionReport({ sessionId, zoomedIn, onToggleZoom }) {
  const [report, setReport] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [showStrategyModal, setShowStrategyModal] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getSessionReport(sessionId || 0);
        console.log("Fetched report:", response);
        setReport(response);
      } catch (error) {
        console.error("Failed to fetch session report", error);
      }
    };

    fetchReport();
  }, [sessionId]);

  if (!report || !report.clients) return <div>Loading...</div>;

  return (
    <div className="section-report" style={{ position: "relative" }}>
      <div className="zoom-button-container">
        <IconButton
          icon={zoomedIn ? "zoom-out.png" : "zoom-in.png"}
          tooltip={zoomedIn ? "Zoom Out" : "Zoom In"}
          onClick={onToggleZoom}
        />
      </div>

      <div className="section-title">Session ID: {report.session_id}</div>

      <button
        className="agent-add-button"
        onClick={() => setShowRaw(true)}
        style={{ marginBottom: "1rem" }}
      >
        Show Raw Report
      </button>

      {showRaw && (
        <RawJsonModal data={report} onClose={() => setShowRaw(false)} />
      )}

      <button
        className="agent-add-button"
        onClick={() => setShowStrategyModal(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <img
          src={"settings.png"}
          alt="settings"
          style={{ width: "1.5rem", height: "1.5rem" }}
        />
        <span className="entry-key">Strategy:</span>
        <span className="entry-value">{report.strategy?.strategy}</span>
      </button>

      {showStrategyModal && (
        <StrategyModal
          strategy={report.strategy}
          onClose={() => setShowStrategyModal(false)}
        />
      )}

      <AgentCard agent={report.host} />

      <div className="client-list">
        {report.clients.map((client, index) => (
          <ClientCard key={index} client={client} />
        ))}
      </div>
    </div>
  );
}

export default LinkSessionReport;
