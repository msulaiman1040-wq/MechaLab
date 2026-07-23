import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorialStepOverlay({ stepData, currentStep }) {
    const [coords, setCoords] = useState({ top: window.innerHeight - 200, left: window.innerWidth / 2, arrowOffset: 0, mode: "standard" });

    useEffect(() => {
        const updatePosition = () => {
            const isSmallScreen = window.innerWidth < 768;

            if (currentStep === 1) {
                const targetItem = 
                    document.querySelector('[data-part-id="brake-disc-caliper"]') ||
                    document.querySelector('.workbench-part') ||
                    document.querySelector('.draggable-part') ||
                    document.querySelector('.item-brake-disc-caliper');

                if (targetItem) {
                    const rect = targetItem.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        if (isSmallScreen) {
                            // Step 1 on mobile: Position card slightly higher up so the bottom border doesn't get clipped
                            setCoords({
                                top: Math.min(rect.top + rect.height / 2, window.innerHeight - 150),
                                left: rect.right + 15,
                                arrowOffset: 0,
                                mode: "mobile-side-left"
                            });
                            return;
                        }

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
                            mode: "standard"
                        });
                        return;
                    }
                }

                setCoords({
                    top: window.innerHeight * 0.55,
                    left: isSmallScreen ? window.innerWidth / 2 : 200,
                    arrowOffset: 0,
                    mode: isSmallScreen ? "fixed-upper" : "standard"
                });
            } else if (currentStep === 2) {
                // Step 2 on mobile: Card sits above chassis, arrow points DOWN towards the chassis
                setCoords({
                    top: isSmallScreen ? window.innerHeight * 0.28 : window.innerHeight * 0.35,
                    left: window.innerWidth * 0.5,
                    arrowOffset: 0,
                    mode: isSmallScreen ? "mobile-down" : "standard"
                });
            } else if (currentStep >= 3) {
                setCoords({
                    top: window.innerHeight * 0.2,
                    left: window.innerWidth * 0.5,
                    arrowOffset: 0,
                    mode: isSmallScreen ? "fixed-upper" : "standard"
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

    const isMobileSideLeft = coords.mode === "mobile-side-left";
    const isMobileDown = coords.mode === "mobile-down";
    const isFixedUpper = coords.mode === "fixed-upper";

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
                        transform: isMobileSideLeft 
                            ? "translate(0, -50%)" 
                            : isMobileDown
                                ? "translate(-50%, 0%)" 
                                : isFixedUpper 
                                    ? "translate(-50%, 0%)" 
                                    : "translate(-50%, -100%)",
                        pointerEvents: "auto",
                        display: "flex",
                        flexDirection: isMobileSideLeft 
                            ? "row-reverse" 
                            : isMobileDown
                                ? "column" // Flows downward so arrow sits under the card pointing down
                                : "column",
                        alignItems: "center",
                        transition: "top 0.05s linear, left 0.05s linear"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#0b0b0b",
                            border: "2px solid #0047AB",
                            borderRadius: "10px",
                            padding: "16px 24px",
                            boxShadow: "0 0 25px rgba(0, 71, 171, 0.5)",
                            fontFamily: "'Rajdhani', sans-serif",
                            color: "#fff",
                            textAlign: "center",
                            maxWidth: isMobileSideLeft ? "220px" : "340px",
                            width: "calc(100vw - 60px)",
                            boxSizing: "border-box"
                        }}
                    >
                        {stepData.title && (
                            <div style={{ 
                                fontSize: "0.85rem", 
                                textTransform: "uppercase", 
                                letterSpacing: "1px", 
                                color: "#0047AB", 
                                fontWeight: "700", 
                                marginBottom: "6px" 
                            }}>
                                {stepData.title}
                            </div>
                        )}

                        <p style={{ fontSize: "1.05rem", lineHeight: "1.4", margin: 0, fontWeight: "600" }}>
                            {stepData.message}
                        </p>

                        {stepData.showDoneButton && (
                            <button
                                onClick={stepData.onDone}
                                style={{
                                    marginTop: "12px",
                                    backgroundColor: "#0047AB",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 20px",
                                    borderRadius: "5px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                    boxShadow: "0 2px 8px rgba(0, 71, 171, 0.4)"
                                }}
                            >
                                Done
                            </button>
                        )}

                        {stepData.showCompletionOptions && (
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "14px" }}>
                                <button
                                    onClick={stepData.onRedo}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#fff",
                                        border: "1px solid #0047AB",
                                        padding: "6px 14px",
                                        borderRadius: "5px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "0.85rem"
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
                                        padding: "6px 14px",
                                        borderRadius: "5px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        fontSize: "0.85rem"
                                    }}
                                >
                                    Exit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Arrow for Step 1 (points left towards the tray item) */}
                    {isMobileSideLeft && (
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderTop: "10px solid transparent",
                                borderBottom: "10px solid transparent",
                                borderRight: "12px solid #0047AB",
                                marginRight: "-1px"
                            }}
                        />
                    )}

                    {/* Arrow for Step 2 on mobile (placed underneath card, pointing DOWN towards the chassis) */}
                    {isMobileDown && (
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: "10px solid transparent",
                                borderRight: "10px solid transparent",
                                borderTop: "12px solid #0047AB",
                                marginTop: "-1px"
                            }}
                        />
                    )}

                    {/* Standard top arrow for desktop mode */}
                    {!isFixedUpper && !isMobileSideLeft && !isMobileDown && (
                        <div
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: "10px solid transparent",
                                borderRight: "10px solid transparent",
                                borderTop: "12px solid #0047AB",
                                marginTop: "-1px",
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