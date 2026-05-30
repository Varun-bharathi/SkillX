import React from "react";
import { Clock, HelpCircle, CheckCircle2, Play } from "lucide-react";

export default function QuizCard({ quiz, scoreRecord, onStart }) {
  const { id, courseTitle, durationSeconds, questions } = quiz;
  const durationMinutes = Math.floor(durationSeconds / 60);

  const cardStyle = {
    padding: "20px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "transform var(--transition-fast), border-color var(--transition-fast)"
  };

  const isCompleted = !!scoreRecord;

  return (
    <div 
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "var(--color-primary)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border-color)";
      }}
    >
      <div>
        <span className={`badge ${isCompleted ? "badge-success" : "badge-primary"}`} style={{ marginBottom: "10px" }}>
          {isCompleted ? "Completed" : "Available"}
        </span>
        <h4 style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.4 }}>
          {courseTitle}
        </h4>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <HelpCircle size={14} />
          <span>{questions.length} Questions</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Clock size={14} />
          <span>{durationMinutes} mins</span>
        </div>
      </div>

      {isCompleted ? (
        <div style={{ 
          marginTop: "auto", 
          padding: "10px 12px", 
          borderRadius: "var(--radius-sm)", 
          backgroundColor: "rgba(16, 185, 129, 0.08)", 
          border: "1px solid rgba(16, 185, 129, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Passed</span>
          </div>
          <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--color-success)" }}>
            {scoreRecord.score}% Score
          </span>
        </div>
      ) : (
        <button
          onClick={onStart}
          style={{
            marginTop: "auto",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "background var(--transition-fast)"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
        >
          <Play size={14} fill="currentColor" />
          <span>Launch Quiz</span>
        </button>
      )}
    </div>
  );
}
