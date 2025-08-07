import React, { useEffect, useState } from "react";
import "./App.css";
import InfoCard from "./UI_Props/Components/InfoCard";
import IconButton from "./UI_Props/Components/IconButton";
import LinkSessionReport from "./UI_Props/LinkSessionReport";
import ChatPanel from "./UI_Props/ChatPanel";
import AgentConfiguration from "./UI_Props/AgentConfiguation";
import LinkSessionSelect from "./UI_Props/LinkSessionSelect";

function App() {
  const [msg, setMsg] = useState("Hello World");
  const [activeSection, setActiveSection] = useState("link-session");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const buttonList = [
    {
      icon: "backlink.png",
      tooltip: "Link Session管理",
      section: "link-session",
      onClick: () => {
        setActiveSection("link-session");
        setShowLeftPanel((prev) => !prev);
      },
    },
    {
      icon: "david.png",
      tooltip: "对话面板",
      section: "chat",
      onClick: () => {
        setActiveSection("chat");
      },
    },
    {
      icon: "masks.png",
      tooltip: "Agent配置",
      section: "agent",
      onClick: () => {
        setActiveSection("agent");
      },
    },
    {
      icon: "cloud.png",
      tooltip: "MCP服务器配置",
      section: "agent",
      onClick: () => {
        setActiveSection("agent");
      },
    },
  ];

  // Handler to select session from LinkSessionSelect
  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowLeftPanel(true);
    setActiveSection("session");
  };

  useEffect(() => {}, [activeSection]);

  return (
  <div className="app-container">
    {!selectedSessionId ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "90vw",
          height: "80vh",
        }}
      >
        <InfoCard>
          <LinkSessionSelect onSessionSelect={handleSessionSelect} />
        </InfoCard>
      </div>
    ) : (
      <div className="main-layout">
        {showLeftPanel && activeSection === "session" && (
          <div className="left-panel">
            <LinkSessionReport sessionId={selectedSessionId} />
          </div>
        )}

        <div
          className="right-panel"
          style={{ width: showLeftPanel ? "75%" : "100%" }}
        >
          <InfoCard>
            {activeSection === "chat" ? (
              <ChatPanel socketUrl={`ws://${__BACKEND_HOST__}/link_session`} />
            ) : activeSection === "agent" ? (
              <AgentConfiguration />
            ) : activeSection === "session" ? (
              <div>Session <b>{selectedSessionId}</b> loaded</div>
            ) : (
              <div>{msg}</div>
            )}
          </InfoCard>
        </div>
      </div>
    )}

    <div className="bottom-bar">
      <div className="left-group">
        {buttonList
          .filter((btn) => btn.section === "link-session")
          .map(({ icon, tooltip, section, onClick }) => (
            <IconButton
              key={section}
              icon={icon}
              tooltip={tooltip}
              section={section}
              activeSection={activeSection}
              onClick={onClick}
            />
          ))}
      </div>

      <div className="center-group">
        {buttonList
          .filter((btn) => btn.section !== "link-session")
          .map(({ icon, tooltip, section, onClick }) => (
            <IconButton
              key={tooltip}
              icon={icon}
              tooltip={tooltip}
              section={section}
              activeSection={activeSection}
              onClick={onClick}
            />
          ))}
      </div>
    </div>
  </div>
);
}

export default App;
