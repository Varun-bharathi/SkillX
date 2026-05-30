import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import ModalComponent from "../components/ModalComponent";
import { Award, ShieldAlert, GraduationCap, MapPin, Globe, BookOpen, Clock, CheckSquare } from "lucide-react";

export default function ProfilePage() {
  const { user, courses, enrolledCourses, quizScores } = useLms();
  const navigate = useNavigate();
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);

  const handleDownloadPNG = (course, userName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    // Draw background (dark slate blue gradient)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(500, 350, 50, 500, 350, 500);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Double premium borders
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#6366f1";
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#10b981";
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

    // Decorative corner emerald squares
    ctx.fillStyle = "#10b981";
    ctx.fillRect(25, 25, 30, 30);
    ctx.fillRect(canvas.width - 55, 25, 30, 30);
    ctx.fillRect(25, canvas.height - 55, 30, 30);
    ctx.fillRect(canvas.width - 55, canvas.height - 55, 30, 30);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Header Scholarship
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("AURAEDEMY HONORS SCHOLARSHIP", 500, 110);

    // Certificate Title
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Certificate of Achievement", 500, 180);

    // Under-title
    ctx.font = "italic 18px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("This verifies that student", 500, 250);

    // Student Name
    ctx.font = "bold 38px Georgia, serif";
    ctx.fillStyle = "#10b981";
    ctx.fillText(userName, 500, 310);

    // Syllabus line
    ctx.font = "italic 16px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("has successfully finished the extensive course curriculum syllabus titled", 500, 375);

    // Course Title
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(course.title, 500, 430);

    // Granted date and verification token ID
    ctx.font = "14px monospace";
    ctx.fillStyle = "#64748b";
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    ctx.fillText(`Granted on ${dateStr}  •  Verified SkillX Token System (AURA-${course.id.toUpperCase()})`, 500, 520);

    // Signature marks
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText("AuraEdemy Director", 300, 600);
    ctx.fillText("Principal Examiner", 700, 600);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#475569";
    ctx.beginPath();
    ctx.moveTo(200, 580);
    ctx.lineTo(400, 580);
    ctx.moveTo(600, 580);
    ctx.lineTo(800, 580);
    ctx.stroke();

    // Export and download PNG
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `AuraEdemy-Certificate-${course.id}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = (course, userName) => {
    const printWindow = window.open("", "_blank", "width=900,height=650");
    if (!printWindow) {
      alert("Please allow popups to download the certificate as a PDF.");
      return;
    }

    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const tokenId = `AURA-${course.id.toUpperCase()}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AuraEdemy Certificate - ${course.title}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: #0f172a;
            color: #ffffff;
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .certificate-container {
            width: 90%;
            max-width: 950px;
            height: 85%;
            max-height: 580px;
            border: 8px double #6366f1;
            padding: 40px;
            border-radius: 4px;
            background-color: #0f172a;
            text-align: center;
            position: relative;
            box-sizing: border-box;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
          }
          .inner-border {
            position: absolute;
            top: 8px;
            left: 8px;
            right: 8px;
            bottom: 8px;
            border: 2px solid #10b981;
            pointer-events: none;
          }
          .corner-dec {
            position: absolute;
            width: 25px;
            height: 25px;
            background-color: #10b981;
          }
          .tl { top: -2px; left: -2px; }
          .tr { top: -2px; right: -2px; }
          .bl { bottom: -2px; left: -2px; }
          .br { bottom: -2px; right: -2px; }
          
          .header {
            font-family: sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.25em;
            color: #94a3b8;
            margin-bottom: 20px;
          }
          .title {
            font-size: 38px;
            font-weight: 800;
            margin: 10px 0;
            color: #ffffff;
          }
          .verify-text {
            font-style: italic;
            color: #94a3b8;
            font-size: 16px;
            margin-bottom: 15px;
          }
          .name {
            font-size: 34px;
            font-weight: 700;
            color: #10b981;
            margin: 15px 0;
          }
          .syllabus-line {
            font-style: italic;
            color: #94a3b8;
            font-size: 16px;
            margin-bottom: 15px;
          }
          .course-title {
            font-family: sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #e2e8f0;
            margin: 15px 0;
          }
          .date-token {
            font-family: monospace;
            font-size: 12px;
            color: #64748b;
            margin-top: 30px;
          }
          .signatures {
            margin-top: 40px;
            display: flex;
            justify-content: space-around;
            font-family: sans-serif;
          }
          .sig-block {
            width: 200px;
          }
          .sig-line {
            border-top: 1px solid #475569;
            margin-bottom: 8px;
          }
          .sig-title {
            font-size: 13px;
            color: #e2e8f0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="inner-border">
            <div class="corner-dec tl"></div>
            <div class="corner-dec tr"></div>
            <div class="corner-dec bl"></div>
            <div class="corner-dec br"></div>
          </div>
          
          <div class="header">AURAEDEMY HONORS SCHOLARSHIP</div>
          <div class="title">Certificate of Achievement</div>
          <div class="verify-text">This verifies that student</div>
          <div class="name">${userName}</div>
          <div class="syllabus-line">has successfully finished the extensive course curriculum syllabus titled</div>
          <div class="course-title">${course.title}</div>
          
          <div class="date-token">
            Granted on ${dateStr} &nbsp;•&nbsp; Verified SkillX Token System (${tokenId})
          </div>
          
          <div class="signatures">
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-title">AuraEdemy Director</div>
            </div>
            <div class="sig-block">
              <div class="sig-line"></div>
              <div class="sig-title">Principal Examiner</div>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Compute metrics
  const enrolledList = courses.filter((course) => enrolledCourses[course.id]);

  // A course certificate is awarded only when progress is 100% AND the quiz is passed (score >= 70)
  const completedList = enrolledList.filter((course) => {
    const enrollment = enrolledCourses[course.id];
    if (!enrollment || enrollment.progress !== 100) return false;
    const attempt = quizScores.find((q) => q.courseId === course.id);
    return attempt && attempt.score >= 70;
  });

  const pendingQuizList = enrolledList.filter((course) => {
    const enrollment = enrolledCourses[course.id];
    if (!enrollment || enrollment.progress !== 100) return false;
    const attempt = quizScores.find((q) => q.courseId === course.id);
    return !attempt || attempt.score < 70;
  });

  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((sum, item) => sum + item.score, 0) / quizScores.length)
    : 0;

  const headerGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 2.5fr",
    gap: "32px",
    marginBottom: "40px"
  };

  const certificateStyle = {
    border: "8px double var(--color-primary)",
    padding: "36px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "var(--bg-card)",
    textAlign: "center",
    fontFamily: "var(--font-heading)",
    color: "var(--text-primary)",
    position: "relative"
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Student Profile
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Manage your student card, review learning stats, and access completed digital certificates.
        </p>
      </div>

      <div style={headerGridStyle} className="grid-2">
        {/* Left Side: Avatar and Quick Bios */}
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "var(--radius-lg)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", height: "fit-content" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary)",
            color: "#ffffff",
            fontSize: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow)"
          }}>
            {user.avatar}
          </div>

          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
              {user.name}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Active Student Account
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", fontSize: "0.8rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
              <Globe size={14} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed metrics and skills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Resume Bio */}
          <div className="glass-panel" style={{ padding: "24px", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px" }}>Professional Bio</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
              {user.bio || "No professional bio added yet. Adjust this in your settings page."}
            </p>
          </div>

          {/* Stats Box */}
          <div className="grid-3" style={{ gap: "16px" }}>
            <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", display: "flex", gap: "12px", alignItems: "center" }}>
              <BookOpen size={18} style={{ color: "var(--color-primary)" }} />
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Enrolled</p>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{enrolledList.length} Courses</h4>
              </div>
            </div>

            <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", display: "flex", gap: "12px", alignItems: "center" }}>
              <CheckSquare size={18} style={{ color: "var(--color-accent)" }} />
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Avg Quiz</p>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{avgQuizScore}%</h4>
              </div>
            </div>

            <div style={{ padding: "16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", display: "flex", gap: "12px", alignItems: "center" }}>
              <Award size={18} style={{ color: "var(--color-secondary)" }} />
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Certificates</p>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{completedList.length} Awarded</h4>
              </div>
            </div>
          </div>

          {/* Skills checklist */}
          <div className="glass-panel" style={{ padding: "24px", borderRadius: "var(--radius-md)" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "12px" }}>Target Knowledge Roadmaps</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {user.targetSkills.map((skill, idx) => (
                <span key={idx} className="badge badge-primary" style={{ padding: "6px 12px", fontSize: "0.75rem", textTransform: "none" }}>
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>
          Awarded Digital Certificates
        </h2>

        {completedList.length === 0 ? (
          <div className="glass-panel" style={{ padding: "40px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <ShieldAlert size={36} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              You haven't completed any course modules at 100% yet.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>
              Go to your enrolled courses, check off syllabus items, and lock in your certificate awards!
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {completedList.map((course) => (
              <div
                key={course.id}
                style={{
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  backgroundColor: "var(--bg-card)",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-success)" }}>
                  <Award size={20} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Verified Certificate</span>
                </div>

                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.3 }}>
                  {course.title}
                </h4>

                <button
                  onClick={() => setSelectedCertCourse(course)}
                  style={{
                    marginTop: "auto",
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "var(--color-success)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    transition: "all var(--transition-fast)"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-success)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                    e.currentTarget.style.color = "var(--color-success)";
                  }}
                >
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Certifications Section */}
      <div style={{ marginTop: "40px", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>
          Pending Certification Quizzes
        </h2>

        {pendingQuizList.length === 0 ? (
          <div className="glass-panel" style={{ padding: "40px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              No pending certification exams. All completed courses have been successfully certified!
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {pendingQuizList.map((course) => {
              const attempt = quizScores.find((q) => q.courseId === course.id);
              return (
                <div
                  key={course.id}
                  style={{
                    padding: "20px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-card)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-warning)" }}>
                    <ShieldAlert size={20} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Exam Required</span>
                  </div>

                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.3 }}>
                    {course.title}
                  </h4>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {attempt
                      ? `Modules 100% complete. Last attempt: ${attempt.score}% (Passing score is 70%).`
                      : "Modules 100% complete. You must pass the course exam to unlock certification."}
                  </p>

                  <button
                    onClick={() => navigate("/quiz", { state: { courseId: course.id } })}
                    style={{
                      marginTop: "auto",
                      padding: "10px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--gradient-primary)",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "var(--shadow-glow)",
                      textAlign: "center"
                    }}
                  >
                    Take Certification Quiz
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal Component */}
      <ModalComponent
        isOpen={!!selectedCertCourse}
        onClose={() => setSelectedCertCourse(null)}
        title="View Achievement Certificate"
      >
        {selectedCertCourse && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Diploma template grid */}
            <div style={certificateStyle} className="diploma-border">
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", color: "var(--color-primary)", marginBottom: "16px" }}>
                <GraduationCap size={32} />
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                AURAEDEMY HONORS SCHOLARSHIP
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "16px 0 8px 0", fontFamily: "var(--font-heading)" }}>
                Certificate of Achievement
              </h2>
              <p style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                This verifies that student
              </p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "14px 0", color: "var(--color-primary)" }}>
                {user.name}
              </h3>
              <p style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                has successfully finished the extensive course curriculum syllabus titled
              </p>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "14px 0", color: "var(--text-primary)" }}>
                {selectedCertCourse.title}
              </h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "24px" }}>
                Granted on May 30, 2026 • Verified SkillX Token System (AURA-{selectedCertCourse.id.toUpperCase()})
              </p>
            </div>

            {/* Print trigger details */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setSelectedCertCourse(null)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPNG(selectedCertCourse, user.name)}
                style={{
                  flex: 1.2,
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "var(--color-success)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                Download PNG
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedCertCourse, user.name)}
                style={{
                  flex: 1.5,
                  padding: "12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--gradient-primary)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-glow)"
                }}
              >
                Download PDF Format
              </button>
            </div>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}
