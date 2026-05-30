import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LmsProvider } from "./context/LmsContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <LmsProvider>
        <AppRoutes />
      </LmsProvider>
    </BrowserRouter>
  );
}
