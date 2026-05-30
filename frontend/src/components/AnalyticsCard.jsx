import React from "react";

export default function AnalyticsCard({ title, subtitle, action, children }) {
  const cardStyle = {
    padding: "24px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    height: "100%",
    minHeight: "350px",
    overflow: "hidden"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px"
  };

  return (
    <div style={cardStyle} className="animate-slide-up">
      <div style={headerStyle}>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div style={{ marginLeft: "auto" }}>
            {action}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, position: "relative", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
