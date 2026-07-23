import React from "react";
import { motion } from "framer-motion";

export default function AssemblyTutorialWelcome({ onContinue, onExit }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                zIndex: 4000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                boxSizing: "border-box"
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                    backgroundColor: "#0b0b0b",
                    border: "2px solid #0047AB",
                    borderRadius: "16px",
                    padding: "clamp(24px, 5vw, 40px)",
                    maxWidth: "500px",
                    width: "100%",
                    boxShadow: "0 0 30px rgba(0, 71, 171, 0.4)",
                    fontFamily: "'Rajdhani', sans-serif",
                    color: "#fff",
                    textAlign: "center",
                    boxSizing: "border-box"
                }}
            >
                <h2 style={{ 
                    fontSize: "clamp(1.5rem, 4vw, 2rem)", 
                    marginBottom: "16px", 
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    wordBreak: "break-word"
                }}>
                    Welcome to Assembly Tutorial
                </h2>
                
                <p style={{ 
                    fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)", 
                    lineHeight: "1.6", 
                    color: "#cccccc", 
                    marginBottom: "clamp(25px, 4vh, 35px)" 
                }}>
                    In this session, you will be guided through the part selection and installation process of the system.
                </p>

                <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap",
                    gap: "12px", 
                    justifyContent: "center" 
                }}>
                    <button
                        onClick={onContinue}
                        style={{
                            backgroundColor: "#0047AB",
                            color: "#fff",
                            border: "none",
                            padding: "clamp(10px, 2vh, 12px) clamp(20px, 4vw, 28px)",
                            borderRadius: "6px",
                            fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "background 0.2s ease, transform 0.1s ease",
                            boxShadow: "0 4px 12px rgba(0, 71, 171, 0.4)",
                            flex: "1",
                            minWidth: "130px"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#0056c1"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#0047AB"}
                    >
                        Continue
                    </button>

                    <button
                        onClick={onExit}
                        style={{
                            backgroundColor: "transparent",
                            color: "#aaa",
                            border: "1px solid #444",
                            padding: "clamp(10px, 2vh, 12px) clamp(16px, 3vw, 24px)",
                            borderRadius: "6px",
                            fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            flex: "1",
                            minWidth: "130px"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.color = "#fff";
                            e.target.style.borderColor = "#ff4d4d";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = "#aaa";
                            e.target.style.borderColor = "#444";
                        }}
                    >
                        Exit Tutorial
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}