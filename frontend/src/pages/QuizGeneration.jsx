import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { Clock, HelpCircle, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Award, Download, RefreshCw, FileText, Image } from "lucide-react";

export default function QuizGeneration() {
  const { quizScores, submitQuizResult, enrolledCourses, courses, user } = useLms();
  const location = useLocation();
  const [showCertOptions, setShowCertOptions] = useState(false);

  // Active quiz state
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Quiz progression
  const [quizState, setQuizState] = useState("select"); // 'select' | 'active' | 'result'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedIndex }
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [calculatedScore, setCalculatedScore] = useState(0); // Score as absolute correct count

  // Timer Ref
  const timerRef = useRef(null);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // ── Certificate download helpers ──────────────────────────────────────────
  const handleDownloadPNG = (course, userName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(500, 350, 50, 500, 350, 500);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 10;
    ctx.strokeStyle = "#6366f1";
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#10b981";
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

    ctx.fillStyle = "#10b981";
    ctx.fillRect(25, 25, 30, 30);
    ctx.fillRect(canvas.width - 55, 25, 30, 30);
    ctx.fillRect(25, canvas.height - 55, 30, 30);
    ctx.fillRect(canvas.width - 55, canvas.height - 55, 30, 30);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("AURAEDEMY HONORS SCHOLARSHIP", 500, 110);
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Certificate of Achievement", 500, 180);
    ctx.font = "italic 18px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("This verifies that student", 500, 250);
    ctx.font = "bold 38px Georgia, serif";
    ctx.fillStyle = "#10b981";
    ctx.fillText(userName, 500, 310);
    ctx.font = "italic 16px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("has successfully finished the extensive course curriculum syllabus titled", 500, 375);
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(course.title, 500, 430);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#64748b";
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    ctx.fillText(`Granted on ${dateStr}  •  Verified AuraLMS Token System (AURA-${course.id.toUpperCase()})`, 500, 520);
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText("AuraEdemy Director", 300, 600);
    ctx.fillText("Principal Examiner", 700, 600);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#475569";
    ctx.beginPath();
    ctx.moveTo(200, 580); ctx.lineTo(400, 580);
    ctx.moveTo(600, 580); ctx.lineTo(800, 580);
    ctx.stroke();

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
    if (!printWindow) { alert("Please allow popups to download the PDF certificate."); return; }
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const tokenId = `AURA-${course.id.toUpperCase()}`;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>AuraEdemy Certificate - ${course.title}</title><style>
      @page{size:A4 landscape;margin:0}
      body{margin:0;padding:0;background:#0f172a;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .cert{width:90%;max-width:950px;height:85%;max-height:580px;border:8px double #6366f1;padding:40px;border-radius:4px;background:#0f172a;text-align:center;position:relative;box-sizing:border-box;box-shadow:0 0 40px rgba(0,0,0,.5)}
      .inner{position:absolute;top:8px;left:8px;right:8px;bottom:8px;border:2px solid #10b981;pointer-events:none}
      .corner{position:absolute;width:25px;height:25px;background:#10b981}
      .tl{top:-2px;left:-2px}.tr{top:-2px;right:-2px}.bl{bottom:-2px;left:-2px}.br{bottom:-2px;right:-2px}
      .hdr{font-size:14px;font-weight:700;letter-spacing:.25em;color:#94a3b8;margin-bottom:20px}
      .ttl{font-size:38px;font-weight:800;margin:10px 0;color:#fff}
      .vfy{font-style:italic;color:#94a3b8;font-size:16px;margin-bottom:15px}
      .name{font-size:34px;font-weight:700;color:#10b981;margin:15px 0}
      .syl{font-style:italic;color:#94a3b8;font-size:16px;margin-bottom:15px}
      .ctitle{font-size:24px;font-weight:700;color:#e2e8f0;margin:15px 0}
      .dt{font-family:monospace;font-size:12px;color:#64748b;margin-top:30px}
      .sigs{margin-top:40px;display:flex;justify-content:space-around}
      .sig{width:200px}.sig-line{border-top:1px solid #475569;margin-bottom:8px}.sig-title{font-size:13px;color:#e2e8f0;font-weight:600}
    </style></head><body><div class='cert'><div class='inner'><div class='corner tl'></div><div class='corner tr'></div><div class='corner bl'></div><div class='corner br'></div></div>
      <div class='hdr'>AURAEDEMY HONORS SCHOLARSHIP</div>
      <div class='ttl'>Certificate of Achievement</div>
      <div class='vfy'>This verifies that student</div>
      <div class='name'>${userName}</div>
      <div class='syl'>has successfully finished the extensive course curriculum syllabus titled</div>
      <div class='ctitle'>${course.title}</div>
      <div class='dt'>Granted on ${dateStr} &nbsp;•&nbsp; Verified AuraLMS Token System (${tokenId})</div>
      <div class='sigs'><div class='sig'><div class='sig-line'></div><div class='sig-title'>AuraEdemy Director</div></div><div class='sig'><div class='sig-line'></div><div class='sig-title'>Principal Examiner</div></div></div>
    </div><script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);}<\/script></body></html>`);
    printWindow.document.close();
  };
  // ─────────────────────────────────────────────────────────────────────────

  // Load quiz dynamically from Express database endpoint
  const loadQuizForCourse = async (courseId) => {
    try {
      setLoadingQuiz(true);
      setErrorMsg("");
      const token = localStorage.getItem("aura-token");
      const res = await fetch(`http://localhost:5000/api/quizzes/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to load quiz assessment from server.");
      }
      const selected = await res.json();
      if (selected.questions && selected.questions.length > 0) {
        selected.questions = shuffleArray(selected.questions);
      }
      setCurrentQuiz(selected);
      setActiveQuizId(selected.id);
      setQuizState("active");
      setCurrentQuestionIdx(0);
      setSelectedAnswers({});
      setSecondsRemaining(selected.durationSeconds || 600);
    } catch (err) {
      console.error("Load Quiz Error:", err.message);
      setErrorMsg(err.message);
      setQuizState("select");
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    const stateCourseId = location.state?.courseId;
    if (stateCourseId) {
      loadQuizForCourse(stateCourseId);
    }
  }, [location.state]);

  // Select a quiz to initiate
  const handleSelectQuiz = (courseId) => {
    loadQuizForCourse(courseId);
  };

  // Timer countdown hook
  useEffect(() => {
    if (quizState === "active" && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz(); // Force auto-submit when timer expires!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, secondsRemaining]);

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Score calculation
    let correctCount = 0;
    currentQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setCalculatedScore(correctCount);
    setQuizState("result");

    // Commit results to global context state so charts update
    submitQuizResult(
      currentQuiz.courseId,
      currentQuiz.courseTitle,
      correctCount,
      currentQuiz.questions.length
    );
  };

  // Helper formatting for timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginTop: "20px"
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Quiz Arena
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Test your skill thresholds. Submit answers to record performance analytics and boost active course progress.
        </p>
      </div>

      {errorMsg && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          border: "1px solid var(--color-danger)",
          color: "var(--color-danger)",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loadingQuiz && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          gap: "16px",
          color: "var(--text-secondary)"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid var(--border-color)",
            borderTopColor: "var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} className="spinner-loader"></div>
          <span>Retrieving exam questions from database...</span>
        </div>
      )}

      {!loadingQuiz && quizState === "select" && (
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px", fontFamily: "var(--font-heading)" }}>
            Certification Exams
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "24px" }}>
            Only courses you have fully completed (100% progress) are eligible for the certification exam.
          </p>

          {/* Filter: enrolled + 100% progress */}
          {(() => {
            const eligibleCourses = courses.filter((course) => {
              const enrollment = enrolledCourses[course.id];
              return enrollment && enrollment.progress === 100;
            });

            if (eligibleCourses.length === 0) {
              return (
                <div style={{
                  padding: "48px 32px",
                  borderRadius: "var(--radius-md)",
                  border: "1px dashed var(--border-color)",
                  backgroundColor: "var(--bg-card)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(99, 102, 241, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-primary)"
                  }}>
                    <Award size={28} />
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    No Eligible Courses Yet
                  </h4>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: "380px", lineHeight: 1.5 }}>
                    Complete all lessons in an enrolled course to unlock its certification exam. Your progress must reach <strong>100%</strong> before you can take the quiz.
                  </p>
                </div>
              );
            }

            return (
              <div style={gridStyle}>
                {eligibleCourses.map((course) => {
                  const attempt = quizScores.find((score) => score.courseId === course.id);
                  const enrollment = enrolledCourses[course.id];
                  const hasPassed = attempt && attempt.score >= 70;
                  const hasFailed = attempt && attempt.score < 70;

                  return (
                    <div
                      key={course.id}
                      style={{
                        padding: "24px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-card)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span className="badge badge-primary">{course.category.toUpperCase()}</span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <span className="badge badge-success">100% Complete</span>
                            {attempt && (
                              <span className={`badge ${hasPassed ? "badge-success" : "badge-danger"}`}>
                                {hasPassed ? "Test Completed" : "Re-Test"}
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "12px", lineHeight: 1.3 }}>
                          {course.title}
                        </h4>
                      </div>

                      <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <HelpCircle size={14} />
                          <span>10 Questions</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={14} />
                          <span>10 mins</span>
                        </div>
                      </div>

                      {attempt && (
                        <div style={{ 
                          fontSize: "0.85rem", 
                          padding: "8px 12px", 
                          borderRadius: "var(--radius-sm)", 
                          backgroundColor: hasPassed ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)", 
                          border: hasPassed ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(239, 68, 68, 0.15)",
                          color: "var(--text-secondary)", 
                          fontWeight: 500,
                          display: "flex",
                          justifyContent: "space-between"
                        }}>
                          <span>Result: <strong style={{ color: hasPassed ? "var(--color-success)" : "var(--color-danger)" }}>{hasPassed ? "Passed" : "Failed"}</strong></span>
                          <span>Score: <strong style={{ color: hasPassed ? "var(--color-success)" : "var(--color-danger)" }}>{attempt.score}%</strong></span>
                        </div>
                      )}

                      <button
                        onClick={() => handleSelectQuiz(course.id)}
                        style={{
                          marginTop: "auto",
                          padding: "12px",
                          borderRadius: "var(--radius-sm)",
                          background: hasFailed 
                            ? "var(--color-danger, #ef4444)" 
                            : "var(--gradient-primary)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          boxShadow: hasFailed ? "0 4px 12px rgba(239, 68, 68, 0.2)" : "var(--shadow-glow)"
                        }}
                      >
                        {hasPassed 
                          ? "Take Another Test" 
                          : hasFailed 
                            ? "Take Re-Test" 
                            : "Take Certification Exam"}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* STEP 2: Interactive Multiple-Choice Testing Card */}
      {quizState === "active" && currentQuiz && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {/* Quiz running Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderBottom: "none"
          }}>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{currentQuiz.courseTitle}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}
              </p>
            </div>

            {/* Running Timer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              backgroundColor: secondsRemaining < 60 ? "rgba(239, 68, 68, 0.1)" : "rgba(99, 102, 241, 0.1)",
              color: secondsRemaining < 60 ? "var(--color-danger)" : "var(--color-primary)",
              fontWeight: 700,
              fontSize: "0.9rem"
            }}>
              <Clock size={16} />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          </div>

          {/* Question panel */}
          <div className="glass-panel" style={{
            padding: "32px",
            borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            borderTop: "none",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {/* Question Text */}
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.4 }}>
              {currentQuiz.questions[currentQuestionIdx].question}
            </h4>

            {/* Answer Options Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentQuiz.questions[currentQuestionIdx].options.map((option, idx) => {
                const questionId = currentQuiz.questions[currentQuestionIdx].id;
                const isSelected = selectedAnswers[questionId] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(questionId, idx)}
                    style={{
                      padding: "14px 20px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--color-primary)" : "var(--border-color)",
                      backgroundColor: isSelected ? "rgba(99, 102, 241, 0.05)" : "var(--bg-surface)",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "var(--color-primary)" : "var(--text-secondary)",
                      transition: "all var(--transition-fast)",
                      display: "flex",
                      gap: "12px",
                      alignItems: "center"
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "var(--color-primary)";
                        e.currentTarget.style.backgroundColor = "var(--bg-card)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "var(--border-color)";
                        e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                      }
                    }}
                  >
                    <div style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--color-primary)" : "var(--text-muted)",
                      backgroundColor: isSelected ? "var(--color-primary)" : "transparent",
                      color: isSelected ? "#ffffff" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Stepper controls */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIdx === 0}
                style={{
                  padding: "10px 18px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  opacity: currentQuestionIdx === 0 ? 0.5 : 1,
                  cursor: currentQuestionIdx === 0 ? "default" : "pointer"
                }}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              {currentQuestionIdx === currentQuiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-success)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)"
                  }}
                >
                  Submit Answers
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--color-primary)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {quizState === "result" && currentQuiz && (() => {
        const total = currentQuiz.questions.length;
        const scorePercent = Math.round((calculatedScore / total) * 100);
        const passed = scorePercent >= 70;
        // Find the course object for certificate generation
        const quizCourse = courses.find((c) => c.id === currentQuiz.courseId) || { id: currentQuiz.courseId, title: currentQuiz.courseTitle };

        const handleRetake = () => {
          setShowCertOptions(false);
          loadQuizForCourse(currentQuiz.courseId);
        };

        return (
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* ── Score Card ── */}
            <div className="glass-panel" style={{ padding: "40px", borderRadius: "var(--radius-lg)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

              {/* Status icon + heading */}
              <div style={{
                width: "88px", height: "88px", borderRadius: "50%",
                backgroundColor: passed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: passed ? "var(--color-success)" : "var(--color-danger)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {passed ? <Award size={52} /> : <AlertCircle size={52} />}
              </div>

              <div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: passed ? "var(--color-success)" : "var(--color-danger)", marginBottom: "6px" }}>
                  {passed ? "Exam Passed! 🎓" : "Exam Failed ⚠️"}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "420px", lineHeight: 1.6 }}>
                  {passed
                    ? "Congratulations! You met the 70% pass threshold. Download your certificate below."
                    : "You need 70% or above to earn the certificate. Try again with a new set of questions!"}
                </p>
              </div>

              {/* Animated score ring */}
              <div style={{ position: "relative", width: "150px", height: "150px" }}>
                <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="40" fill="transparent"
                    stroke={passed ? "var(--color-success)" : "var(--color-danger)"}
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * scorePercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.2s ease-in-out" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-heading)", fontWeight: 800
                }}>
                  <span style={{ fontSize: "1.7rem", color: passed ? "var(--color-success)" : "var(--color-danger)" }}>
                    {scorePercent}%
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "4px", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {calculatedScore}/{total} Marks
                  </span>
                </div>
              </div>

              {/* Score breakdown pills */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ padding: "8px 18px", borderRadius: "var(--radius-full)", backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-success)" }}>
                  ✓ {calculatedScore} Correct
                </div>
                <div style={{ padding: "8px 18px", borderRadius: "var(--radius-full)", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-danger)" }}>
                  ✗ {total - calculatedScore} Incorrect
                </div>
                <div style={{ padding: "8px 18px", borderRadius: "var(--radius-full)", backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-color)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Pass mark: 70%
                </div>
              </div>

              {/* Final Grade label */}
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                Final Grade: <strong style={{ color: passed ? "var(--color-success)" : "var(--color-danger)" }}>
                  {scorePercent}% — {passed ? "PASS" : "FAIL"}
                </strong>
              </div>

              {/* ── Action buttons ── */}
              {passed ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%", maxWidth: "380px" }}>
                  {/* Primary: Get Certificate */}
                  <button
                    onClick={() => setShowCertOptions((prev) => !prev)}
                    style={{
                      width: "100%",
                      padding: "14px 28px",
                      borderRadius: "var(--radius-sm)",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(16,185,129,0.5)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.35)"; }}
                  >
                    <Award size={20} />
                    Get Certificate
                    <Download size={16} style={{ opacity: 0.8 }} />
                  </button>

                  {/* Download sub-options (toggle) */}
                  {showCertOptions && (
                    <div style={{
                      width: "100%",
                      display: "flex",
                      gap: "10px",
                      animation: "fadeIn 0.2s ease"
                    }}>
                      <button
                        onClick={() => handleDownloadPNG(quizCourse, user.name)}
                        style={{
                          flex: 1, padding: "11px", borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-success)",
                          color: "var(--color-success)", backgroundColor: "rgba(16,185,129,0.06)",
                          fontWeight: 700, fontSize: "0.85rem",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                          cursor: "pointer", transition: "background 0.15s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(16,185,129,0.12)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(16,185,129,0.06)"}
                      >
                        <Image size={15} /> Download PNG
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(quizCourse, user.name)}
                        style={{
                          flex: 1, padding: "11px", borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-primary)",
                          color: "var(--color-primary)", backgroundColor: "rgba(99,102,241,0.06)",
                          fontWeight: 700, fontSize: "0.85rem",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                          cursor: "pointer", transition: "background 0.15s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.12)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.06)"}
                      >
                        <FileText size={15} /> Download PDF
                      </button>
                    </div>
                  )}

                  {/* Secondary: back to arena */}
                  <button
                    onClick={() => { setShowCertOptions(false); setQuizState("select"); }}
                    style={{
                      width: "100%", padding: "11px", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)", backgroundColor: "transparent",
                      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer"
                    }}
                  >
                    Return to Quiz Arena
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%", maxWidth: "380px" }}>
                  {/* Primary: Retake */}
                  <button
                    onClick={handleRetake}
                    style={{
                      width: "100%",
                      padding: "14px 28px",
                      borderRadius: "var(--radius-sm)",
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: "var(--shadow-glow)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      transition: "transform 0.15s, box-shadow 0.15s",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <RefreshCw size={18} />
                    Take Re-Test
                  </button>

                  {/* Secondary: back */}
                  <button
                    onClick={() => setQuizState("select")}
                    style={{
                      width: "100%", padding: "11px", borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)", backgroundColor: "transparent",
                      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer"
                    }}
                  >
                    Return to Quiz Arena
                  </button>
                </div>
              )}
            </div>

            {/* Question Explanations checklist */}
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "20px", fontFamily: "var(--font-heading)" }}>
                Question Breakdown & Explanations
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {currentQuiz.questions.map((q, qIdx) => {
                  const userChoiceIdx = selectedAnswers[q.id];
                  const isCorrect = userChoiceIdx === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      style={{
                        padding: "24px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid",
                        borderColor: isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                        backgroundColor: "var(--bg-card)",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <h4 style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.4 }}>
                          {qIdx + 1}. {q.question}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }} className={isCorrect ? "badge-success" : "badge-danger"}>
                          {isCorrect ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-success)", fontWeight: 700, fontSize: "0.8rem" }}>
                              <CheckCircle2 size={16} />
                              <span>Correct</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-danger)", fontWeight: 700, fontSize: "0.8rem" }}>
                              <XCircle size={16} />
                              <span>Incorrect</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Options list showing status colors */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {q.options.map((option, idx) => {
                          const isUserChoice = userChoiceIdx === idx;
                          const isCorrectAnswer = q.correctAnswer === idx;

                          let bgColor = "var(--bg-surface)";
                          let borderColor = "var(--border-color)";
                          let colorText = "var(--text-secondary)";
                          let labelText = "";

                          if (isCorrectAnswer) {
                            bgColor = "rgba(16, 185, 129, 0.08)";
                            borderColor = "var(--color-success)";
                            colorText = "var(--text-primary)";
                            labelText = " (Correct Answer)";
                          } else if (isUserChoice && !isCorrect) {
                            bgColor = "rgba(239, 68, 68, 0.08)";
                            borderColor = "var(--color-danger)";
                            colorText = "var(--text-primary)";
                            labelText = " (Your Incorrect Choice)";
                          }

                          return (
                            <div
                              key={idx}
                              style={{
                                padding: "10px 16px",
                                borderRadius: "var(--radius-sm)",
                                border: "1px solid",
                                borderColor,
                                backgroundColor: bgColor,
                                color: colorText,
                                fontSize: "0.85rem",
                                fontWeight: isUserChoice || isCorrectAnswer ? 600 : 500,
                                display: "flex",
                                justifyContent: "space-between"
                              }}
                            >
                              <span>{String.fromCharCode(65 + idx)}. {option}</span>
                              <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{labelText}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanations text */}
                      <div style={{
                        backgroundColor: "var(--bg-surface)",
                        padding: "14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-color)",
                        fontSize: "0.85rem",
                        lineHeight: 1.4,
                        color: "var(--text-secondary)"
                      }}>
                        <strong style={{ color: "var(--text-primary)" }}>Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
