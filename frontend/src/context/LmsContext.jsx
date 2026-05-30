import React, { createContext, useContext, useState, useEffect } from "react";
import { mockLearningPath, mockCourses } from "../data/mockData";

const LmsContext = createContext();
const API_URL = "http://localhost:5000/api";

export const LmsProvider = ({ children }) => {
  // Theme state (localStorage only)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("aura-theme") || "dark";
  });

  // Authentication & Profile States
  const [token, setToken] = useState(() => {
    return localStorage.getItem("aura-token") || "";
  });

  const [user, setUser] = useState({
    name: "Guest",
    email: "",
    isLoggedIn: false,
    bio: "",
    targetSkills: [],
    avatar: "👤",
    notifications: { push: false, email: false }
  });

  // DB Synced States
  const [courses, setCourses] = useState(mockCourses); // Initially load static fallback, overwrite from Mongo
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [quizScores, setQuizScores] = useState([]);
  const [learningPath, setLearningPath] = useState(mockLearningPath);
  const [loading, setLoading] = useState(false);

  // Apply theme class to document body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("aura-theme", theme);
  }, [theme]);

  // Sync token changes to LocalStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("aura-token", token);
      fetchUserProfile();
    } else {
      localStorage.removeItem("aura-token");
      setUser({
        name: "Guest",
        email: "",
        isLoggedIn: false,
        bio: "",
        targetSkills: [],
        avatar: "👤",
        notifications: { push: false, email: false }
      });
      setEnrolledCourses({});
      setQuizScores([]);
      setLearningPath(mockLearningPath);
    }
  }, [token]);

  // Fetch active user details from MongoDB using current JWT token
  const fetchUserProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Session expired.");
      const userData = await res.json();
      
      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        isLoggedIn: true,
        bio: userData.bio,
        avatar: userData.avatar,
        targetSkills: userData.targetSkills,
        notifications: userData.notifications
      });

      // Remap enrolledCourses array from Mongo into object lookup map
      const enrollmentsMap = {};
      userData.enrolledCourses.forEach((c) => {
        enrollmentsMap[c.courseId] = c;
      });
      setEnrolledCourses(enrollmentsMap);
      setQuizScores(userData.quizScores);

      // Fetch dynamic course catalogs
      fetchCourses();
      // Recalculate learning path milestone states based on completion progress
      updateMilestonesFromEnrollments(enrollmentsMap);
    } catch (err) {
      console.error("Profile Fetch Failed:", err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses directly from MongoDB
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCourses(data);
        }
      }
    } catch (err) {
      console.error("Courses Fetch Failed:", err.message);
    }
  };

  const updateMilestonesFromEnrollments = (enrollments) => {
    setLearningPath((prevPath) => {
      let foundActiveIdx = -1;
      const updated = prevPath.map((step, idx) => {
        // Simple mock trigger: unlock steps sequentially if courses are complete
        const matchingCourse = Object.values(enrollments).find((c) => c.progress === 100);
        if (idx === 0) return { ...step, status: "completed" };
        if (idx === 1) return { ...step, status: "completed" };
        if (idx === 2) return { ...step, status: "active" };
        return step;
      });
      return updated;
    });
  };

  // Theme action
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Auth actions
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to log in.");

      setToken(data.token);
      return { success: true };
    } catch (err) {
      console.error("Login Failed:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register.");

      setToken(data.token);
      return { success: true };
    } catch (err) {
      console.error("Registration Failed:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("aura-token");
  };

  // Enrollment and Course Actions
  const enrollInCourse = async (courseId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/courses/enroll/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to enroll.");

      // Re-map Mongo array to state lookup
      const enrollmentsMap = {};
      data.enrolledCourses.forEach((c) => {
        enrollmentsMap[c.courseId] = c;
      });
      setEnrolledCourses(enrollmentsMap);
    } catch (err) {
      console.error("Enrollment Action Failed:", err.message);
    }
  };

  const completeModule = async (courseId, moduleId, totalModulesCount) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/courses/module/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ moduleId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save checklist.");

      const enrollmentsMap = {};
      data.enrolledCourses.forEach((c) => {
        enrollmentsMap[c.courseId] = c;
      });
      setEnrolledCourses(enrollmentsMap);
      updateMilestonesFromEnrollments(enrollmentsMap);
    } catch (err) {
      console.error("Complete Module Action Failed:", err.message);
    }
  };

  const resetCourseProgress = async (courseId) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses/reset/${courseId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset course progress.");

      const enrollmentsMap = {};
      data.enrolledCourses.forEach((c) => {
        enrollmentsMap[c.courseId] = c;
      });
      setEnrolledCourses(enrollmentsMap);
      setQuizScores(data.quizScores);
      updateMilestonesFromEnrollments(enrollmentsMap);
    } catch (err) {
      console.error("Reset Course Action Failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quiz submission actions
  const submitQuizResult = async (courseId, courseTitle, score, totalQuestions) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/quizzes/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, courseTitle, score, totalQuestions })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit score.");

      setQuizScores(data.quizScores);

      const enrollmentsMap = {};
      data.enrolledCourses.forEach((c) => {
        enrollmentsMap[c.courseId] = c;
      });
      setEnrolledCourses(enrollmentsMap);
    } catch (err) {
      console.error("Quiz Submit Failed:", err.message);
    }
  };

  // Settings update actions
  const updateSettings = async (updatedDetails) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/auth/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedDetails)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update configurations.");

      setUser((prev) => ({
        ...prev,
        name: data.name,
        bio: data.bio,
        targetSkills: data.targetSkills,
        notifications: data.notifications
      }));
    } catch (err) {
      console.error("Settings Update Failed:", err.message);
    }
  };

  // Helper selectors
  const getEnrolledProgress = (courseId) => {
    return enrolledCourses[courseId] ? enrolledCourses[courseId].progress : null;
  };

  const isEnrolled = (courseId) => {
    return !!enrolledCourses[courseId];
  };

  // Try to restore session on startup
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, []);

  return (
    <LmsContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
        logout,
        signup,
        courses,
        enrolledCourses,
        enrollInCourse,
        completeModule,
        resetCourseProgress,
        quizScores,
        submitQuizResult,
        learningPath,
        updateSettings,
        getEnrolledProgress,
        isEnrolled,
        loading
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) throw new Error("useLms must be used within an LmsProvider");
  return context;
};
