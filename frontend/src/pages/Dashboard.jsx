import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { mockQuizzes } from "../data/mockData";
import ProgressCard from "../components/ProgressCard";
import CourseCard from "../components/CourseCard";
import QuizCard from "../components/QuizCard";
import RecommendationCard from "../components/RecommendationCard";
import { 
  GraduationCap, 
  Award, 
  Clock, 
  CheckSquare, 
  BookOpen, 
  Map, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Dashboard() {
  const { user, courses, enrolledCourses, getEnrolledProgress, enrollInCourse, quizScores, learningPath } = useLms();
  const navigate = useNavigate();

  // Find actual enrolled courses
  const enrolledList = courses.filter((course) => enrolledCourses[course.id]);

  // Find courses not enrolled in for recommendations
  const recommendedList = courses.filter((course) => !enrolledCourses[course.id]).slice(0, 2);

  // Compute stats
  const totalEnrolled = enrolledList.length;
  
  // A course certificate is awarded only when progress is 100% AND the quiz is passed (score >= 70)
  const totalCertificates = Object.values(enrolledCourses).filter((c) => {
    if (c.progress !== 100) return false;
    const attempt = quizScores.find((q) => q.courseId === c.courseId);
    return attempt && attempt.score >= 70;
  }).length;

  // Average quiz score
  const avgQuizScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((sum, item) => sum + item.score, 0) / quizScores.length)
    : 0;

  // Find quizzes corresponding to enrolled courses
  const availableQuizzes = Object.values(mockQuizzes).filter((quiz) => {
    // If user is enrolled in the course, they can take the quiz
    return enrolledCourses[quiz.courseId];
  });

  return (
    <div className="page-container animate-fade-in">
      {/* Header section with Welcome and quick info banner */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            Welcome back, <span className="gradient-text">{user.name}</span>! {user.avatar}
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Ready to level up your technical roadmap today? Here is your learning progress overview.
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: "12px"
        }}>
          <Link
            to="/learning-path"
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all var(--transition-fast)"
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
          >
            <Map size={16} />
            <span>Roadmap</span>
          </Link>
          <Link
            to="/catalog"
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-sm)",
              background: "var(--gradient-primary)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "var(--shadow-glow)",
              transition: "filter var(--transition-fast)"
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.filter = "none"}
          >
            <BookOpen size={16} />
            <span>Catalog</span>
          </Link>
        </div>
      </div>

      {/* Progress Cards widgets row */}
      <div className="grid-3" style={{ marginBottom: "40px" }}>
        <ProgressCard
          title="Enrolled Courses"
          value={totalEnrolled}
          subtitle="Active database enrollments"
          icon={GraduationCap}
          trend={null}
          type="primary"
        />
        <ProgressCard
          title="Certificates Awarded"
          value={totalCertificates}
          subtitle="At 100% completion progress"
          icon={Award}
          trend={null}
          type="secondary"
        />
        <ProgressCard
          title="Avg Quiz Score"
          value={`${avgQuizScore}%`}
          subtitle="Across all attempt logs"
          icon={CheckSquare}
          trend={null}
          type="accent"
        />
      </div>

      {/* Enrolled Courses Grid */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            Your Enrolled Courses
          </h2>
          {enrolledList.length > 0 && (
            <Link to="/catalog" style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Browse Catalog</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {enrolledList.length === 0 ? (
          <div className="glass-panel" style={{ padding: "40px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
              You are not currently enrolled in any modules. Unlock structured curriculum from the catalog!
            </p>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                background: "var(--gradient-primary)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                fontWeight: 700,
                fontSize: "0.85rem",
                boxShadow: "var(--shadow-glow)"
              }}
            >
              Enroll in a Course
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {enrolledList.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={true}
                progress={getEnrolledProgress(course.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Quizzes and AI Recommendations Grid */}
      <div className="grid-2" style={{ marginBottom: "40px" }}>
        {/* Available Quizzes list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            Available Quizzes
          </h2>
          
          {availableQuizzes.length === 0 ? (
            <div style={{ 
              padding: "24px", 
              borderRadius: "var(--radius-md)", 
              border: "1px solid var(--border-color)", 
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              textAlign: "center"
            }}>
              Enroll in web or style courses to unlock their associated tests!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {availableQuizzes.map((quiz) => {
                // Find if there is an active score attempt for this quiz
                const attempt = quizScores.find((score) => score.courseId === quiz.courseId);
                return (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    scoreRecord={attempt}
                    onStart={() => navigate("/quiz", { state: { courseId: quiz.courseId } })}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={20} style={{ color: "var(--color-primary)" }} />
              <span>Personalized Recommendations</span>
            </h2>
            <Link to="/recommendations" style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {recommendedList.map((course) => (
              <RecommendationCard
                key={course.id}
                course={course}
                isEnrolled={false}
                onEnroll={() => enrollInCourse(course.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
