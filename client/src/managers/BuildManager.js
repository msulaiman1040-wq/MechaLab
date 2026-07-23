class BuildManager {
    constructor() {
        this.initialInventory = {
            engine: 1,
            body: 1,
            battery: 1,
            radiator: 1,
            "fuel-tank": 1,
            "gear-box": 1,
            "steering-wheel": 1,
            pedals: 1,
            "front-seat": 2,
            "rear-seat": 1,
            fender: 2,
            "exhaust-pipe": 1,
            tire: 4,
            "brake-disc-caliper": 4
        };

        this.inventory = { ...this.initialInventory };
        this.workbench = [];
        this.installed = [];
        this.listeners = [];
        this.draggingPart = null;

        // Tutorial highlight tracking
        this.tutorialHighlightPart = null;
        this.highlightListeners = [];
    }

    setTutorialMode(active) {
        if (active) {
            this.inventory = {
                engine: 0,
                body: 0,
                battery: 0,
                radiator: 0,
                "fuel-tank": 0,
                "gear-box": 0,
                "steering-wheel": 0,
                pedals: 0,
                "front-seat": 0,
                "rear-seat": 0,
                fender: 0,
                "exhaust-pipe": 0,
                tire: 0,
                "brake-disc-caliper": 1
            };
        } else {
            this.inventory = { ...this.initialInventory };
        }
        this.workbench = [];
        this.installed = [];
        this.notify();
    }

    setTutorialHighlight(partType, active) {
        this.tutorialHighlightPart = active ? partType : null;
        this.highlightListeners.forEach(cb => cb(this.tutorialHighlightPart));
    }

    subscribeHighlight(callback) {
        this.highlightListeners.push(callback);
        return () => {
            this.highlightListeners = this.highlightListeners.filter(cb => cb !== callback);
        };
    }

    loadConfiguration(savedParts) {
        console.log("1. BuildManager received parts object:", savedParts);
        
        this.reset(); 

        Object.keys(savedParts).forEach(type => {
            const count = savedParts[type];
            for (let i = 0; i < count; i++) {
                if (this.inventory[type] > 0) {
                    this.inventory[type]--;
                    const newPart = {
                        id: Date.now() + Math.random() + i,
                        type: type,
                        x: 0,
                        y: 0,
                        dragging: false
                    };
                    this.installed.push(newPart);
                }
            }
        });

        console.log("4. Final installed state:", this.installed);
        this.notify();
    }

    reset() {
        this.inventory = { ...this.initialInventory };
        this.workbench = [];
        this.installed = [];
        this.draggingPart = null;
        this.setTutorialHighlight(null, false);
        this.notify();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.listeners.forEach(cb => cb());
    }

    takePart(type) {
        if (this.inventory[type] <= 0) return false;
        this.inventory[type]--;
        const id = Date.now() + Math.random();
        this.workbench.push({ id, type, x: 120, y: window.innerHeight - 285, dragging: false });
        this.notify();
        return true;
    }

    startDragging(id) {
        this.draggingPart = id;
        this.workbench = this.workbench.map(part => {
            if (part.id === id) part.dragging = true;
            return part;
        });
        this.notify();
    }

    movePart(id, x, y) {
        this.workbench = this.workbench.map(part => {
            if (part.id === id) { part.x = x; part.y = y; }
            return part;
        });
        this.notify();
    }

    stopDragging(id) {
        this.draggingPart = null;
        this.workbench = this.workbench.map(part => {
            if (part.id === id) part.dragging = false;
            return part;
        });
        this.notify();
    }

    cancelPart(id) {
        const part = this.workbench.find(p => p.id === id);
        if (!part) return;
        this.inventory[part.type]++;
        this.workbench = this.workbench.filter(p => p.id !== id);
        this.notify();
    }

    installPart(idOrType) {
        let part = this.workbench.find(p => p.id === idOrType) || this.workbench.find(p => p.type === idOrType);
        if (!part) return;
        this.installed.push(part);
        this.workbench = this.workbench.filter(p => p.id !== part.id);
        this.draggingPart = null;
        this.notify();
    }

    uninstall(id) {
        const part = this.installed.find(p => p.id === id);
        if (!part) return;
        this.inventory[part.type]++;
        this.installed = this.installed.filter(p => p.id !== id);
        this.workbench = this.workbench.filter(p => p.id !== id);
        this.notify();
    }

    isInstalled(type) {
        return this.installed.some(part => part.type === type);
    }
}

if (!window.globalBuildManager) {
    window.globalBuildManager = new BuildManager();
}
       
export default window.globalBuildManager;