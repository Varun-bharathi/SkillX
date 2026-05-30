import React, { useState } from "react";
import { useLms } from "../context/LmsContext";
import { Sun, Moon, Bell, User, Sparkles, Check } from "lucide-react";

export default function SettingsPage() {
  const { user, updateSettings, theme, toggleTheme } = useLms();

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [skillsStr, setSkillsStr] = useState(user.targetSkills.join(", "));
  const [pushNotifs, setPushNotifs] = useState(user.notifications?.push ?? true);
  const [emailNotifs, setEmailNotifs] = useState(user.notifications?.email ?? false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const parsedSkills = skillsStr
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    updateSettings({
      name,
      bio,
      targetSkills: parsedSkills,
      notifications: {
        push: pushNotifs,
        email: emailNotifs
      }
    });

    setSuccessMsg("Settings updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "32px"
  };

  const cardPanelStyle = {
    padding: "24px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    boxShadow: "var(--shadow-sm)",
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    marginTop: "6px"
  };

  const themeOptionStyle = (mode) => {
    const isSelected = theme === mode;
    return {
      padding: "16px",
      borderRadius: "var(--radius-md)",
      border: "2px solid",
      borderColor: isSelected ? "var(--color-primary)" : "var(--border-color)",
      backgroundColor: isSelected ? "rgba(99, 102, 241, 0.05)" : "var(--bg-card)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all var(--transition-fast)"
    };
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Settings
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Personalize your profile stats, toggle email/push notifications, and select themes.
        </p>
      </div>

      {successMsg && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          color: "var(--color-success)",
          fontSize: "0.85rem",
          fontWeight: 600,
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={gridStyle} className="grid-2">
        {/* Left column: Profile & Notifications Form */}
        <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Section 1: Profile information */}
          <div style={cardPanelStyle}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={18} style={{ color: "var(--color-primary)" }} />
              <span>Student Profile Details</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Professional Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical", fontFamily: "inherit" }}
                  placeholder="Explain your career roadmap goals..."
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Target Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. React, CSS Grid, Recharts"
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", display: "inline-block" }}>
                  These skills populate the learning roadmap objectives on your profile card.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Notifications Preferences */}
          <div style={cardPanelStyle}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Bell size={18} style={{ color: "var(--color-primary)" }} />
              <span>Notification Preferences</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  style={{ accentColor: "var(--color-primary)", cursor: "pointer", width: "16px", height: "16px" }}
                />
                <div>
                  <p style={{ fontWeight: 600 }}>Enable Dashboard Alerts</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Push active alerts regarding quizzes and courses directly to your top bell panel.</p>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem", borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  style={{ accentColor: "var(--color-primary)", cursor: "pointer", width: "16px", height: "16px" }}
                />
                <div>
                  <p style={{ fontWeight: 600 }}>Enable Email digests</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Receive monthly study recap statistics directly in your mailbox.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: "12px 28px",
              borderRadius: "var(--radius-sm)",
              background: "var(--gradient-primary)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.95rem",
              alignSelf: "flex-start",
              boxShadow: "var(--shadow-glow)",
              transition: "transform var(--transition-fast)"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Save Changes
          </button>
        </form>

        {/* Right column: Dynamic theme switching card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={cardPanelStyle}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} style={{ color: "var(--color-primary)" }} />
              <span>Theme Selector</span>
            </h3>

            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Toggle AuraLMS aesthetic color system instantly between a glowing dark interface or a modern high-contrast clean light theme.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
              {/* Option Dark */}
              <div
                style={themeOptionStyle("dark")}
                onClick={() => theme !== "dark" && toggleTheme()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Moon size={18} style={{ color: "var(--color-primary)" }} />
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Aura Dark</span>
                </div>
                {theme === "dark" && <Check size={16} style={{ color: "var(--color-primary)" }} />}
              </div>

              {/* Option Light */}
              <div
                style={themeOptionStyle("light")}
                onClick={() => theme !== "light" && toggleTheme()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sun size={18} style={{ color: "var(--color-primary)" }} />
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Aura Light</span>
                </div>
                {theme === "light" && <Check size={16} style={{ color: "var(--color-primary)" }} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
