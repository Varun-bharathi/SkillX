import React from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen, Clock, Award, ChevronRight } from "lucide-react";

export default function CourseCard({ course, onViewDetails, progress, isEnrolled }) {
  const { id, title, instructor, category, rating, reviewsCount, duration, difficulty, skills } = course;

  // Generate a distinct subtle color gradient background based on course ID for mock illustration
  const getBannerGradient = () => {
    switch (id) {
      case "react-core": return "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)";
      case "css-mastery": return "linear-gradient(135deg, #180025 0%, #2e0854 100%)";
      case "js-next": return "linear-gradient(135deg, #022c22 0%, #064e3b 100%)";
      case "ui-ux-design": return "linear-gradient(135deg, #311c05 0%, #45220a 100%)";
      case "data-vis": return "linear-gradient(135deg, #062f4f 0%, #0c3c60 100%)";
      default: return "linear-gradient(135deg, #111827 0%, #1f2937 100%)";
    }
  };

  const getDifficultyBadge = () => {
    if (difficulty === "Beginner") return "badge-accent";
    if (difficulty === "Intermediate") return "badge-primary";
    return "badge-secondary";
  };

  const cardStyle = {
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)",
    cursor: "pointer",
    animation: "slideUp var(--transition-normal) ease-out"
  };

  const bannerStyle = {
    background: getBannerGradient(),
    padding: "24px 20px",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative"
  };

  const categoryBadgeStyle = {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(4px)",
    color: "#ffffff",
    border: "none",
    padding: "4px 8px",
    fontSize: "0.7rem",
    fontWeight: 600
  };

  return (
    <div 
      style={cardStyle}
      className="course-card-wrapper"
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      {/* Banner Backdrop */}
      <div style={bannerStyle}>
        <span className="badge" style={categoryBadgeStyle}>{category}</span>
        <h4 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: 700, marginTop: "12px", lineHeight: 1.3 }}>
          {title}
        </h4>
      </div>

      {/* Course Info */}
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
          By {instructor}
        </p>

        {/* Rating and Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-warning)" }}>
            <Star size={16} fill="currentColor" />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{rating}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>({reviewsCount.toLocaleString()})</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            <Clock size={14} />
            <span>{duration}</span>
          </div>
        </div>

        {/* Skills Tag Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          <span className={`badge ${getDifficultyBadge()}`}>{difficulty}</span>
          {skills.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="badge" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)", border: "1px solid var(--border-color)", padding: "2px 8px", fontSize: "0.7rem" }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Progress Tracker (If enrolled) */}
        {isEnrolled && typeof progress === "number" && (
          <div style={{ marginBottom: "20px", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Learning Progress</span>
              <span style={{ color: "var(--color-primary)" }}>{progress}%</span>
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: "100%", 
                  background: "var(--gradient-primary)", 
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.5s ease-out"
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Buttons / Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: isEnrolled ? "0" : "auto" }}>
          {onViewDetails && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                backgroundColor: "transparent",
                transition: "all var(--transition-fast)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                e.currentTarget.style.borderColor = "var(--text-secondary)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            >
              Syllabus Info
            </button>
          )}

          <Link 
            to={`/course/${id}`}
            style={{
              flex: 1.2,
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              background: isEnrolled ? "var(--bg-surface)" : "var(--gradient-primary)",
              color: isEnrolled ? "var(--text-primary)" : "#ffffff",
              border: isEnrolled ? "1px solid var(--border-color)" : "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              boxShadow: isEnrolled ? "none" : "0 4px 12px rgba(99, 102, 241, 0.2)",
              transition: "transform var(--transition-fast), filter var(--transition-fast)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            <span>{isEnrolled ? "Study Now" : "Enroll Now"}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
