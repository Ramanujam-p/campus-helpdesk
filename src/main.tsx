import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ IMPORT AUTH PROVIDER
import { AuthProvider } from "./hooks/useAuth";

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* ✅ AUTH CONTEXT AT TOP LEVEL */}
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
