//PartDetailPage.jsx
import ArticleSection from "../components/ArticleSection";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { partsData } from "../data/partsData";
import { useMechapediaTheme } from "../Context/MechapediaThemeContext";
import "./Mechapedia.css";

export default function PartDetailPage() {
    const { partId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useMechapediaTheme();

    // Automatically scroll to top when opening a part detail page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [partId]);

    const part = partsData.find((p) => p.id === partId);

    if (!part) {
        return (
            <div className={`mechapedia ${isDarkMode ? "dark-mode" : "light-mode"}`} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <div style={{ textAlign: "center", padding: "100px", flex: 1 }}>
                    <h2>Component Not Found</h2>
                    <button className="backButton" onClick={() => navigate("/mechapedia")}>
                        ← Return to Mechapedia
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <motion.div 
            className={`partPage ${isDarkMode ? "dark-mode" : "light-mode"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
            <div style={{ flex: 1, width: "100%", boxSizing: "border-box" }}>
                {/* Theme Toggle Button */}
                <div className="themeToggleContainer">
                    <button 
                        className="themeToggleBtn"
                        onClick={toggleTheme}
                    >
                        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                </div>

                <div className="pageHeader">
                    <h1>{part.title}</h1>
                    <p>{part.subtitle}</p>
                </div>

                <div className="pageImageContainer">
                    <img src={part.image} alt={part.title} className="mainPartImage" />
                </div>

                {part.sections.map((section, index) => (
                    <ArticleSection
                        key={index}
                        title={section.title}
                        content={section.content}
                    />
                ))}

                <div className="pageButtons">
                    <button className="backButton" onClick={() => navigate("/mechapedia")}>
                        ← Back to Mechapedia
                    </button>
                    <button className="backButton" onClick={() => navigate("/workshop")}>
                        Workshop
                    </button>
                </div>
            </div>

            <Footer />
        </motion.div>
    );
}