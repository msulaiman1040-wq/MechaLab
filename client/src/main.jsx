import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { WorkshopProvider } from "./Context/WorkshopContext.jsx";

function BrowserZoomBlocker() {
  useEffect(() => {
    // Prevent Ctrl + Wheel zoom
    const wheelHandler = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Prevent double-tap zoom
    let lastTouchEnd = 0;

    const touchHandler = (e) => {
      const now = Date.now();

      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }

      lastTouchEnd = now;
    };

    // Prevent iOS pinch zoom
    const gestureHandler = (e) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", wheelHandler, {
      passive: false,
    });

    document.addEventListener("touchend", touchHandler, {
      passive: false,
    });

    document.addEventListener("gesturestart", gestureHandler);
    document.addEventListener("gesturechange", gestureHandler);
    document.addEventListener("gestureend", gestureHandler);

    return () => {
      window.removeEventListener("wheel", wheelHandler);

      document.removeEventListener("touchend", touchHandler);

      document.removeEventListener("gesturestart", gestureHandler);
      document.removeEventListener("gesturechange", gestureHandler);
      document.removeEventListener("gestureend", gestureHandler);
    };
  }, []);

  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WorkshopProvider>
      <BrowserZoomBlocker />
      <App />
    </WorkshopProvider>
  </StrictMode>
);