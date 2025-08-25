// App.jsx
import React, { useState } from "react";
import "./App.css";
import InfoCard from "./UI_Props/Components/InfoCard";
import LinkSessionSelect from "./UI_Props/LinkSessionSelect";
import LinkSessionLayout from "./LinkSessionLayout";

function App() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

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
        <LinkSessionLayout sessionId={selectedSessionId} />
      )}
    </div>
  );
}

export default App;
