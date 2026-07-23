import ToastContainer from "./components/ToastContainer";
import { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkshopProvider } from "./Context/WorkShopContext";
import { MechapediaThemeProvider } from "./Context/MechapediaThemeContext";
import { AssemblyValidationProvider } from "./Context/AssemblyValidationContext";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workshop from "./pages/Workshop";

// Corrected import paths based on standard src/pages structure
import MechapediaHome from "./pages/MechapediaHome";
import PartDetailPage from "./pages/PartDetailPage";

function App() {
  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio();
      audio.play().catch(() => {});
      window.removeEventListener("mousedown", unlockAudio);
    };

    window.addEventListener("mousedown", unlockAudio);
    return () => window.removeEventListener("mousedown", unlockAudio);
  }, []);

  return (
    <WorkshopProvider>
      <MechapediaThemeProvider>
        <AssemblyValidationProvider>
          <ToastContainer />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/workshop" element={<Workshop />} />
              
              {/* Mechapedia Routes */}
              <Route path="/mechapedia" element={<MechapediaHome />} />
              <Route path="/mechapedia/:partId" element={<PartDetailPage />} />
            </Routes>
          </BrowserRouter>
        </AssemblyValidationProvider>
      </MechapediaThemeProvider>
    </WorkshopProvider>
  );
}

export default App;