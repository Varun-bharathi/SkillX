import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, BookOpen, Layers, Loader2 } from "lucide-react";

export default function AiContentGenerator() {
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!course.trim() || !topic.trim()) return;

    setLoading(true);
    setError(null);
    setContent("");

    try {
      const response = await fetch("http://localhost:5000/api/llm/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course, topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setContent(data.content);
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating content. Please check your API key and connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        padding: "24px 40px",
        maxWidth: "1000px",
        margin: "0 auto",
        animation: "fadeIn 0.5s ease"
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          AI Content <span className="gradient-text">Generator</span> <Sparkles size={28} style={{ color: "var(--color-primary)", display: "inline", verticalAlign: "middle" }} />
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          Generate comprehensive learning material for any course and topic instantly using our advanced AI.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-md)",
          padding: "24px",
          border: "1px solid var(--border-color)",
          marginBottom: "32px",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
                <BookOpen size={18} /> Course Name
              </label>
              <input
                type="text"
                placeholder="e.g., React Development"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-body)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s ease"
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
                <Layers size={18} /> Topic Name
              </label>
              <input
                type="text"
                placeholder="e.g., React Hooks"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-body)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s ease"
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !course.trim() || !topic.trim()}
            style={{
              padding: "14px 24px",
              borderRadius: "var(--radius-sm)",
              background: "var(--gradient-primary)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              border: "none",
              cursor: (loading || !course.trim() || !topic.trim()) ? "not-allowed" : "pointer",
              opacity: (loading || !course.trim() || !topic.trim()) ? 0.7 : 1,
              boxShadow: "var(--shadow-glow)",
              transition: "filter 0.2s ease",
              alignSelf: "flex-start",
              marginTop: "8px"
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "Generating Content..." : "Generate Material"}
          </button>
        </form>
      </div>

      {error && (
        <div style={{
          padding: "16px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          marginBottom: "24px",
          fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {content && (
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-md)",
            padding: "32px",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
            lineHeight: "1.7",
            color: "var(--text-primary)",
            fontSize: "1.05rem"
          }}
        >
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 style={{fontSize: "2rem", marginBottom: "20px", color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px"}} {...props} />,
              h2: ({node, ...props}) => <h2 style={{fontSize: "1.5rem", marginTop: "30px", marginBottom: "16px", color: "var(--color-primary)"}} {...props} />,
              h3: ({node, ...props}) => <h3 style={{fontSize: "1.25rem", marginTop: "24px", marginBottom: "12px", color: "var(--text-primary)"}} {...props} />,
              p: ({node, ...props}) => <p style={{marginBottom: "16px", color: "var(--text-secondary)"}} {...props} />,
              ul: ({node, ...props}) => <ul style={{marginBottom: "20px", paddingLeft: "24px", color: "var(--text-secondary)"}} {...props} />,
              ol: ({node, ...props}) => <ol style={{marginBottom: "20px", paddingLeft: "24px", color: "var(--text-secondary)"}} {...props} />,
              li: ({node, ...props}) => <li style={{marginBottom: "8px"}} {...props} />,
              code: ({node, inline, ...props}) => 
                inline 
                ? <code style={{backgroundColor: "rgba(139, 92, 246, 0.1)", color: "var(--color-primary)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.9em"}} {...props} />
                : <pre style={{backgroundColor: "#1e293b", color: "#f8fafc", padding: "16px", borderRadius: "8px", overflowX: "auto", marginBottom: "20px"}}><code {...props} /></pre>,
              blockquote: ({node, ...props}) => <blockquote style={{borderLeft: "4px solid var(--color-primary)", paddingLeft: "16px", margin: "0 0 20px 0", fontStyle: "italic", color: "var(--text-secondary)", backgroundColor: "var(--bg-body)", padding: "16px"}} {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
