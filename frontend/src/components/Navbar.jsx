import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { Sun, Moon, Bell, Menu, GraduationCap, LogOut, Settings } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme, user, logout } = useLms();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  const navStyle = {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    borderBottom: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-navbar)",
    backdropFilter: "blur(var(--glass-blur))",
    position: "sticky",
    top: 0,
    zIndex: 99,
    width: "100%"
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.3rem",
    fontWeight: 800,
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    cursor: "pointer"
  };

  const iconButtonStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    transition: "all var(--transition-fast)",
    position: "relative"
  };

  return (
    <header style={navStyle}>
      {/* Left side: Hamburger and Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {user.isLoggedIn && (
          <button 
            onClick={onToggleSidebar}
            style={{
              padding: "8px",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            className="sidebar-toggle"
          >
            <Menu size={22} />
          </button>
        )}

        <div style={logoStyle} onClick={() => navigate(user.isLoggedIn ? "/dashboard" : "/")}>
          <div style={{
            background: "var(--gradient-primary)",
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff"
          }}>
            <GraduationCap size={20} />
          </div>
          <span style={{ letterSpacing: "-0.03em" }}>
            Aura<span className="gradient-text">LMS</span>
          </span>
        </div>
      </div>

      {/* Right side: Quick actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Dark/Light Toggler */}
        <button 
          onClick={toggleTheme}
          style={iconButtonStyle}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
          title="Toggle Dark/Light Mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user.isLoggedIn ? (
          <>
            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={iconButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
                onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                title="Notifications"
              >
                <Bell size={18} />
                <span style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-accent)",
                  boxShadow: "0 0 10px var(--color-accent)"
                }}></span>
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  width: "280px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "16px",
                  zIndex: 100,
                  animation: "scaleIn 0.2s var(--ease-premium)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <h5 style={{ fontWeight: 700, fontSize: "0.9rem" }}>Recent Alerts</h5>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-primary)", fontWeight: 600 }}>Mark all read</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ fontSize: "0.8rem", borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: "6px" }}>
                      <p style={{ fontWeight: 600 }}>🎓 Course Enrolled!</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "2px" }}>You began Advanced CSS mastery.</p>
                    </div>
                    <div style={{ fontSize: "0.8rem" }}>
                      <p style={{ fontWeight: 600 }}>⚡ Upcoming Quiz</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "2px" }}>Submit React Core Quiz within 3 days.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Widget */}
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                padding: "4px 12px 4px 6px", 
                borderRadius: "var(--radius-full)", 
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
              onClick={() => navigate("/profile")}
              className="navbar-profile-trigger"
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.backgroundColor = "var(--bg-card)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              }}
            >
              <div style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                color: "#ffffff"
              }}>
                {user.avatar}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }} className="navbar-username">
                {user.name.split(" ")[0]}
              </span>
            </div>

            {/* Quick LogOut */}
            <button 
              onClick={handleLogoutClick}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-danger)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                transition: "all var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "12px" }}>
            <Link 
              to="/login"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                transition: "all var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--bg-surface)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#ffffff",
                background: "var(--gradient-primary)",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                transition: "all var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
              onMouseOut={(e) => e.currentTarget.style.filter = "none"}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
