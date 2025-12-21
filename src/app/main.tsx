import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App";

// Wrap the app with BrowserRouter
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> {/* Ensure the app is wrapped in BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
