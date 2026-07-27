import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorialStepOverlay({ stepData, currentStep }) {
    const [coords, setCoords] = useState({ top: window.innerHeight - 200, left: window.innerWidth / 2, arrowOffset: 0, mode: "standard", flipVertical: false });

    useEffect(() => {
        const updatePosition = () => {
            const isSmallScreen = window.innerWidth < 768;

            if (currentStep === 1) {
                const targetItem = 
                    document.querySelector('.partCircle') ||
                    document.querySelector('[data-part-id="brake-fl"]') ||
                    document.querySelector('.workbench-part') ||
                    document.querySelector('.draggable-part');

                if (targetItem) {
                    const rect = targetItem.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        const targetX = rect.left + rect.width / 2;
                        const boxWidthHalf = isSmallScreen ? 140 : 170;
                        const minBoxX = boxWidthHalf + 10;
                        const maxBoxX = window.innerWidth - boxWidthHalf - 10;
                        let boxX = Math.max(minBoxX, Math.min(maxBoxX, targetX));
                        let arrowShift = targetX - boxX;

                        // Check if there is enough space above the element. If not, flip it below!
                        const estimatedCardHeight = 150;
                        const needsVerticalFlip = isSmallScreen && (rect.top - estimatedCardHeight < 60);

                        setCoords({
                            top: needsVerticalFlip ? rect.bottom + 12 : rect.top - 12,
                            left: boxX,
                            arrowOffset: arrowShift,
                            mode: "standard",
                            flipVertical: needsVerticalFlip
                        });
                        return;
                    }
                }

                setCoords({
                    top: window.innerHeight - 180,
                    left: window.innerWidth / 2,
                    arrowOffset: 0,
                    mode: "standard",
                    flipVertical: false
                });
            } else if (currentStep === 2) {
                const targetItem = 
                    document.querySelector('[data-mesh-name*="brake"]') ||
                    document.querySelector('[data-part-id="brake-fl"]') ||
                    document.querySelector('.vehicle-part-brake-fl');

                if (targetItem) {
                    const rect = targetItem.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        const targetX = rect.left + rect.width / 2;
                        const boxWidthHalf = 170;
                        const minBoxX = boxWidthHalf + 20;
                        const maxBoxX = window.innerWidth - boxWidthHalf - 20;
                        let boxX = Math.max(minBoxX, Math.min(maxBoxX, targetX));
                        let arrowShift = targetX - boxX;

                        setCoords({
                            top: rect.top - 15,
                            left: boxX,
                            arrowOffset: arrowShift,
                            mode: "standard",
                            flipVertical: false
                        });
                        return;
                    }
                }

                setCoords({
                    top: isSmallScreen ? window.innerHeight * 0.28 : window.innerHeight * 0.35,
                    left: window.innerWidth * 0.5,
                    arrowOffset: 0,
                    mode: isSmallScreen ? "mobile-down" : "standard",
                    flipVertical: false
                });
            } else if (currentStep >= 3) {
                setCoords({
                    top: Math.max(80, window.innerHeight * 0.25),
                    left: window.innerWidth * 0.5,
                    arrowOffset: 0,
                    mode: isSmallScreen ? "fixed-upper" : "standard",
                    flipVertical: false
                });
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        const timer = setInterval(updatePosition, 50);

        return () => {
            window.removeEventListener("resize", updatePosition);
            clearInterval(timer);
        };
    }, [currentStep]);

    if (!stepData || !stepData.visible) return null;

    const isMobileDown = coords.mode === "mobile-down";
    const isFixedUpper = coords.mode === "fixed-upper";
    const isFinalStep = currentStep >= 3;
    const flipVertical = coords.flipVertical;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: "fixed",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 3500
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                        transform: isMobileDown || isFinalStep || isFixedUpper
                            ? "translate(-50%, 0%)" 
                            : flipVertical
                                ? "translate(-50%, 0%)"
                                : "translate(-50%, -100%)",
                        pointerEvents: "auto",
                        display: "flex",
                        flexDirection: flipVertical ? "column-reverse" : "column",
                        alignItems: "center",
                        transition: "top 0.05s linear, left 0.05s linear"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#0b0b0b",
                            border: "2px solid #0047AB",
                            borderRadius: "10px",
                            padding: "clamp(8px, 2vw, 14px) clamp(12px, 2.5vw, 20px)",
                            boxShadow: "0 0 25px rgba(0, 71, 171, 0.5)",
                            fontFamily: "'Rajdhani', sans-serif",
                            color: "#fff",
                            textAlign: "center",
                            maxWidth: "300px",
                            width: "calc(100vw - 30px)",
                            boxSizing: "border-box"
                        }}
                    >
                        {stepData.title && (
                            <div style={{ 
                                fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)", 
                                textTransform: "uppercase", 
                                letterSpacing: "1px", 
                                color: "#0047AB", 
                                fontWeight: "700", 
                                marginBottom: "3px" 
                            }}>
                                {stepData.title}
                            </div>
                        )}

                        <p style={{ fontSize: "clamp(0.75rem, 2vw, 0.9rem)", lineHeight: "1.3", margin: 0, fontWeight: "600" }}>
                            {stepData.message}
                        </p>

                        {stepData.showDoneButton && (
                            <button
                                onClick={stepData.onDone}
                                style={{
                                    marginTop: "8px",
                                    backgroundColor: "#0047AB",
                                    color: "#fff",
                                    border: "none",
                                    padding: "5px 14px",
                                    borderRadius: "5px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    boxShadow: "0 2px 8px rgba(0, 71, 171, 0.4)"
                                }}
                            >
                                Done
                            </button>
                        )}

                        {stepData.showCompletionOptions && (
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "10px" }}>
                                <button
                                    onClick={stepData.onRedo}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#fff",
                                        border: "1px solid #0047AB",
                                        padding: "4px 10px",
                                        borderRadius: "5px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "0.8rem"
                                    }}
                                >
                                    Redo
                                </button>
                                <button
                                    onClick={stepData.onExit}
                                    style={{
                                        backgroundColor: "#0047AB",
                                        color: "#fff",
                                        border: "none",
                                        padding: "4px 10px",
                                        borderRadius: "5px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "0.8rem"
                                    }}
                                >
                                    Exit
                                </button>
                            </div>
                        )}
                    </div>

                    {!isFinalStep && (
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: "10px solid transparent",
                                borderRight: "10px solid transparent",
                                [flipVertical ? "borderBottom" : "borderTop"]: "12px solid #0047AB",
                                [flipVertical ? "marginBottom" : "marginTop"]: "-1px",
                                transform: `translateX(${coords.arrowOffset}px)`,
                                transition: "transform 0.05s linear"
                            }}
                        />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}