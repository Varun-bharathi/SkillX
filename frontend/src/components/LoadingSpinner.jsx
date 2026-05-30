import React from "react";

export default function LoadingSpinner() {
  const spinnerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    gap: "16px"
  };

  const ringStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "4px solid var(--border-color)",
    borderTopColor: "var(--color-primary)",
    animation: "spin 1s linear infinite"
  };

  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={spinnerStyle}>
      <style>{keyframesStyle}</style>
      <div style={ringStyle}></div>
      <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.95rem" }}>
        Loading SkillX experience...
      </p>
    </div>
  );
}
