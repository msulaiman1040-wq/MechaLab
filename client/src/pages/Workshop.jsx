import FloatingHiddenParts from "../components/FloatingHiddenParts";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

import BuildManager from "../managers/BuildManager";
import InstallManager from "../managers/InstallManager";
import HighlightManager from "../managers/HighlightManager";
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
import WorkshopGreeting from "../components/WorkshopGreeting";
import TutorialManager from "../components/TutorialManager";
import AssemblyTutorialWelcome from "../components/AssemblyTutorialWelcome";
import TutorialStepOverlay from "../components/TutorialStepOverlay";
import Footer from "../components/Footer";
import logoImg from "../assets/images/mechalab-logo.png";
import "./Workshop.css";

function Workshop() {

    const navigate = useNavigate();
    const { clearAssembly } = useAssemblyValidation();

    const [buildMode, setBuildMode] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isSpotlightActive, setIsSpotlightActive] = useState(false);
    const [isAssemblyTutorialActive, setIsAssemblyTutorialActive] = useState(false);
    const [showWelcomeCard, setShowWelcomeCard] = useState(false);
    const [savedConfigs, setSavedConfigs] = useState([]);

    const [tutorialStep, setTutorialStep] = useState(0);

    const audioRef = useRef(null);

    const { progress } = useProgress();
    const [isMinLoadingElapsed, setIsMinLoadingElapsed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMinLoadingElapsed(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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

    useEffect(() => {
        const checkHighlight = () => {
            const isInstalled = InstallManager.getCount("brake-fl") > 0;
            if (isAssemblyTutorialActive && tutorialStep >= 2 && !isInstalled) {
                HighlightManager.highlight("brake-fl");
            } else {
                HighlightManager.clear();
            }
        };

        checkHighlight();
        const unsubscribe = InstallManager.subscribe(checkHighlight);
        return () => unsubscribe();
    }, [isAssemblyTutorialActive, tutorialStep]);

    useEffect(() => {
        const unsubscribe = InstallManager.subscribe((installedParts) => {
            if (isAssemblyTutorialActive && tutorialStep === 3) {
                if (installedParts["brake-fl"] > 0 || InstallManager.getCount("brake-fl") > 0) {
                    setTutorialStep(4);
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
                    "https://mechalab-backend.onrender.com/api/config/my-configs",
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
                `https://mechalab-backend.onrender.com/api/config/delete/${id}`,
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
        clearAssembly();
        BuildManager.setTutorialMode(false);
        setIsAssemblyTutorialActive(false);
        setShowWelcomeCard(false);

        setBuildMode(true);

        setTimeout(() => {
            InstallManager.loadConfiguration(parts);
            BuildManager.loadConfiguration(parts);
        }, 0);
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
        setShowWelcomeCard(true);
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
        setTutorialStep(1);
    };

    const handleRedoTutorial = () => {
        InstallManager.reset();
        BuildManager.reset();
        BuildManager.setTutorialMode(true);
        clearAssembly();
        setTutorialStep(1);
    };

    const handleChassisDone = () => {
        setTutorialStep(3);
    };

    const getTutorialStepData = () => {
        switch (tutorialStep) {
            case 1:
                return {
                    visible: true,
                    title: "Step 1: Select Part",
                    message: "This is a brake disc and calliper. Double click or double tap this part to bring it out of tray onto the workbench."
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

    return (
        <>
            {!isFullyLoaded && (
                <Loader
                    progress={progress}
                    status={`Loading Workshop: ${Math.floor(progress)}%`}
                />
            )}
            <WorkshopGreeting/>
            
            <AnimatePresence>
                {showWelcomeCard && (
                    <AssemblyTutorialWelcome
                        onContinue={handleWelcomeContinue}
                        onExit={exitAssemblyTutorial}
                    />
                )}
            </AnimatePresence>

            {isAssemblyTutorialActive && !showWelcomeCard && (
                <TutorialStepOverlay 
                    stepData={getTutorialStepData()} 
                    currentStep={tutorialStep} 
                />
            )}

            <div
                className={`workshop ${
                    !isFullyLoaded ? "workshop-hidden" : ""
                } ${
                    isSaveModalOpen ||
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

                {!buildMode && (
                    <div 
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            pointerEvents: "none",
                            overflow: "hidden"
                        }}
                    >
                        <img 
                            src={logoImg} 
                            alt="MechaLab Logo Background"
                            style={{
                                width: "90vw",
                                maxWidth: "1400px",
                                height: "auto",
                                objectFit: "contain",
                                userSelect: "none",
                                opacity: 0.15,
                                filter: "saturate(1) contrast(1)"
                            }}
                        />
                    </div>
                )}

                <Scene buildMode={buildMode} />

                {buildMode && <Workbench />}

                {buildMode && !isAssemblyTutorialActive && <SimulationControls />}
                
                {buildMode && (
                    <FloatingHiddenParts 
                        buildMode={buildMode} 
                        tutorialMode={isAssemblyTutorialActive} 
                    />
                )}

                {isAssemblyTutorialActive && !showWelcomeCard && (
                    <div style={{ position: "absolute", top: "20px", right: "30px", zIndex: 3000 }}>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="tutorial-btn-secondary" 
                            onClick={exitAssemblyTutorial}
                            style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#334155", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: "600", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}
                        >
                            Exit Tutorial
                        </motion.button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!buildMode && (
                        <motion.div
                            key="home-screen"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1000 }}
                        >
                            <div className="homeScreen" style={{ pointerEvents: "auto" }}>
                                <motion.button
                                    className="mainButton"
                                    onClick={startNewBuild}
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 1.1, opacity: 0, y: -20 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ scale: 1.06, boxShadow: "0 10px 25px -5px rgba(0, 71, 171, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🚗 Start Building
                                </motion.button>
                            </div>

                            <motion.div
                                className="secondaryButtons"
                                initial={{ x: -40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -40, opacity: 0 }}
                                transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                                style={{ pointerEvents: "auto" }}
                            >
                                <motion.button
                                    className="secondaryButton"
                                    onClick={() => setIsGalleryOpen(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    📂 Open Configuration
                                </motion.button>
                                <motion.button
                                    className="secondaryButton"
                                    onClick={() => navigate("/mechapedia")}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    📖 Mechapedia
                                </motion.button>
                                
                                <MusicToggle
                                    isPlaying={isMusicPlaying}
                                    onToggle={() =>
                                        setIsMusicPlaying(!isMusicPlaying)
                                    }
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {buildMode && (
                    <motion.div
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: "fixed",
                            bottom: 0,
                            width: "100%",
                            zIndex: 2000
                        }}
                    >
                        <PartTray 
                            onPartDoubleClick={(id) => {
                                if (isAssemblyTutorialActive && tutorialStep === 1 && id === "brake-fl") {
                                    setTutorialStep(2);
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

            <ConfigurationGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                configurations={savedConfigs}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />

            {!buildMode && <Footer />}
        </>
    );
}

export default Workshop;