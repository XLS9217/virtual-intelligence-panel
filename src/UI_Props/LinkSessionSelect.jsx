import React, { useEffect, useState } from "react";
import { getSessionList } from "../api/gateway";
import InfoCard from "./Components/InfoCard";
import "../App.css"


export default function LinkSessionSelect({ onSessionSelect }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getSessionList();
      setItems(data);
    };
    fetch();
  }, []);

  return (
    <div className="session-list-container">
      <div className="session-list-inner">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="session-item-wrapper"
            onClick={() => onSessionSelect(item.session_id)}
            style={{ cursor: "pointer" }}
          >
            <div className="session-info-line">
              <div className="session-info-label">
                <small>Session:</small>{" "}
                <span className="session-attr">{item.session_id}</span>
              </div>
              <div className="session-info-label">
                <small>Clients:</small>{" "}
                <span className="session-attr">{item.clients}</span>
              </div>
              <div className="session-info-label">
                <small>Strategy:</small>{" "}
                <span className="session-attr">{item.strategy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
