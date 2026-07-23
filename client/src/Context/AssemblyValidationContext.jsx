import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import InstallManager from "../managers/InstallManager";

import {
  ASSEMBLY_SEQUENCE,
  validatePartPlacement
} from "../utils/assemblyRules";

const AssemblyValidationContext = createContext();

export function AssemblyValidationProvider({ children }) {

  const [installedParts, setInstalledParts] = useState({});
  const [mistakesLog, setMistakesLog] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ==========================================
  // Convert InstallManager data
  // ==========================================

  const rebuildInstalledParts = (installedObject) => {

    if (!installedObject) return {};

    return { ...installedObject };

  };

  // ==========================================
  // Build Diagnostic Log
  // ==========================================

  const rebuildMistakesLog = (parts) => {

    const newLog = [];

    Object.entries(parts).forEach(([partId, count]) => {

      if (count <= 0) return;

      const validation = validatePartPlacement(
        partId,
        parts
      );

      if (!validation.valid) {

        const targetPart = ASSEMBLY_SEQUENCE.find(
          p => p.id === partId
        );

        newLog.push({

          partId,

          count,

          partName: targetPart
            ? targetPart.name
            : partId,

          explanation: validation.explanation,

          timestamp: new Date().toLocaleTimeString()

        });

      }

    });

    setMistakesLog(newLog);

  };

  // ==========================================
  // Listen to InstallManager
  // ==========================================

  useEffect(() => {

    const update = (installedObject) => {

      console.log("Assembly Update:", installedObject);

      const parts = rebuildInstalledParts(installedObject);

      setInstalledParts(parts);

      rebuildMistakesLog(parts);

    };

    const unsubscribe = InstallManager.subscribe(update);

    update(InstallManager.installed);

    return () => {

      if (unsubscribe) unsubscribe();

    };

  }, []);

  // ==========================================

  const isInstalled = (partId) => {

    return (installedParts[partId] || 0) > 0;

  };

  const clearAssembly = () => {

    setInstalledParts({});

    setMistakesLog([]);

    setIsDrawerOpen(false);

  };

  return (

    <AssemblyValidationContext.Provider

      value={{

        installedParts,

        mistakesLog,

        isDrawerOpen,

        setIsDrawerOpen,

        isInstalled,

        clearAssembly

      }}

    >

      {children}

    </AssemblyValidationContext.Provider>

  );

}

export function useAssemblyValidation() {

  const context = useContext(AssemblyValidationContext);

  if (!context) {

    throw new Error(
      "useAssemblyValidation must be used within an AssemblyValidationProvider"
    );

  }

  return context;

}