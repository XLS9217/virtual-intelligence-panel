import React, { useState } from "react";
import InfoCard from "./UI_Props/Components/InfoCard";
import LinkSessionReport from "./UI_Props/LinkSessionReport";
import ChatPanel from "./UI_Props/ChatPanel";

function LinkSessionLayout({ sessionId }) {
  const [zoomedIn, setZoomedIn] = useState(false);

  const handleZoomToggle = () => {
    setZoomedIn((prev) => !prev);
  };

  return (
    <>
      <div className="main-layout">
        <div className="left-panel">
          <LinkSessionReport
            sessionId={sessionId}
            zoomedIn={zoomedIn}
            onToggleZoom={handleZoomToggle}
          />
        </div>

        <div className="right-panel" style={{ width: "75%" }}>
          <InfoCard>
            <ChatPanel socketUrl={`ws://${__BACKEND_HOST__}/link_session`} sessionId={sessionId}/>
          </InfoCard>
        </div>
      </div>
    </>
  );
}

export default LinkSessionLayout;
