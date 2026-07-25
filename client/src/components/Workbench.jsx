import { playInstallSound } from "../managers/SoundManager";
import { useWorkshop } from "../Context/WorkshopContext";
import { useEffect, useState, useRef } from "react";
import BuildManager from "../managers/BuildManager";
import InstallManager from "../managers/InstallManager";
import RaycasterManager from "../managers/RaycasterManager";
import ContextMenu from "./ContextMenu";

import engine from "../assets/parts/engine.png";
import body from "../assets/parts/body.png";
import battery from "../assets/parts/battery.png";
import radiator from "../assets/parts/radiator.png";
import fuelTank from "../assets/parts/fuel-tank.png";
import gearBox from "../assets/parts/gear-box.png";
import steeringWheel from "../assets/parts/steering-wheel.png";
import pedals from "../assets/parts/pedals.png";
import frontSeat from "../assets/parts/front-seat.png";
import rearSeat from "../assets/parts/rear-seat.png";
import fender from "../assets/parts/fender.png";
import exhaustPipe from "../assets/parts/exhaust-pipe.png";
import tire from "../assets/parts/tire.png";
import brakeDisc from "../assets/parts/brake-disc-caliper.png";

const images = {
    engine,
    body,
    battery,
    radiator,
    "fuel-tank": fuelTank,
    "gear-box": gearBox,
    "steering-wheel": steeringWheel,
    pedals,
    "front-seat": frontSeat,
    "rear-seat": rearSeat,
    fender,
    "exhaust-pipe": exhaustPipe,
    tire,
    "brake-disc-caliper": brakeDisc
};

export default function Workbench() {
    const workshopContext = useWorkshop() || {};
    const finishInstall = workshopContext.finishInstall || (() => {});

    const [, forceUpdate] = useState(0);
    const [activeDraggedId, setActiveDraggedId] = useState(null);
    const longPressTimerRef = useRef(null);
    const touchStartPos = useRef({ x: 0, y: 0 });
    const isTouchDragging = useRef(false);

    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        partId: null
    });

    useEffect(() => {
        BuildManager.subscribe(() => {
            forceUpdate(n => n + 1);
        });
    }, []);

    // Completely disable native browser context menus app-wide
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };
        window.addEventListener("contextmenu", handleContextMenu);
        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    // --- MOUSE DRAG HANDLERS ---
    const startMouseDrag = (e, id) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        setActiveDraggedId(id);
        BuildManager.startDragging(id);
    };

    const handleMouseMove = (e) => {
        if (!BuildManager.draggingPart) return;

        BuildManager.movePart(
            BuildManager.draggingPart,
            e.clientX - 45,
            e.clientY - 45
        );
    };

    const handleMouseUp = (e) => {
        if (!BuildManager.draggingPart) return;

        const dragged = BuildManager.workbench.find(
            p => p.id === BuildManager.draggingPart
        );

        if (!dragged) {
            setActiveDraggedId(null);
            return;
        }

        const hit = RaycasterManager.cast(
            e.clientX,
            e.clientY,
            dragged.type
        );

if (hit) {

    InstallManager.install(dragged.type);

    BuildManager.installPart(dragged.id);

    playInstallSound(dragged.type);

    finishInstall(dragged.type);

} else {
            BuildManager.stopDragging(dragged.id);
        }

        setActiveDraggedId(null);
    };

    // --- TOUCH HANDLERS ---
    const handleTouchStart = (e, id) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();

        const touch = e.touches[0];
        if (!touch) return;

        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        isTouchDragging.current = false;

        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

        // 500ms long press triggers custom context menu
        longPressTimerRef.current = setTimeout(() => {
            if (!isTouchDragging.current) {
                openMenu(e, id, touch.clientX, touch.clientY);
            }
        }, 500);
    };

    const handleTouchMove = (e) => {
        if (e.cancelable) {
            e.preventDefault();
        }
        e.stopPropagation();

        const touch = e.touches[0];
        if (!touch) return;

        const dx = Math.abs(touch.clientX - touchStartPos.current.x);
        const dy = Math.abs(touch.clientY - touchStartPos.current.y);

        // If moved past threshold, cancel long press and switch to touch drag
        if (dx > 8 || dy > 8) {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
            isTouchDragging.current = true;
        }

        if (isTouchDragging.current && BuildManager.draggingPart) {
            BuildManager.movePart(
                BuildManager.draggingPart,
                touch.clientX - 45,
                touch.clientY - 45
            );
        }
    };

    const handleTouchEnd = (e) => {
        e.stopPropagation();

        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }

        if (isTouchDragging.current && BuildManager.draggingPart) {
            const touch = e.changedTouches[0] || {};
            const dragged = BuildManager.workbench.find(
                p => p.id === BuildManager.draggingPart
            );

            if (dragged) {
                const hit = RaycasterManager.cast(
                    touch.clientX || 0,
                    touch.clientY || 0,
                    dragged.type
                );

                if (hit) {
                    InstallManager.install(dragged.type);
                    BuildManager.installPart(dragged.id);
                    finishInstall(dragged.type);
                } else {
                    BuildManager.stopDragging(dragged.id);
                }
            }
        }

        isTouchDragging.current = false;
        setActiveDraggedId(null);
    };

    useEffect(() => {
        window.addEventListener("pointermove", handleMouseMove);
        window.addEventListener("pointerup", handleMouseUp);

        return () => {
            window.removeEventListener("pointermove", handleMouseMove);
            window.removeEventListener("pointerup", handleMouseUp);
        };
    }, []);

    const openMenu = (e, id, clientX, clientY) => {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();

        setMenu({
            visible: true,
            x: clientX,
            y: clientY,
            partId: id
        });
    };

    const closeMenu = () => {
        setMenu({
            visible: false,
            x: 0,
            y: 0,
            partId: null
        });
    };

    const confirmCancel = () => {
        if (menu.partId) {
            BuildManager.cancelPart(menu.partId);
        }
        closeMenu();
    };

    return (
        <>
            {BuildManager.workbench.map(part => {
                const isThisDragging = activeDraggedId === part.id || part.dragging;

                return (
                    <img
                        key={part.id}
                        src={images[part.type]}
                        draggable={false}
                        onDragStart={e => e.preventDefault()}
                        onContextMenu={e => openMenu(e, part.id, e.clientX, e.clientY)}
                        onPointerDown={(e) => {
                            if (e.pointerType === "mouse") {
                                startMouseDrag(e, part.id);
                            }
                        }}
                        onTouchStart={(e) => {
                            handleTouchStart(e, part.id);
                            setActiveDraggedId(part.id);
                            BuildManager.startDragging(part.id);
                        }}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            position: "fixed",
                            left: part.x,
                            top: part.y,
                            width: "90px",
                            height: "90px",
                            objectFit: "contain",
                            cursor: isThisDragging ? "grabbing" : "grab",
                            zIndex: 99999,
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            WebkitUserDrag: "none",
                            touchAction: "none",
                            WebkitTouchCallout: "none",
                            pointerEvents: isThisDragging ? "none" : "auto",
                            transform: isThisDragging ? "scale(1.15) rotate(3deg)" : "scale(1) rotate(0deg)",
                            filter: isThisDragging 
                                ? "drop-shadow(0 0 20px #0047AB) brightness(1.25)" 
                                : "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
                            transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), filter 0.15s ease"
                        }}
                    />
                );
            })}

            <ContextMenu
                visible={menu.visible}
                x={menu.x}
                y={menu.y}
                onYes={confirmCancel}
                onNo={closeMenu}
            />
        </>
    );
}