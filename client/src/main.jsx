//main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { WorkshopProvider } from "./Context/WorkshopContext.jsx";

createRoot(document.getElementById("root")).render(
  <WorkshopProvider>
    <App />
  </WorkshopProvider>
);