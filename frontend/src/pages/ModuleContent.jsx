import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ModuleContent() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { courses } = useLms();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);
  const course = courses.find((c) => c.id === courseId);
  const moduleInfo = course?.syllabus.find((m) => m.id === moduleId);

  useEffect(() => {
    if (!course || !moduleInfo) {
      setError("Course or module not found.");
      setLoading(false);
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchContent = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/llm/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course: course.title, topic: moduleInfo.title }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          setError("Failed to generate content: " + (errData.message || response.statusText));
          setLoading(false);
          return;
        }

        // As soon as the connection is open and we get a 200, stop the full-screen spinner
        setLoading(false);
        setContent(""); // Clear any old content

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          setContent((prev) => prev + chunk);
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to AI service.");
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId, moduleId]);

  if (!course || !moduleInfo) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px" }}>
        <h3>Module Not Found</h3>
        <button onClick={() => navigate(-1)} style={{ marginTop: "20px", color: "var(--color-primary)", fontWeight: 600 }}>
          Go Back
        </button>
      </div>
    );
  }

  const cardPanelStyle = {
    padding: "32px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    boxShadow: "var(--shadow-sm)",
    marginTop: "24px"
  };

  return (
    <div className="page-container animate-fade-in">
      <button 
        onClick={() => navigate(`/course/${courseId}`)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginBottom: "24px",
          transition: "color var(--transition-fast)"
        }}
        onMouseOver={(e) => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
      >
        <ArrowLeft size={16} />
        <span>Back to Course</span>
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        <span className="badge badge-primary" style={{ width: "fit-content", display: "flex", alignItems: "center", gap: "6px" }}>
          <BookOpen size={14} />
          {course.title}
        </span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-heading)", lineHeight: 1.2 }}>
          {moduleInfo.title}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Duration: {moduleInfo.duration}
        </p>
      </div>

      <div style={cardPanelStyle}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", minHeight: "200px" }}>
            <div className="custom-spinner" style={{ margin: "0 auto" }} />
          </div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-primary)", backgroundColor: "var(--bg-body)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "16px", color: "#ef4444" }}>Notice</h3>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--text-secondary)", marginBottom: "24px" }}>
              {error}
            </p>
            <button 
              onClick={() => navigate(`/course/${courseId}`)}
              style={{ 
                padding: "10px 32px", 
                backgroundColor: "var(--color-primary)", 
                color: "#ffffff", 
                border: "none", 
                borderRadius: "var(--radius-sm)", 
                cursor: "pointer", 
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "opacity var(--transition-fast)"
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
              onMouseOut={(e) => e.currentTarget.style.opacity = 1}
            >
              OK
            </button>
          </div>
        ) : (
          <div style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-primary)" }}>
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 style={{fontSize: "1.8rem", marginBottom: "20px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px"}} {...props} />,
                h2: ({node, ...props}) => <h2 style={{fontSize: "1.5rem", marginTop: "32px", marginBottom: "16px", color: "var(--color-primary)"}} {...props} />,
                h3: ({node, ...props}) => <h3 style={{fontSize: "1.2rem", marginTop: "24px", marginBottom: "12px", color: "var(--text-primary)"}} {...props} />,
                p: ({node, ...props}) => <p style={{marginBottom: "16px", color: "var(--text-secondary)"}} {...props} />,
                ul: ({node, ...props}) => <ul style={{marginBottom: "20px", paddingLeft: "24px", color: "var(--text-secondary)"}} {...props} />,
                ol: ({node, ...props}) => <ol style={{marginBottom: "20px", paddingLeft: "24px", color: "var(--text-secondary)"}} {...props} />,
                li: ({node, ...props}) => <li style={{marginBottom: "8px"}} {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                  ? <code style={{backgroundColor: "rgba(139, 92, 246, 0.1)", color: "var(--color-primary)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.9em"}} {...props} />
                  : <pre style={{backgroundColor: "#1e293b", color: "#f8fafc", padding: "16px", borderRadius: "8px", overflowX: "auto", marginBottom: "20px", fontSize: "0.9rem", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"}}><code {...props} /></pre>,
                blockquote: ({node, ...props}) => <blockquote style={{borderLeft: "4px solid var(--color-primary)", paddingLeft: "16px", margin: "0 0 20px 0", fontStyle: "italic", color: "var(--text-secondary)", backgroundColor: "rgba(139, 92, 246, 0.05)", padding: "16px", borderRadius: "0 8px 8px 0"}} {...props} />,
                strong: ({node, ...props}) => <strong style={{color: "var(--text-primary)", fontWeight: 700}} {...props} />
              }}
            >
              {content}
            </ReactMarkdown>

            {/* Acknowledge / Return button underneath content */}
            <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
              <button 
                onClick={() => navigate(`/course/${courseId}`)}
                style={{ 
                  padding: "12px 32px", 
                  backgroundColor: "var(--color-primary)", 
                  color: "#ffffff", 
                  border: "none", 
                  borderRadius: "var(--radius-sm)", 
                  cursor: "pointer", 
                  fontWeight: 600,
                  fontSize: "1rem",
                  transition: "opacity var(--transition-fast)"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
                onMouseOut={(e) => e.currentTarget.style.opacity = 1}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
