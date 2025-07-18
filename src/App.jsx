import React, { useEffect, useState } from "react";
import "./App.css";
import InfoCard from "./UI_Props/InfoCard";
import IconButton from "./UI_Props/IconButton";
import LinkSessionReport from "./UI_Props/LinkSessionReport";
import ChatPanel from "./UI_Props/ChatPanel";
import AgentConfiguration from "./UI_Props/AgentConfiguation";

function App() {
  const [msg, setMsg] = useState("Hello World");
  const [activeSection, setActiveSection] = useState("link-session");
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  const buttonList = [
    {
      icon: "backlink.png",
      tooltip: "Link Session管理",
      section: "link-session",
      onClick: () => {
        setActiveSection("link-session");
        setShowLeftPanel((prev) => !prev);
      }
    },
    {
      icon: "david.png",
      tooltip: "对话面板",
      section: "chat",
      onClick: () => {
        setActiveSection("chat");
      }
    },
    {
      icon: "masks.png",
      tooltip: "Agent配置",
      section: "agent",
      onClick: () => {
        setActiveSection("agent");
      }
    },
    {
      icon: "cloud.png",
      tooltip: "MCP服务器配置",
      section: "agent",
      onClick: () => {
        setActiveSection("agent");
      }
    }
  ];

  useEffect(() => {}, [activeSection]);

  return (
    <div className="app-container">
      <div className="main-layout">
        {showLeftPanel && (
          <div className="left-panel">
            <LinkSessionReport />
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
            ) : (
              <div>{msg}</div>
            )}
          </InfoCard>
        </div>
      </div>

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
