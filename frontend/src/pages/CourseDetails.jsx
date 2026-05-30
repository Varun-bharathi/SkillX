import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { ArrowLeft, Clock, BookOpen, User, CheckCircle2, Circle } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, enrolledCourses, enrollInCourse, completeModule, resetCourseProgress, isEnrolled, getEnrolledProgress, quizScores } = useLms();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px" }}>
        <h3>Course Not Found</h3>
        <p style={{ color: "var(--text-secondary)", marginTop: "10px" }}>
          The requested course does not exist in our catalog.
        </p>
        <Link to="/catalog" style={{ display: "inline-block", marginTop: "20px", color: "var(--color-primary)", fontWeight: 600 }}>
          Go to Catalog
        </Link>
      </div>
    );
  }

  const { title, instructor, category, description, duration, syllabus } = course;
  const enrolled = isEnrolled(id);
  const progress = getEnrolledProgress(id);
  
  // Find completed modules for this course
  const completedModulesList = enrolledCourses[id]?.completedModules || [];

  const handleModuleClick = (moduleId) => {
    if (!enrolled) return;
    completeModule(id, moduleId, syllabus.length);
  };

  const handleRestartCourse = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your progress for this course? This will clear your module checklists and any certification quiz scores, allowing you to start learning again from the first module."
    );
    if (confirmReset) {
      resetCourseProgress(id);
    }
  };

  const pageHeaderStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px"
  };

  const detailsGridStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "32px"
  };

  const cardPanelStyle = {
    padding: "28px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    boxShadow: "var(--shadow-sm)",
    height: "fit-content"
  };

  const moduleRowStyle = (isModuleCompleted) => ({
    padding: "16px 20px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: isModuleCompleted ? "rgba(16, 185, 129, 0.04)" : "var(--bg-surface)",
    border: "1px solid",
    borderColor: isModuleCompleted ? "rgba(16, 185, 129, 0.15)" : "var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: enrolled ? "pointer" : "default",
    transition: "all var(--transition-fast)",
    marginBottom: "12px"
  });

  return (
    <div className="page-container animate-fade-in">
      {/* Back to Catalog button */}
      <button 
        onClick={() => navigate("/catalog")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginBottom: "24px"
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Catalog</span>
      </button>

      <div style={pageHeaderStyle}>
        <span className="badge badge-primary" style={{ width: "fit-content" }}>{category}</span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-heading)", lineHeight: 1.2 }}>
          {title}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <User size={16} />
            <span>Instructor: {instructor}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={16} />
            <span>{duration} syllabus duration</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <BookOpen size={16} />
            <span>{syllabus.length} learning modules</span>
          </div>
        </div>
      </div>

      <div style={detailsGridStyle} className="grid-2">
        {/* Left Side: Description & Interactive curriculum syllabus list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px", fontFamily: "var(--font-heading)" }}>
              Course Overview
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
              {description}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "4px", fontFamily: "var(--font-heading)" }}>
              Course Curriculum
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px" }}>
              {enrolled 
                ? "Click on modules to check them off and dynamically increment course progress!" 
                : "Enroll in this course to interact with curriculum modules."}
            </p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {syllabus.map((module, idx) => {
                const isModuleCompleted = completedModulesList.includes(module.id);
                return (
                  <div 
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    style={moduleRowStyle(isModuleCompleted)}
                    className={enrolled ? "curriculum-module-row" : ""}
                    onMouseOver={(e) => {
                      if (enrolled) {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.backgroundColor = isModuleCompleted 
                          ? "rgba(16, 185, 129, 0.08)" 
                          : "var(--bg-card)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (enrolled) {
                        e.currentTarget.style.borderColor = isModuleCompleted ? "rgba(16, 185, 129, 0.15)" : "var(--border-color)";
                        e.currentTarget.style.backgroundColor = isModuleCompleted ? "rgba(16, 185, 129, 0.04)" : "var(--bg-surface)";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      {enrolled && (
                        <div style={{ color: isModuleCompleted ? "var(--color-success)" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                          {isModuleCompleted 
                            ? <CheckCircle2 size={18} fill="currentColor" style={{ color: "#ffffff", stroke: "var(--color-success)" }} />
                            : <Circle size={18} />
                          }
                        </div>
                      )}
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        {idx + 1}. {module.title}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {module.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Status card / Action panel */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={cardPanelStyle}>
            {enrolled ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <span className="badge badge-success" style={{ width: "fit-content" }}>Enrolled</span>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                    <span>Syllabus Completed</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <div 
                      style={{ 
                        width: `${progress}%`, 
                        height: "100%", 
                        background: "var(--gradient-primary)", 
                        borderRadius: "var(--radius-full)",
                        transition: "width 0.4s ease-out"
                      }}
                    ></div>
                  </div>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p>✓ Complete all modules to earn your certificate.</p>
                  <p>✓ Track milestones in your learning path.</p>
                </div>

                {progress === 100 ? (
                  quizScores.some((q) => q.courseId === id && q.score >= 70) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <button
                        onClick={() => navigate("/profile")}
                        style={{
                          padding: "12px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--color-success)",
                          color: "#ffffff",
                          fontWeight: 700,
                          textAlign: "center"
                        }}
                      >
                        View Awarded Certificate
                      </button>
                      <button
                        onClick={handleRestartCourse}
                        style={{
                          padding: "10px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)",
                          color: "#ef4444",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textAlign: "center",
                          backgroundColor: "rgba(239, 68, 68, 0.05)",
                          cursor: "pointer",
                          transition: "all var(--transition-fast)"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                          e.currentTarget.style.borderColor = "#ef4444";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                          e.currentTarget.style.borderColor = "var(--border-color)";
                        }}
                      >
                        Restart Course
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-warning)", fontWeight: 600, textAlign: "center" }}>
                        ⚠️ Modules Complete! Take and pass the exam (score {">= 70%"}) to unlock your certificate.
                      </span>
                      <button
                        onClick={() => navigate("/quiz", { state: { courseId: id } })}
                        style={{
                          padding: "12px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--gradient-primary)",
                          color: "#ffffff",
                          fontWeight: 700,
                          textAlign: "center",
                          boxShadow: "var(--shadow-glow)"
                        }}
                      >
                        Take Certification Exam
                      </button>
                      <button
                        onClick={handleRestartCourse}
                        style={{
                          padding: "10px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)",
                          color: "#ef4444",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          textAlign: "center",
                          backgroundColor: "rgba(239, 68, 68, 0.05)",
                          cursor: "pointer",
                          transition: "all var(--transition-fast)"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                          e.currentTarget.style.borderColor = "#ef4444";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                          e.currentTarget.style.borderColor = "var(--border-color)";
                        }}
                      >
                        Restart Course
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-color)",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      textAlign: "center"
                    }}
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <span className="badge badge-primary" style={{ width: "fit-content" }}>Available Course</span>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Unlock syllabus checklists, interactive checkboxes, dynamic course progress trackers, and achievements certificates instantly.
                </p>
                <button
                  onClick={() => enrollInCourse(id)}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--gradient-primary)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    boxShadow: "var(--shadow-glow)"
                  }}
                >
                  Enroll in Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
