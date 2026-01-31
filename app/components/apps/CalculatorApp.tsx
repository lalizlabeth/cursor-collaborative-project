"use client";

import { useState } from "react";

const buttons = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="];

export function CalculatorApp() {
  const [display] = useState("0");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
      <input
        type="text"
        value={display}
        readOnly
        style={{
          width: "100%",
          padding: 12,
          fontSize: 24,
          textAlign: "right",
          border: "1px solid var(--window-border-dark)",
          borderRadius: 6,
          fontFamily: "monospace",
          background: "rgba(0,0,0,0.02)",
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, flex: 1 }}>
        {buttons.map((btn) => (
          <button
            key={btn}
            style={{
              padding: 12,
              fontSize: 16,
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 6,
              background: ["÷", "×", "−", "+", "="].includes(btn) ? "var(--pastel-blue)" : "rgba(0,0,0,0.03)",
              cursor: "pointer",
              fontFamily: "inherit",
              gridColumn: btn === "0" ? "span 2" : undefined,
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
