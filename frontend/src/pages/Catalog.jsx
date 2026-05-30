import React, { useState } from "react";
import { useLms } from "../context/LmsContext";
import CourseCard from "../components/CourseCard";
import ModalComponent from "../components/ModalComponent";
import { Search, Compass, BookOpen, Clock, Award } from "lucide-react";

export default function Catalog() {
  const { courses, isEnrolled, getEnrolledProgress, enrollInCourse } = useLms();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Modal tracking
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);

  // Derive unique categories plus "All"
  const categories = ["All", ...new Set(courses.map((c) => c.category))];

  // Perform search and filtering
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const searchContainerStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 16px",
    gap: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "var(--shadow-sm)",
    transition: "border-color var(--transition-fast)"
  };

  const handleEnrollClick = (courseId) => {
    enrollInCourse(courseId);
    // Auto-update modal if open
    if (selectedCourseForModal && selectedCourseForModal.id === courseId) {
      setSelectedCourseForModal((prev) => ({ ...prev }));
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Course Catalog
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Browse structured courses, inspect full syllabus modules, and enroll instantly.
        </p>
      </div>

      {/* Filter and Search Section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* Search */}
        <div 
          style={searchContainerStyle}
          className="search-input-wrapper"
          onFocusIn={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
          onFocusOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
        >
          <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search courses, instructors, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", fontSize: "0.95rem" }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: "1px solid var(--border-color)",
                backgroundColor: activeCategory === category ? "var(--color-primary)" : "var(--bg-card)",
                color: activeCategory === category ? "#ffffff" : "var(--text-secondary)",
                transition: "all var(--transition-fast)"
              }}
              onMouseOver={(e) => {
                if (activeCategory !== category) {
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                  e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                }
              }}
              onMouseOut={(e) => {
                if (activeCategory !== category) {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.backgroundColor = "var(--bg-card)";
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="glass-panel" style={{ padding: "50px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
          <Compass size={40} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            No courses found matching "{searchQuery}" in category "{activeCategory}".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            style={{ color: "var(--color-primary)", fontWeight: 600, marginTop: "12px", borderBottom: "1px solid" }}
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onViewDetails={() => setSelectedCourseForModal(course)}
              isEnrolled={isEnrolled(course.id)}
              progress={getEnrolledProgress(course.id)}
            />
          ))}
        </div>
      )}

      {/* Course Syllabus Modal Component */}
      <ModalComponent
        isOpen={!!selectedCourseForModal}
        onClose={() => setSelectedCourseForModal(null)}
        title={selectedCourseForModal?.title || "Syllabus Details"}
      >
        {selectedCourseForModal && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <span className="badge badge-primary">{selectedCourseForModal.category}</span>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "12px", lineHeight: 1.5 }}>
                {selectedCourseForModal.description}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={14} />
                <span>{selectedCourseForModal.duration} Syllabus</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <BookOpen size={14} />
                <span>{selectedCourseForModal.syllabus.length} Core Modules</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Award size={14} />
                <span>Certification Unlocked</span>
              </div>
            </div>

            {/* Curriculum Syllabus list */}
            <div>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                Curriculum Syllabus
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedCourseForModal.syllabus.map((module, idx) => (
                  <div 
                    key={module.id} 
                    style={{ 
                      padding: "12px 16px", 
                      borderRadius: "var(--radius-sm)", 
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.85rem"
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {idx + 1}. {module.title}
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>{module.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                onClick={() => setSelectedCourseForModal(null)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)"
                }}
              >
                Close Syllabus
              </button>
              {isEnrolled(selectedCourseForModal.id) ? (
                <button
                  disabled
                  style={{
                    flex: 1.5,
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "var(--color-success)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "default"
                  }}
                >
                  Already Enrolled
                </button>
              ) : (
                <button
                  onClick={() => handleEnrollClick(selectedCourseForModal.id)}
                  style={{
                    flex: 1.5,
                    padding: "12px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--gradient-primary)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    boxShadow: "var(--shadow-glow)"
                  }}
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
