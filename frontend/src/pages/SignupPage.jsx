import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const { signup } = useLms();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all requested fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Call context signup
    signup(name, email, password);
    navigate("/dashboard");
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 70px)",
    padding: "24px",
    background: "radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)"
  };

  const formCardStyle = {
    width: "100%",
    maxWidth: "440px",
    padding: "36px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    boxShadow: "var(--shadow-lg)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    animation: "scaleIn 0.3s var(--ease-premium)"
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: "0.95rem",
    transition: "border-color var(--transition-fast)"
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        {/* Brand Logo header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: "var(--gradient-primary)",
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff"
          }}>
            <GraduationCap size={24} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)", marginTop: "8px" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Begin your learning journey with dynamic courses
          </p>
        </div>

        {error && (
          <div style={{ padding: "10px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--color-danger)", fontSize: "0.8rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Input fields */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={inputGroupStyle}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Varun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. varun@aurademy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "44px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "var(--radius-sm)",
              background: "var(--gradient-primary)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginTop: "10px",
              boxShadow: "var(--shadow-glow)",
              transition: "transform var(--transition-fast)"
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.filter = "none"}
          >
            Create Account
          </button>
        </form>

        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", marginTop: "8px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 700, color: "var(--color-primary)" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
