import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLms } from "../context/LmsContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function AppLayout() {
  const { user } = useLms();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if we are on a public route (Landing, Login, Signup)
  const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);

  // Auto-close sidebar on smaller viewports or public routes
  useEffect(() => {
    if (window.innerWidth <= 1024 || isPublicRoute) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [location.pathname, isPublicRoute]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else if (!isPublicRoute) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPublicRoute]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determine standard indentation padding for sidebar
  const getSidebarPadding = () => {
    if (isPublicRoute || !user.isLoggedIn) return "0px";
    return sidebarOpen ? "260px" : "0px";
  };

  return (
    <div className="app-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Dynamic Global Topbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* Dynamic Global Sidebar (authenticated only) */}
        {user.isLoggedIn && !isPublicRoute && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Global Page Content panel */}
        <div 
          className="main-content" 
          style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            paddingLeft: getSidebarPadding(),
            transition: "padding-left var(--transition-normal)",
            minWidth: 0
          }}
        >
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Outlet />
          </main>
          
          {/* Universal footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
