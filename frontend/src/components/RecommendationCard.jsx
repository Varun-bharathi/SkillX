import React from "react";
import { Link } from "react-router-dom";
import { Star, Compass, Award, Plus, Check } from "lucide-react";

export default function RecommendationCard({ course, onEnroll, isEnrolled }) {
  const { id, title, instructor, category, rating, skillMatch, recommendationReason } = course;

  const cardStyle = {
    padding: "24px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "var(--shadow-sm)",
    transition: "transform var(--transition-fast), border-color var(--transition-fast)"
  };

  const reasonStyle = {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    backgroundColor: "var(--bg-surface)",
    padding: "12px",
    borderRadius: "var(--radius-sm)",
    borderLeft: "3px solid var(--color-primary)",
    display: "flex",
    gap: "10px",
    lineHeight: 1.4
  };

  return (
    <div 
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "var(--color-primary)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: "8px" }}>
            {category}
          </span>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Led by {instructor}
          </p>
        </div>

        {/* Skill Match Circle / Badge */}
        <div style={{
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          background: "linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
          border: "1px solid rgba(20, 184, 166, 0.2)",
          color: "var(--color-accent)",
          textAlign: "center",
          fontWeight: 700,
          fontSize: "0.85rem",
          flexShrink: 0
        }}>
          <div>{skillMatch}%</div>
          <div style={{ fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" }}>Match</div>
        </div>
      </div>

      {/* AI Recommendation Reason */}
      <div style={reasonStyle}>
        <Compass size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
        <span>{recommendationReason}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-warning)", fontSize: "0.85rem", fontWeight: 600 }}>
          <Star size={14} fill="currentColor" />
          <span>{rating} Rating</span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            to={`/course/${id}`}
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--bg-surface)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            Syllabus
          </Link>

          {isEnrolled ? (
            <div style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--color-success)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid rgba(16, 185, 129, 0.2)"
            }}>
              <Check size={14} />
              <span>Enrolled</span>
            </div>
          ) : (
            <button
              onClick={onEnroll}
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: "var(--color-primary)",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "background var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
            >
              <Plus size={14} />
              <span>Enroll</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
