import React from "react";
import { X } from "lucide-react";

export default function ModalComponent({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 13, 22, 0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "20px",
    animation: "fadeIn 0.2s ease-out"
  };

  const contentStyle = {
    backgroundColor: "var(--bg-card)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
    boxShadow: "var(--shadow-lg)",
    width: "100%",
    maxWidth: "650px",
    maxHeight: "85vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    animation: "scaleIn 0.3s var(--ease-premium)"
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border-color)",
    position: "sticky",
    top: 0,
    backgroundColor: "var(--bg-card)",
    zIndex: 10
  };

  const bodyStyle = {
    padding: "24px",
    overflowY: "auto"
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{title}</h3>
          <button 
            onClick={onClose} 
            style={{ 
              color: "var(--text-secondary)", 
              padding: "4px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background var(--transition-fast)" 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--bg-surface)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X size={20} />
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
