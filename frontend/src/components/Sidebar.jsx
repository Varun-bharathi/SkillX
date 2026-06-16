import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  Map, 
  HelpCircle, 
  BarChart2, 
  Compass, 
  User, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useLms();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/catalog", label: "Course Catalog", icon: BookOpen },
    { to: "/learning-path", label: "Learning Path", icon: Map },
    { to: "/quiz", label: "Quiz Arena", icon: HelpCircle },
    { to: "/analytics", label: "Analytics", icon: BarChart2 },
    { to: "/recommendations", label: "Recommendations", icon: Compass },
    { to: "/ai-generator", label: "AI Generator", icon: Sparkles },
    { to: "/profile", label: "My Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings }
  ];

  const sidebarStyle = {
    width: "260px",
    backgroundColor: "var(--bg-sidebar)",
    backdropFilter: "blur(var(--glass-blur))",
    borderRight: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    transition: "transform var(--transition-normal), width var(--transition-normal)",
    zIndex: 98,
    position: "fixed",
    top: "70px",
    bottom: 0,
    left: 0,
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    padding: "24px 16px",
    boxShadow: isOpen ? "var(--shadow-lg)" : "none"
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-secondary)",
    fontWeight: 500,
    fontSize: "0.95rem",
    marginBottom: "8px",
    transition: "all var(--transition-fast)"
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(2px)",
            zIndex: 97
          }}
          className="sidebar-backdrop"
        />
      )}

      <aside style={sidebarStyle} className="lms-sidebar">
        {/* Navigation list */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    onClose();
                  }
                }}
                style={({ isActive }) => ({
                  ...linkStyle,
                  backgroundColor: isActive ? "var(--bg-surface)" : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--text-secondary)",
                  borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                  fontWeight: isActive ? 600 : 500
                })}
                onMouseOver={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.05)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer in Sidebar */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 8px" }}>
            <span style={{ fontSize: "1.2rem" }}>🎓</span>
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Active Student</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-danger)",
              width: "100%",
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all var(--transition-fast)"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
