import React from "react";
import { useLms } from "../context/LmsContext";
import RecommendationCard from "../components/RecommendationCard";
import { Sparkles, Compass } from "lucide-react";

export default function CourseRecommendation() {
  const { courses, enrolledCourses, enrollInCourse } = useLms();

  // Filter out courses that are already enrolled
  const recommendedList = courses.filter((course) => !enrolledCourses[course.id]);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "10px" }}>
          <Sparkles size={26} style={{ color: "var(--color-primary)" }} />
          <span>AI Course Recommendations</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Our neural routing system identifies knowledge gaps and matches you with top courses based on your active settings.
        </p>
      </div>

      {recommendedList.length === 0 ? (
        <div className="glass-panel" style={{ padding: "50px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
          <Compass size={40} style={{ color: "var(--color-primary)", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>You are Fully Levelled Up!</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Outstanding! You have enrolled in every single available course. Keep completing modules to finish your roadmaps!
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {recommendedList.map((course) => (
            <RecommendationCard
              key={course.id}
              course={course}
              isEnrolled={false}
              onEnroll={() => enrollInCourse(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
