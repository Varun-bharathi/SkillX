import React from "react";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  const footerStyle = {
    padding: "30px 24px",
    borderTop: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginTop: "auto",
    width: "100%",
    boxSizing: "border-box"
  };

  return (
    <footer style={footerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem", fontWeight: 700 }}>
        <div style={{
          background: "var(--gradient-primary)",
          width: "24px",
          height: "24px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff"
        }}>
          <GraduationCap size={14} />
        </div>
        <span>Aura<span style={{ color: "var(--color-primary)" }}>LMS</span></span>
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
        © {new Date().getFullYear()} SkillX Personalized EdTech Platform. Crafted with React & Vite. All rights reserved.
      </p>
    </footer>
  );
}
