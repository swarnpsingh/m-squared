import React from "react";
import ReactDOM from "react-dom/client"; // Fix: Use createRoot for React 18+
import App from "./App";
import { AuthProvider } from "./hooks/useAuth"; // Ensure correct path
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
