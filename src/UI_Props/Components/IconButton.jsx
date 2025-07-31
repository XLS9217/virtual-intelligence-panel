import React from "react";
import "./Components.css";

function IconButton({ icon, tooltip, section, activeSection, onClick }) {
  const isActive = section === activeSection;
  const stateClass = isActive ? "active" : "default";

  return (
    <div className="icon-button-wrapper">
      {tooltip && <div className="tooltip">{tooltip}</div>}
      <button className={`icon-button ${stateClass}`} onClick={onClick}>
        <img src={icon} alt={tooltip} />
      </button>
    </div>
  );
}

export default IconButton;
