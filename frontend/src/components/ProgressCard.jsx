import React from "react";

export default function ProgressCard({ title, value, subtitle, icon: Icon, trend, type = "primary" }) {
  const getColors = () => {
    switch (type) {
      case "accent":
        return {
          iconBg: "rgba(20, 184, 166, 0.15)",
          iconColor: "var(--color-accent)",
          glow: "rgba(20, 184, 166, 0.05)"
        };
      case "secondary":
        return {
          iconBg: "rgba(168, 85, 247, 0.15)",
          iconColor: "var(--color-secondary)",
          glow: "rgba(168, 85, 247, 0.05)"
        };
      default:
        return {
          iconBg: "rgba(99, 102, 241, 0.15)",
          iconColor: "var(--color-primary)",
          glow: "rgba(99, 102, 241, 0.05)"
        };
    }
  };

  const colors = getColors();

  const cardStyle = {
    padding: "24px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "var(--shadow-sm)",
    transition: "transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)",
    cursor: "default"
  };

  const iconContainerStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: colors.iconBg,
    color: colors.iconColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };

  return (
    <div 
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${colors.glow}, var(--shadow-md)`;
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      <div>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </span>
        <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: "8px 0 4px 0", fontFamily: "var(--font-heading)" }}>
          {value}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {trend && (
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-accent)" }}>
              {trend}
            </span>
          )}
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        </div>
      </div>

      <div style={iconContainerStyle}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
}
