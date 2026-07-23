import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { partsData } from "../data/partsData";
import { useMechapediaTheme } from "../Context/MechapediaThemeContext";
import "./Mechapedia.css";

export default function MechapediaHome() {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useMechapediaTheme();

    return (
        <div className={`mechapedia ${isDarkMode ? "dark-mode" : "light-mode"}`}>
            
            {/* Theme Toggle Button */}
            <div className="themeToggleContainer">
                <button 
                    className="themeToggleBtn"
                    onClick={toggleTheme}
                >
                    {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                className="mechapediaTitle"
            >
                Mechapedia
            </motion.h1>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mechapediaSubtitle"
            >
                The Official Automotive Learning Centre of MechaLab
            </motion.h3>

            <motion.p
                className="mechapediaIntro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
            >
                Welcome to <strong>Mechapedia</strong>, the educational knowledge base built into MechaLab.
                <br /><br />
                Instead of reading about vehicle components in ordinary textbooks, Mechapedia allows you to explore genuine three-dimensional automotive parts while learning how they function inside a real vehicle.
                <br /><br />
                Select any component below to begin your learning journey.
            </motion.p>

            <div className="partsGrid">
                {partsData.map((part) => (
                    <motion.div
                        key={part.id}
                        className="partCard"
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/mechapedia/${part.id}`)}
                    >
                        <div className="partImageContainer">
                            <img
                                src={part.image}
                                alt={part.title}
                                className="partImage"
                            />
                        </div>

                        <h2>{part.title}</h2>
                        <p>{part.subtitle}</p>
                    </motion.div>
                ))}
            </div>

            <motion.button
                className="backWorkshop"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/workshop")}
            >
                ← Back to Workshop
            </motion.button>
        </div>
    );
}