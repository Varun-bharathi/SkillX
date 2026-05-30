import React, { useState } from "react";
import { useLms } from "../context/LmsContext";
import { CheckCircle2, Circle, Lock, Award, Compass, Star } from "lucide-react";

export default function PersonalizedLearningPath() {
  const { learningPath } = useLms();
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState(2); // Initially highlight active step (usually JS, index 2)

  const activeMilestone = learningPath[selectedMilestoneIdx];

  const gridLayout = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "40px",
    marginTop: "20px"
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "var(--color-success)";
    if (status === "active") return "var(--color-primary)";
    return "var(--text-muted)";
  };

  const roadmapCardStyle = (idx) => {
    const isSelected = idx === selectedMilestoneIdx;
    return {
      padding: "20px",
      borderRadius: "var(--radius-md)",
      border: "1px solid",
      borderColor: isSelected ? "var(--color-primary)" : "var(--border-color)",
      backgroundColor: isSelected ? "var(--bg-surface)" : "var(--bg-card)",
      boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      cursor: "pointer",
      position: "relative",
      transition: "all var(--transition-fast)"
    };
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Personalized Learning Path
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Track your educational journey. Complete courses to unlock advanced milestones and skills.
        </p>
      </div>

      <div style={gridLayout} className="grid-2">
        {/* Left Column: Visual Roadmap tree */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
          {learningPath.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isLocked = step.status === "locked";
            
            return (
              <div 
                key={step.id} 
                onClick={() => setSelectedMilestoneIdx(idx)}
                style={roadmapCardStyle(idx)}
                onMouseOver={(e) => {
                  if (idx !== selectedMilestoneIdx) {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                  }
                }}
                onMouseOut={(e) => {
                  if (idx !== selectedMilestoneIdx) {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }
                }}
              >
                {/* Visual indicator connector line (except for last node) */}
                {idx < learningPath.length - 1 && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "36px",
                    width: "2px",
                    height: "26px",
                    backgroundColor: isCompleted ? "var(--color-success)" : "var(--border-color)",
                    zIndex: 1
                  }} />
                )}

                {/* Node symbol */}
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: isCompleted 
                    ? "rgba(16, 185, 129, 0.1)" 
                    : isActive 
                      ? "rgba(99, 102, 241, 0.1)" 
                      : "var(--bg-surface)",
                  color: getStatusColor(step.status),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid",
                  borderColor: getStatusColor(step.status),
                  zIndex: 2
                }}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} fill="currentColor" style={{ color: "#ffffff", stroke: "var(--color-success)" }} />
                  ) : isActive ? (
                    <Circle size={12} fill="currentColor" />
                  ) : (
                    <Lock size={16} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, color: isLocked ? "var(--text-muted)" : "var(--text-primary)" }}>
                      {step.title}
                    </h4>
                    <span 
                      className={`badge ${isCompleted ? "badge-success" : isActive ? "badge-primary" : "badge-secondary"}`}
                      style={{ fontSize: "0.65rem", padding: "2px 8px" }}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Milestone {idx + 1}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Node details Inspect Panel */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {activeMilestone ? (
            <div className="glass-panel" style={{ padding: "30px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "100px" }}>
              <div>
                <span className={`badge ${activeMilestone.status === "completed" ? "badge-success" : activeMilestone.status === "active" ? "badge-primary" : "badge-secondary"}`} style={{ marginBottom: "12px" }}>
                  {activeMilestone.status.toUpperCase()} MILESTONE
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", lineHeight: 1.3 }}>
                  {activeMilestone.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "10px", lineHeight: 1.5 }}>
                  {activeMilestone.description}
                </p>
              </div>

              {/* Skills Unlocked */}
              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Award size={16} style={{ color: "var(--color-primary)" }} />
                  <span>Skills Unlocked / Target Outcomes</span>
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {activeMilestone.skillsUnlocked.map((skill, idx) => (
                    <span key={idx} className="badge badge-accent" style={{ textTransform: "none", fontSize: "0.75rem", padding: "4px 10px" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Next Topics */}
              {activeMilestone.nextTopics.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Compass size={16} style={{ color: "var(--color-secondary)" }} />
                    <span>Recommended Next Topics</span>
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {activeMilestone.nextTopics.map((topic, idx) => (
                      <span key={idx} className="badge badge-primary" style={{ textTransform: "none", fontSize: "0.75rem", padding: "4px 10px" }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivational Banner */}
              <div style={{
                marginTop: "10px",
                padding: "16px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                fontSize: "0.85rem",
                lineHeight: 1.4,
                color: "var(--text-secondary)",
                display: "flex",
                gap: "10px"
              }}>
                <Star size={20} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: "2px" }} />
                <span>
                  {activeMilestone.status === "completed" 
                    ? "Outstanding! You completed all modules associated with this skill roadmap milestone." 
                    : activeMilestone.status === "active" 
                      ? "Finish your current active enrolled courses to unlock the next level of milestones."
                      : "This milestone is locked. Complete previous steps to unlock these target outcomes."}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
              Select a milestone to view its personalized details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
