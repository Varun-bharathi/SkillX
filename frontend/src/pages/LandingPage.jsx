import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { mockTestimonials } from "../data/mockData";
import { Compass, BarChart3, HelpCircle, Award, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const { user } = useLms();
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % mockTestimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + mockTestimonials.length) % mockTestimonials.length);
  };

  const heroSectionStyle = {
    padding: "100px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "24px",
    background: "radial-gradient(circle at top, rgba(99, 102, 241, 0.1) 0%, transparent 60%)",
    position: "relative"
  };

  const featuresStyle = {
    padding: "80px 24px",
    backgroundColor: "var(--bg-card)",
    borderTop: "1px solid var(--border-color)",
    borderBottom: "1px solid var(--border-color)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* Hero Section */}
      <section style={heroSectionStyle} className="animate-fade-in">
        <span className="badge badge-primary animate-float" style={{ padding: "6px 14px" }}>
          Next-Generation Personalized EdTech
        </span>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 800,
          fontFamily: "var(--font-heading)",
          lineHeight: 1.1,
          maxWidth: "900px"
        }}>
          Elevate Your Technical Skills with <span className="gradient-text">SkillX</span>
        </h1>

        <p style={{
          color: "var(--text-secondary)",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          maxWidth: "650px",
          lineHeight: 1.6
        }}>
          Experience a state-of-the-art learning management system designed around personalized roadmaps, dynamic testing engines, and beautiful real-time dashboard analytics.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px" }}>
          {user.isLoggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "var(--gradient-primary)",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "var(--radius-sm)",
                fontWeight: 700,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "var(--shadow-glow)",
                transition: "transform var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                style={{
                  background: "var(--gradient-primary)",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "var(--shadow-glow)",
                  transition: "transform var(--transition-fast)"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <span>Start Learning Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                style={{
                  padding: "14px 28px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-card)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  transition: "all var(--transition-fast)"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--bg-surface)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--bg-card)"}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section style={featuresStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
              Why Engineers Choose SkillX
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "10px", fontSize: "1rem" }}>
              Our platform bridges the gap between structured courses and visual learning milestones.
            </p>
          </div>

          <div className="grid-4">
            {/* Feature 1 */}
            <div className="glass-panel" style={{ padding: "30px 24px", borderRadius: "var(--radius-md)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(99, 102, 241, 0.15)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <Compass size={20} />
              </div>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>Personalized Paths</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                An interactive roadmap matches your progress and suggests topics based on your existing skills.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel" style={{ padding: "30px 24px", borderRadius: "var(--radius-md)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(20, 184, 166, 0.15)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <BarChart3 size={20} />
              </div>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>Interactive Charts</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Visualize your weekly learning time, quiz scores, and subject balances through responsive charting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel" style={{ padding: "30px 24px", borderRadius: "var(--radius-md)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "var(--color-secondary)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <HelpCircle size={20} />
              </div>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>Dynamic Quizzes</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Generate instant mock tests with time limit parameters to certify your progress under pressure.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel" style={{ padding: "30px 24px", borderRadius: "var(--radius-md)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <Award size={20} />
              </div>
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>Verify Achievements</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                Achieve 100% progress in enrolled courses to unlock digital certificates ready for download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
          <span className="badge badge-accent" style={{ marginBottom: "14px" }}>
            Success Stories
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: "40px" }}>
            Trusted by Thousands of Career Shifters
          </h2>

          {mockTestimonials.length > 0 ? (
            <div className="glass-panel" style={{ padding: "40px 32px", borderRadius: "var(--radius-lg)", position: "relative", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontSize: "1.2rem", fontStyle: "italic", lineHeight: 1.6, color: "var(--text-primary)" }}>
                "{mockTestimonials[activeTestimonial]?.feedback}"
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "24px" }}>
                <span style={{ fontSize: "1.8rem" }}>{mockTestimonials[activeTestimonial]?.avatar}</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{mockTestimonials[activeTestimonial]?.name}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{mockTestimonials[activeTestimonial]?.role}</p>
                </div>
              </div>

              {/* Slider Controls */}
              <div style={{ display: "flex", gap: "10px", position: "absolute", bottom: "20px", right: "20px" }}>
                <button
                  onClick={handlePrevTestimonial}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextTestimonial}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: "40px", borderRadius: "var(--radius-md)" }}>
              <p style={{ color: "var(--text-secondary)" }}>Testimonials catalog is loading...</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to action Call */}
      <section style={{
        padding: "80px 24px",
        background: "var(--gradient-primary)",
        color: "#ffffff",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#ffffff" }}>
          Ready to Chart Your Course?
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.8)", maxWidth: "550px", lineHeight: 1.5, fontSize: "1rem" }}>
          Unlock course grids, dynamic roadmaps, analytics widgets, and certification portals instantly with your free mock account.
        </p>
        <button
          onClick={() => navigate(user.isLoggedIn ? "/dashboard" : "/signup")}
          style={{
            backgroundColor: "#ffffff",
            color: "var(--color-primary)",
            padding: "14px 28px",
            borderRadius: "var(--radius-sm)",
            fontWeight: 700,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            border: "none",
            marginTop: "10px",
            transition: "transform var(--transition-fast)"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span>Get Started Now</span>
          <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}
