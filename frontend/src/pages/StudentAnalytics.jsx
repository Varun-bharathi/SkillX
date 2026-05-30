import React from "react";
import { useLms } from "../context/LmsContext";
import AnalyticsCard from "../components/AnalyticsCard";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Clock, CheckSquare, Award, Flame } from "lucide-react";

export default function StudentAnalytics() {
  const { quizScores, mockAnalyticsData, enrolledCourses } = useLms();

  // Combine static and dynamic quiz scores
  const combinedScores = [...quizScores].reverse(); // reverse to show oldest first on chronological line charts

  // Format Recharts active theme styles
  const tooltipContentStyle = {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)"
  };

  // Stats derivations
  const totalAttempts = quizScores.length;
  
  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((sum, item) => sum + item.score, 0) / quizScores.length)
    : 0;

  const totalCertificates = Object.values(enrolledCourses).filter((c) => {
    if (c.progress !== 100) return false;
    const attempt = quizScores.find((q) => q.courseId === c.courseId);
    return attempt && attempt.score >= 70;
  }).length;

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "24px",
    marginBottom: "32px"
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Student Analytics Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Observe real-time learning metrics, weekly study logs, subject distribution, and quiz milestones.
        </p>
      </div>

      {/* Summary Score Widgets */}
      <div className="grid-2" style={{ marginBottom: "32px" }}>
        <div style={{ padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(20, 184, 166, 0.15)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Average Test Score</p>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{avgQuizScore}% Score</h4>
          </div>
        </div>

        <div style={{ padding: "20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(168, 85, 247, 0.15)", color: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Award size={20} />
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Certificates Earned</p>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{totalCertificates} Completed</h4>
          </div>
        </div>
      </div>

      {/* Database Quiz Performance and Attempts Log Row */}
      <div style={gridStyle} className="grid-2">
        {/* Over-time Quiz Scores Line */}
        <AnalyticsCard 
          title="Quiz Performance Metrics" 
          subtitle="Timeline showing chronological exam result outcomes"
        >
          {combinedScores.length === 0 ? (
            <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Submit a quiz arena score to visualize chronological timeline trends!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={combinedScores}>
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Legend verticalAlign="bottom" height={24} fontSize={12} />
                <Line 
                  name="Score %" 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--color-accent)" 
                  strokeWidth={3} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </AnalyticsCard>

        {/* Attempt Log list */}
        <AnalyticsCard 
          title="Recent Exam Attempts Log" 
          subtitle={`Total assessments taken: ${totalAttempts}`}
        >
          {quizScores.length === 0 ? (
            <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              No exams documented. Launch standard evaluations from Dashboard!
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "260px",
              overflowY: "auto"
            }}>
              {quizScores.slice(0, 4).map((attempt) => (
                <div 
                  key={attempt.id}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-surface)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                      {attempt.courseTitle.split(" ")[0]} Quiz
                    </h5>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {attempt.date}
                    </p>
                  </div>

                  <span style={{
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: attempt.score >= 80 ? "var(--color-success)" : "var(--color-primary)"
                  }}>
                    {attempt.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </AnalyticsCard>
      </div>
    </div>
  );
}
