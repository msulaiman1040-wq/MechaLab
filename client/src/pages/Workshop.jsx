import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

import BuildManager from "../managers/BuildManager";
import InstallManager from "../managers/InstallManager";
import { useAssemblyValidation } from "../Context/AssemblyValidationContext";

import MusicToggle from "../components/MusicToggle";
import SimulationControls from "../components/SimulationControls";
import UninstallPanel from "../components/UninstallPanel";
import Loader from "../components/Loader";
import Scene from "../three/Scene";
import Header from "../components/Header/Header";
import PartTray from "../components/PartTray";
import Workbench from "../components/Workbench";
import SaveModal from "../components/SaveModal";
import ConfigurationGallery from "../components/ConfigurationGallery";
import SettingsMenu from "../components/SettingsMenu";
import WorkshopGreeting from "../components/WorkshopGreeting";
import TutorialManager from "../components/TutorialManager";
import AssemblyTutorialWelcome from "../components/AssemblyTutorialWelcome";
import TutorialStepOverlay from "../components/TutorialStepOverlay";
import "./Workshop.css";

function Workshop() {

    const navigate = useNavigate();
    const { clearAssembly } = useAssemblyValidation();

    const [buildMode, setBuildMode] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isSpotlightActive, setIsSpotlightActive] = useState(false);
    const [isAssemblyTutorialActive, setIsAssemblyTutorialActive] = useState(false);
    const [showWelcomeCard, setShowWelcomeCard] = useState(false);
    const [savedConfigs, setSavedConfigs] = useState([]);

    // Tutorial Flow State (0: Welcome, 1: Tray, 2: Chassis, 3: Workbench Drag, 4: Complete)
    const [tutorialStep, setTutorialStep] = useState(0);

    const audioRef = useRef(null);

    // Track 3D model loading progress from Drei
    const { progress } = useProgress();
    const [isMinLoadingElapsed, setIsMinLoadingElapsed] = useState(false);

    // Artificial minimum timer so the user actually gets to see and experience the loader smoothly
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMinLoadingElapsed(true);
        }, 1500); // 1.5 seconds minimum load screen presentation
        return () => clearTimeout(timer);
    }, []);

    // Fully loaded only when 3D assets hit 100% AND the minimum display timer finishes
    const isFullyLoaded = progress === 100 && isMinLoadingElapsed;

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio("/sounds/Kokoro.mp3");
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
        }

        if (buildMode || !isMusicPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [buildMode, isMusicPlaying]);

    // Keep highlight active from Step 2 onwards until the part is installed
    useEffect(() => {
        const checkHighlight = () => {
            const isInstalled = InstallManager.getCount("brake-disc-caliper") > 0;
            if (isAssemblyTutorialActive && tutorialStep >= 2 && !isInstalled) {
                BuildManager.setTutorialHighlight("brake-disc-caliper", true);
            } else {
                BuildManager.setTutorialHighlight("brake-disc-caliper", false);
            }
        };

        checkHighlight();
        const unsubscribe = InstallManager.subscribe(checkHighlight);
        return () => unsubscribe();
    }, [isAssemblyTutorialActive, tutorialStep]);

    // Listen for part installations to automatically progress from Step 3 -> Step 4
    useEffect(() => {
        const unsubscribe = InstallManager.subscribe((installedParts) => {
            if (isAssemblyTutorialActive && tutorialStep === 3) {
                if (installedParts["brake-disc-caliper"] > 0) {
                    setTutorialStep(4); // Triggers Tutorial Complete overlay!
                }
            }
        });
        return unsubscribe;
    }, [isAssemblyTutorialActive, tutorialStep]);

    useEffect(() => {
        if (!isGalleryOpen) return;

        const fetchConfigs = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/config/my-configs",
                    {
                        headers: {
                            "x-auth-token": localStorage.getItem("token")
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setSavedConfigs(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchConfigs();
    }, [isGalleryOpen]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/config/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "x-auth-token": localStorage.getItem("token")
                    }
                }
            );
            if (response.ok) {
                setSavedConfigs(prev => prev.filter(c => c._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLoad = (parts) => {
        setIsGalleryOpen(false);
        InstallManager.loadConfiguration(parts);
        BuildManager.loadConfiguration(parts);
        clearAssembly();
        BuildManager.setTutorialMode(false);
        setIsAssemblyTutorialActive(false);
        setShowWelcomeCard(false);
        setBuildMode(true);
    };

    const startNewBuild = () => {
        InstallManager.reset();
        BuildManager.reset();
        BuildManager.setTutorialMode(false);
        setIsAssemblyTutorialActive(false);
        setShowWelcomeCard(false);
        clearAssembly();
        setBuildMode(true);
    };

    const startAssemblyTutorial = () => {
        InstallManager.reset();
        BuildManager.reset();
        BuildManager.setTutorialMode(true);
        clearAssembly();
        setIsAssemblyTutorialActive(true);
        setBuildMode(true);
        setIsTutorialOpen(false);
        setShowWelcomeCard(true); // Triggers the welcome modal overlay
        setTutorialStep(0);
    };

    const exitAssemblyTutorial = () => {
        setShowWelcomeCard(false);
        setIsAssemblyTutorialActive(false);
        BuildManager.setTutorialMode(false);
        InstallManager.reset();
        BuildManager.reset();
        clearAssembly();
        setBuildMode(true); 
        setIsTutorialOpen(false);
        setTutorialStep(0);
    };

    const handleWelcomeContinue = () => {
        setShowWelcomeCard(false);
        setTutorialStep(1); // Move to tray instruction step
    };

    const handleRedoTutorial = () => {
        InstallManager.reset();
        BuildManager.reset();
        BuildManager.setTutorialMode(true); // Ensure tray stays filtered to tutorial items
        clearAssembly();
        setTutorialStep(1); // Restart sequence from step 1
    };

    const handleChassisDone = () => {
        setTutorialStep(3); // Move to drag-and-drop workbench instruction
    };

    const getTutorialStepData = () => {
        switch (tutorialStep) {
            case 1:
                return {
                    visible: true,
                    title: "Step 1: Select Part",
                    message: "This is brake disc and calliper. Double click or double tap this part to bring it out of tray onto the workbench."
                };
            case 2:
                return {
                    visible: true,
                    title: "Step 2: Inspect Chassis",
                    message: "This is a vehicle chassis. Rotate until you can clearly see the highlighted area of the chassis.",
                    showDoneButton: true,
                    onDone: handleChassisDone
                };
            case 3:
                return {
                    visible: true,
                    title: "Step 3: Assembly",
                    message: "Click or tap and drag the part to the highlighted area on the chassis."
                };
            case 4:
                return {
                    visible: true,
                    title: "Complete",
                    message: "Tutorial Complete!",
                    showCompletionOptions: true,
                    onRedo: handleRedoTutorial,
                    onExit: exitAssemblyTutorial
                };
            default:
                return { visible: false };
        }
    };

    // Show Loader component while 3D environment assets are compiling/loading
    if (!isFullyLoaded) {
        return <Loader text={`Loading Workshop: ${Math.floor(progress)}%`} />;
    }

    return (
        <>
            <WorkshopGreeting/>
            
            {/* Assembly Tutorial Welcome Overlay Card */}
            <AnimatePresence>
                {showWelcomeCard && (
                    <AssemblyTutorialWelcome
                        onContinue={handleWelcomeContinue}
                        onExit={exitAssemblyTutorial}
                    />
                )}
            </AnimatePresence>

            {/* Step-by-Step Interactive Tutorial Overlay */}
            {isAssemblyTutorialActive && !showWelcomeCard && (
                <TutorialStepOverlay 
                    stepData={getTutorialStepData()} 
                    currentStep={tutorialStep} 
                />
            )}

            <div
                className={`workshop ${
                    isSaveModalOpen ||
                    isSettingsOpen ||
                    isGalleryOpen ||
                    (isTutorialOpen && !isSpotlightActive) ||
                    showWelcomeCard
                        ? "workshop-disabled"
                        : ""
                }`}
            >
                {!isAssemblyTutorialActive && (
                    <Header
                        buildMode={buildMode}
                        onSave={() => setIsSaveModalOpen(true)}
                        onSettings={() => setIsSettingsOpen(true)}
                        onTutorial={() => setIsTutorialOpen(true)}
                        onStop={() => {
                            setBuildMode(false);
                            InstallManager.reset();
                            BuildManager.reset();
                            BuildManager.setTutorialMode(false);
                            clearAssembly();
                        }}
                    />
                )}

                {buildMode && !isAssemblyTutorialActive && <UninstallPanel />}

                <Scene buildMode={buildMode} />

                {buildMode && <Workbench />}

                {buildMode && !isAssemblyTutorialActive && <SimulationControls />}

                {/* Exit Tutorial Button */}
                {isAssemblyTutorialActive && !showWelcomeCard && (
                    <div style={{ position: "absolute", top: "20px", right: "30px", zIndex: 3000 }}>
                        <button 
                            className="tutorial-btn-secondary" 
                            onClick={exitAssemblyTutorial}
                            style={{ backgroundColor: "#0b0b0b", border: "1px solid #0047AB", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: "600" }}
                        >
                            Exit Tutorial
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {!buildMode && (
                        <>
                            <motion.div
                                className="homeScreen"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.button
                                    className="mainButton"
                                    onClick={startNewBuild}
                                >
                                    🚗 Start Building
                                </motion.button>
                            </motion.div>

                            <motion.div
                                className="secondaryButtons"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: .3 }}
                            >
                                <button
                                    className="secondaryButton"
                                    onClick={() => setIsGalleryOpen(true)}
                                >
                                    📂 Open Configuration
                                </button>
                                <button
                                    className="secondaryButton"
                                    onClick={() => navigate("/mechapedia")}
                                >
                                    📖 Mechapedia
                                </button>
                                
                                <MusicToggle
                                    isPlaying={isMusicPlaying}
                                    onToggle={() =>
                                        setIsMusicPlaying(!isMusicPlaying)
                                    }
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                
            </div>

            <AnimatePresence>
                {buildMode && (
                    <motion.div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            width: "100%",
                            zIndex: 2000
                        }}
                    >
                        <PartTray 
                            onPartDoubleClick={(id) => {
                                if (isAssemblyTutorialActive && tutorialStep === 1 && id === "brake-disc-caliper") {
                                    setTutorialStep(2); // Progress to chassis step
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {isTutorialOpen && (
                <TutorialManager 
                    onClose={() => {
                        setIsTutorialOpen(false);
                        setIsSpotlightActive(false);
                    }} 
                    onViewChange={(view) => {
                        setIsSpotlightActive(view === "buttons");
                    }}
                    onStartAssemblyTutorial={startAssemblyTutorial}
                />
            )}

            <SaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
            />

            <SettingsMenu
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            <ConfigurationGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                configurations={savedConfigs}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />
        </>
    );
}

export default Workshop;