import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLms } from "../context/LmsContext";

// Layout
import AppLayout from "../layouts/AppLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Dashboard from "../pages/Dashboard";
import Catalog from "../pages/Catalog";
import CourseDetails from "../pages/CourseDetails";
import PersonalizedLearningPath from "../pages/PersonalizedLearningPath";
import QuizGeneration from "../pages/QuizGeneration";
import StudentAnalytics from "../pages/StudentAnalytics";
import CourseRecommendation from "../pages/CourseRecommendation";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRoutes() {
  const { user } = useLms();

  // Helper route guard to enforce authentication
  const RequireAuth = ({ children }) => {
    return user.isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* App wrapper layout handles header/sidebar rendering */}
      <Route path="/" element={<AppLayout />}>
        {/* Public routes */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        {/* Private / Authenticated student routes */}
        <Route 
          path="dashboard" 
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } 
        />
        <Route 
          path="catalog" 
          element={
            <RequireAuth>
              <Catalog />
            </RequireAuth>
          } 
        />
        <Route 
          path="course/:id" 
          element={
            <RequireAuth>
              <CourseDetails />
            </RequireAuth>
          } 
        />
        <Route 
          path="learning-path" 
          element={
            <RequireAuth>
              <PersonalizedLearningPath />
            </RequireAuth>
          } 
        />
        <Route 
          path="quiz" 
          element={
            <RequireAuth>
              <QuizGeneration />
            </RequireAuth>
          } 
        />
        <Route 
          path="analytics" 
          element={
            <RequireAuth>
              <StudentAnalytics />
            </RequireAuth>
          } 
        />
        <Route 
          path="recommendations" 
          element={
            <RequireAuth>
              <CourseRecommendation />
            </RequireAuth>
          } 
        />
        <Route 
          path="profile" 
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          } 
        />
        <Route 
          path="settings" 
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          } 
        />

        {/* Fallback route handles invalid links */}
        <Route path="*" element={<Navigate to={user.isLoggedIn ? "/dashboard" : "/"} replace />} />
      </Route>
    </Routes>
  );
}
