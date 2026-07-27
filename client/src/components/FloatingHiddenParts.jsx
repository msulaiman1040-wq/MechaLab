import { useState, useEffect, useRef } from "react";
import InstallManager from "../managers/InstallManager";
import HighlightManager from "../managers/HighlightManager";

// Eye Icon Component
function EyeIcon({ isOpen }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </>
            ) : (
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </>
            )}
        </svg>
    );
}

// Static list of all assembly parts with individual unique IDs
const ALL_PARTS = [
    { id: "engine", name: "Engine" },
    { id: "battery", name: "Battery" },
    { id: "body", name: "Body Kit" },
    { id: "radiator", name: "Radiator" },
    { id: "fuel-tank", name: "Fuel Tank" },
    { id: "gear-box", name: "Gear Box" },
    { id: "steering-wheel", name: "Steering Wheel" },
    { id: "pedals", name: "Pedals" },
    { id: "exhaust-pipe", name: "Exhaust Pipe" },
    
    // Unique Seats
    { id: "left-seat", name: "Left Seat" },
    { id: "right-seat", name: "Right Seat" },
    { id: "rear-seat", name: "Rear Seat" },

    // Unique Fenders
    { id: "left-fender", name: "Left Fender" },
    { id: "right-fender", name: "Right Fender" },

    // Unique Wheels / Tires
    { id: "front-left-wheel", name: "Front Left Tire" },
    { id: "front-right-wheel", name: "Front Right Tire" },
    { id: "rear-right-wheel", name: "Rear Right Tire" },
    { id: "rear-left-wheel", name: "Rear Left Tire" },

    // Unique Brakes & Calipers
    { id: "brake-fl", name: "Front Left Brake & Caliper" },
    { id: "brake-fr", name: "Front Right Brake & Caliper" },
    { id: "brake-rl", name: "Rear Left Brake & Caliper" },
    { id: "brake-rr", name: "Rear Right Brake & Caliper" }
];

export default function FloatingHiddenParts({ buildMode, tutorialMode = false }) {
    if (!buildMode || tutorialMode) return null;

    const [isOpen, setIsOpen] = useState(false);
    const [uninstalledParts, setUninstalledParts] = useState([]);
    const [highlightedPartId, setHighlightedPartId] = useState(null);

    // Adaptive initial position: safe on mobile and desktop viewports
    const [position, setPosition] = useState(() => ({
        x: Math.max(20, window.innerWidth - 80),
        y: 130
    }));

    const isDragging = useRef(false);
    const isPointerDown = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });
    const positionRef = useRef(position);
    positionRef.current = position;

    const containerRef = useRef(null);
    const menuRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ alignRight: false, alignBottom: false });

    // Calculate smart menu placement whenever it opens or position changes
    useEffect(() => {
        if (isOpen) {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            const menuWidth = 230;
            const menuHeight = 300;

            const overflowsRight = position.x + 50 + menuWidth + 12 > screenWidth;
            const overflowsBottom = position.y + menuHeight > screenHeight - 20;

            setMenuPosition({
                alignRight: overflowsRight,
                alignBottom: overflowsBottom
            });
        }
    }, [isOpen, position]);

    const refreshParts = () => {
        const remaining = ALL_PARTS.filter(part => {
            const count = InstallManager.getCount ? InstallManager.getCount(part.id) : 0;
            return count === 0;
        });
        setUninstalledParts(remaining);

        setHighlightedPartId(prev => {
            if (prev && !remaining.some(p => p.id === prev)) {
                HighlightManager.clear();
                return null;
            }
            return prev;
        });
    };

    useEffect(() => {
        refreshParts();
        const unsubscribeInstall = InstallManager.subscribe(() => {
            refreshParts();
        });
        return () => unsubscribeInstall();
    }, []);

    useEffect(() => {
        const unsubscribeHighlight = HighlightManager.subscribe((partId) => {
            setHighlightedPartId(partId);
        });
        return () => unsubscribeHighlight();
    }, []);

    useEffect(() => {
        const onResize = () => {
            setPosition(prev => ({
                x: Math.max(10, Math.min(window.innerWidth - 70, prev.x)),
                y: Math.max(10, Math.min(window.innerHeight - 70, prev.y))
            }));
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const handleStart = (clientX, clientY) => {
        isDragging.current = false;
        isPointerDown.current = true;
        startPos.current = { x: clientX, y: clientY };
        dragOffset.current = {
            x: clientX - positionRef.current.x,
            y: clientY - positionRef.current.y
        };
    };

    const handleMove = (clientX, clientY) => {
        if (!isPointerDown.current) return;

        const distanceMoved = Math.hypot(clientX - startPos.current.x, clientY - startPos.current.y);
        if (distanceMoved > 5) {
            isDragging.current = true;
        }

        if (!isDragging.current) return;

        const newX = clientX - dragOffset.current.x;
        const newY = clientY - dragOffset.current.y;

        const boundedX = Math.max(10, Math.min(window.innerWidth - 70, newX));
        const boundedY = Math.max(10, Math.min(window.innerHeight - 70, newY));

        setPosition({ x: boundedX, y: boundedY });
    };

    const handleEnd = () => {
        isPointerDown.current = false;
        setTimeout(() => {
            isDragging.current = false;
        }, 50);
    };

    useEffect(() => {
        const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
        const onMouseUp = () => handleEnd();
        const onTouchMove = (e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
        };
        const onTouchEnd = () => handleEnd();

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, []);

    const toggleHighlight = (partId) => {
        if (highlightedPartId === partId) {
            HighlightManager.clear();
        } else {
            HighlightManager.highlight(partId);
        }
    };

    const partCount = uninstalledParts.length;

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9999,
                display: "flex",
                flexDirection: menuPosition.alignRight ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: "12px",
                userSelect: "none",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
        >
            {/* Circular Glassmorphism Draggable Button */}
            <div className="HiddenPart" id="HiddenPart" style={{ position: "relative" }}>
                <div
                    onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
                    onTouchStart={(e) => {
                        if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
                    }}
                    onClick={() => {
                        if (!isDragging.current) {
                            setIsOpen(!isOpen);
                        }
                    }}
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: isOpen ? "rgba(0, 71, 171, 0.45)" : "rgba(20, 20, 20, 0.65)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: isOpen ? "1px solid rgba(80, 150, 255, 0.5)" : "1px solid rgba(255, 255, 255, 0.15)",
                        boxShadow: isOpen
                            ? "0 8px 32px 0 rgba(0, 71, 171, 0.45)"
                            : "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "grab",
                        color: "#ffffff",
                        transition: "background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    title="Click to toggle uninstalled parts menu. Drag to move."
                >
                    <EyeIcon isOpen={isOpen} />
                </div>

                {/* Badge showing count of remaining uninstalled parts */}
                {partCount > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            minWidth: "18px",
                            height: "18px",
                            borderRadius: "9px",
                            background: "#0047AB",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            boxShadow: "0 0 0 2px rgba(0,0,0,0.6)",
                            pointerEvents: "none"
                        }}
                    >
                        {partCount}
                    </div>
                )}
            </div>

            {/* Scrollable Popout Menu with Adaptive Direction */}
            {isOpen && (
                <div
                    ref={menuRef}
                    style={{
                        background: "rgba(12, 12, 12, 0.82)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "14px",
                        padding: "12px",
                        width: "230px",
                        maxHeight: "300px",
                        boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        flexDirection: "column",
                        position: "absolute",
                        left: menuPosition.alignRight ? "auto" : "62px",
                        right: menuPosition.alignRight ? "62px" : "auto",
                        top: menuPosition.alignBottom ? "auto" : "0px",
                        bottom: menuPosition.alignBottom ? "0px" : "auto",
                        animation: "fhp-fade-in 0.15s ease-out"
                    }}
                >
                    <style>{`
                        @keyframes fhp-fade-in {
                            from { opacity: 0; transform: translateY(-4px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            paddingBottom: "8px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)"
                        }}
                    >
                        <span
                            style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.55)",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase"
                            }}
                        >
                            Uninstalled parts ({partCount})
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                                fontSize: "14px",
                                lineHeight: 1,
                                padding: "2px 4px"
                            }}
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div
                        style={{
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            paddingRight: "2px"
                        }}
                    >
                        {partCount === 0 ? (
                            <div
                                style={{
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.7)",
                                    textAlign: "center",
                                    padding: "16px 0"
                                }}
                            >
                                All parts installed! 🎉
                            </div>
                        ) : (
                            uninstalledParts.map((part) => {
                                const isHighlighted = highlightedPartId === part.id;
                                return (
                                    <div
                                        key={part.id}
                                        onClick={() => toggleHighlight(part.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            background: isHighlighted ? "rgba(0, 71, 171, 0.35)" : "rgba(255, 255, 255, 0.04)",
                                            border: isHighlighted ? "1px solid #0047AB" : "1px solid rgba(255, 255, 255, 0.08)",
                                            padding: "8px 10px",
                                            borderRadius: "8px",
                                            color: "#fff",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            transition: "background 0.15s ease, border 0.15s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isHighlighted) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isHighlighted) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                        }}
                                        title={isHighlighted ? "Click to stop highlighting" : "Click to highlight this part"}
                                    >
                                        <span
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {part.name}
                                        </span>
                                        <span
                                            style={{
                                                color: isHighlighted ? "#8fc0ff" : "rgba(255,255,255,0.45)",
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "8px",
                                                flexShrink: 0
                                            }}
                                        >
                                            <EyeIcon isOpen={isHighlighted} />
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}