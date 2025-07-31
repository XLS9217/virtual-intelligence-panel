import React from "react";
import "./Components.css";

function InfoCard({ children }) {
  return (
    <div className="info-card">
      {children}
    </div>
  );
}

export default InfoCard;
