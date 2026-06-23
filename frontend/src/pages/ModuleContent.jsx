import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import { ArrowLeft, Loader2, BookOpen, PlayCircle, PauseCircle, MonitorPlay, SkipForward, SkipBack, Square } from "lucide-react";
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

  // Video State
  const [showVideo, setShowVideo] = useState(false);
  const [videoSlides, setVideoSlides] = useState([]);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const utteranceRef = useRef(null);

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

        setLoading(false);
        setContent(""); 

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
    
    return () => {
      window.speechSynthesis.cancel();
    }
  }, [courseId, moduleId]);

  const generateVideo = async () => {
    setShowVideo(true);
    setIsVideoLoading(true);
    setVideoSlides([]);
    setCurrentSlideIdx(0);
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    try {
      const response = await fetch("http://localhost:5000/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: course.title, topic: moduleInfo.title }),
      });
      const data = await response.json();
      if (data.success && data.slides && data.slides.length > 0) {
        setVideoSlides(data.slides);
      } else {
        alert("Failed to generate video slides.");
        setShowVideo(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating video.");
      setShowVideo(false);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const playSlide = (idx) => {
    window.speechSynthesis.cancel();
    
    if (idx >= videoSlides.length) {
      setIsPlaying(false);
      return;
    }
    
    setCurrentSlideIdx(idx);
    setIsPlaying(true);
    
    const slide = videoSlides[idx];
    const utterance = new SpeechSynthesisUtterance(slide.narration);
    
    const voices = window.speechSynthesis.getVoices();
    // Try to find a male voice, or fallback to Google English voice
    const preferredVoice = voices.find(v => 
      (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark")) && v.lang.startsWith("en")
    ) || voices.find(v => v.name.includes("Google") && v.lang.startsWith("en"));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 0.95; 
    
    utterance.onend = () => {
      playSlide(idx + 1);
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        playSlide(currentSlideIdx);
      }
      setIsPlaying(true);
    }
  };

  const stopVideo = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setShowVideo(false);
  };

  const skipSlide = (dir) => {
    let nextIdx = currentSlideIdx + dir;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= videoSlides.length) nextIdx = videoSlides.length - 1;
    playSlide(nextIdx);
  };

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
    marginTop: "24px",
    position: "relative"
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
        
        {!showVideo && !loading && (
           <button 
            onClick={generateVideo}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "var(--gradient-primary)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              boxShadow: "var(--shadow-glow)"
            }}
           >
             <MonitorPlay size={20} />
             Play Presentation
           </button>
        )}
      </div>

      {showVideo && (
        <div style={{...cardPanelStyle, border: "2px solid var(--color-primary)", padding: "0", overflow: "hidden", marginBottom: "24px" }}>
          {isVideoLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", backgroundColor: "#0f172a" }}>
               <div className="custom-spinner" style={{ margin: "0 auto", borderColor: "rgba(255,255,255,0.1)", borderTopColor: "var(--color-primary)" }} />
               <p style={{ marginTop: "20px", color: "#94a3b8", fontWeight: 600 }}>Synthesizing Slides & Audio...</p>
            </div>
          ) : videoSlides.length > 0 && (
            <div style={{ position: "relative", backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "450px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              
              <div style={{ display: "flex", flex: 1, flexDirection: "row", overflow: "hidden" }}>
                {/* Slide Content Display (Full Width) */}
                <div style={{ position: "relative", width: "100%", padding: "50px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
                   <h2 style={{ fontSize: "2.8rem", marginBottom: "32px", color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.8)", maxWidth: "900px" }}>
                     {videoSlides[currentSlideIdx].title}
                   </h2>
                   <div style={{ fontSize: "1.3rem", color: "#f1f5f9", lineHeight: 1.7, maxWidth: "900px", width: "100%", whiteSpace: "pre-wrap", textShadow: "0 1px 5px rgba(0,0,0,0.8)", padding: "32px", backgroundColor: "rgba(0, 0, 0, 0.2)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", borderTop: "4px solid var(--color-primary)", textAlign: "left" }}>
                     {videoSlides[currentSlideIdx].content}
                   </div>
                </div>
              </div>
              
              {/* Controls Bar */}
              <div style={{ position: "relative", zIndex: 1, padding: "20px 40px", backgroundColor: "rgba(2, 6, 23, 1)", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#94a3b8", fontSize: "0.95rem", fontWeight: 600 }}>
                  Slide {currentSlideIdx + 1} of {videoSlides.length}
                </div>
                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                   <button onClick={stopVideo} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"} title="Stop Video">
                     <Square size={24} fill="currentColor" />
                   </button>

                   <button onClick={() => skipSlide(-1)} style={{ color: "#cbd5e1", background: "none", border: "none", cursor: currentSlideIdx === 0 ? "not-allowed" : "pointer", opacity: currentSlideIdx === 0 ? 0.5 : 1 }} disabled={currentSlideIdx === 0}>
                     <SkipBack size={24} />
                   </button>
                   
                   <button onClick={togglePlayPause} style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
                     {isPlaying ? <PauseCircle size={54} /> : <PlayCircle size={54} />}
                   </button>
                   
                   <button onClick={() => skipSlide(1)} style={{ color: "#cbd5e1", background: "none", border: "none", cursor: currentSlideIdx === videoSlides.length - 1 ? "not-allowed" : "pointer", opacity: currentSlideIdx === videoSlides.length - 1 ? 0.5 : 1 }} disabled={currentSlideIdx === videoSlides.length - 1}>
                     <SkipForward size={24} />
                   </button>
                </div>
                <div style={{ width: "90px" }}></div>
              </div>
            </div>
          )}
        </div>
      )}

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
                Complete & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
