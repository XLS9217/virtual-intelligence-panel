import React, { useEffect, useState } from "react";
import { getSessionList } from "../api/gateway";
import InfoCard from "./Components/InfoCard";


export default function LinkSessionSelect() {
  const [inputValue, setInputValue] = useState("")
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const data = await getSessionList()
      setItems(data)
    }
    fetch()
  }, [])

  const handleGo = () => {
    if (inputValue.trim()) {
      setItems(prev => [
        { session_id: inputValue.trim(), clients: 0, strategy: "manual" },
        ...prev
      ])
      setInputValue("")
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "1rem",
        boxSizing: "border-box"
      }}
    >
      <div style={{ width: "100%", maxWidth: "600px", height: "100%" }}>
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <input
            style={{ flex: 1 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Enter session ID"
          />
          <button onClick={handleGo}>Go</button>
        </div>

        {items.map((item, idx) => (
            <div key={idx} style={{ width: "90%", margin: "0 auto" }}>
                <InfoCard>
                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem"
                    }}
                >
                    <div
                    style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "green",
                        marginRight: "0.75rem"
                    }}
                    />
                    <span style={{ marginRight: "1rem" }}>Session: {item.session_id}</span>
                    <span style={{ marginRight: "1rem" }}>Clients: {item.clients}</span>
                    <span>Strategy: {item.strategy}</span>
                </div>
                </InfoCard>
            </div>
            ))}
      </div>
    </div>
  )
}