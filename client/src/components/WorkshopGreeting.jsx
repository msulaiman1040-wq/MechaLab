// ../components/WorkshopGreeting.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import "./WorkshopGreeting.css";

export default function WorkshopGreeting() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="workshop-greeting-banner"
                >
                    {/* Pulsing Status Dot */}
                    <div className="greeting-status-dot" />

                    <div>
                        <div className="greeting-label">
                            HELLO
                        </div>
                        <div className="greeting-message">
                            Welcome to MechaLab Bay. Systems online.
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}