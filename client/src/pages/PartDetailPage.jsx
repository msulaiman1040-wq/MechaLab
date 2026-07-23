//PartDetailPage.jsx
import ArticleSection from "../components/ArticleSection";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { partsData } from "../data/partsData";
import { useMechapediaTheme } from "../Context/MechapediaThemeContext";
import "./Mechapedia.css";

export default function PartDetailPage() {
    const { partId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useMechapediaTheme();

    const part = partsData.find((p) => p.id === partId);

    if (!part) {
        return (
            <div className={`mechapedia ${isDarkMode ? "dark-mode" : "light-mode"}`} style={{ textAlign: "center", padding: "100px" }}>
                <h2>Component Not Found</h2>
                <button className="backButton" onClick={() => navigate("/mechapedia")}>
                    ← Return to Mechapedia
                </button>
            </div>
        );
    }

    return (
        <motion.div 
            className={`partPage ${isDarkMode ? "dark-mode" : "light-mode"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
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
        </motion.div>
    );
}