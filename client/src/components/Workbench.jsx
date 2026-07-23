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

    const { finishInstall } = useWorkshop();

    const [, forceUpdate] = useState(0);
    const [activeDraggedId, setActiveDraggedId] = useState(null);
    const longPressTimerRef = useRef(null);

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

    const startDrag = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        setActiveDraggedId(id);
        BuildManager.startDragging(id);
    };

    const move = (e) => {
        if (!BuildManager.draggingPart)
            return;

        BuildManager.movePart(
            BuildManager.draggingPart,
            e.clientX - 45,
            e.clientY - 45
        );
    };

    const stopDrag = (e) => {
        if (!BuildManager.draggingPart)
            return;

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
            finishInstall(dragged.type);
        } else {
            BuildManager.stopDragging(
                dragged.id
            );
        }

        setActiveDraggedId(null);
    };

    useEffect(() => {
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", stopDrag);

        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", stopDrag);
        };
    }, []);

    const openMenu = (e, id, clientX, clientY) => {
        e.preventDefault();
        e.stopPropagation();

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

    // Handlers for mobile long-press detection
    const handleTouchStart = (e, id) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Clear any existing timer
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

        // Set a 500ms threshold for a long-press to trigger the context menu
        longPressTimerRef.current = setTimeout(() => {
            openMenu(e, id, clientX, clientY);
        }, 500);
    };

    const handleTouchMoveOrEnd = () => {
        // Cancel the long-press timer if the user moves or lifts their finger early (so it's a drag or tap instead)
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
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
                        onTouchStart={(e) => handleTouchStart(e, part.id)}
                        onTouchMove={handleTouchMoveOrEnd}
                        onTouchEnd={handleTouchMoveOrEnd}
                        onPointerDown={(e) => {
                            if (e.button !== undefined && e.button !== 0)
                                return;

                            handleTouchStart(e, part.id);
                            startDrag(e, part.id);
                        }}
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