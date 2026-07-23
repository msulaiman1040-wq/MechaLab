import { createContext, useContext, useState, useEffect } from "react";

const MechapediaThemeContext = createContext();

export function MechapediaThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("mechapedia_theme");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("mechapedia_theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <MechapediaThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </MechapediaThemeContext.Provider>
  );
}

export function useMechapediaTheme() {
  return useContext(MechapediaThemeContext);
}