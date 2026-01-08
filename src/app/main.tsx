import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App";

declare const __COMMIT_HASH__: string;
declare const __BUILD_TIME__: string;

console.log(
  `%cDarkside Betting`,
  "color: purple; font-weight: bold;",
  `commit: ${__COMMIT_HASH__}`,
  `built: ${__BUILD_TIME__}`
);
// Wrap the app with BrowserRouter
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter >
      <App />
    </BrowserRouter>
  </StrictMode>
);
