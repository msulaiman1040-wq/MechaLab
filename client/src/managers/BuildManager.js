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
            "exhaust-pipe": 1,
            
            // Unique Seats
            "left-seat": 1,
            "right-seat": 1,
            "rear-seat": 1,

            // Unique Fenders
            "left-fender": 1,
            "right-fender": 1,

            // Unique Wheels / Tires
            "front-left-wheel": 1,
            "front-right-wheel": 1,
            "rear-right-wheel": 1,
            "rear-left-wheel": 1,

            // Unique Brakes & Calipers
            "brake-fl": 1,
            "brake-fr": 1,
            "brake-rr": 1,
            "brake-rl": 1
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
                "exhaust-pipe": 0,
                "left-seat": 0,
                "right-seat": 0,
                "rear-seat": 0,
                "left-fender": 0,
                "right-fender": 0,
                "front-left-wheel": 0,
                "front-right-wheel": 0,
                "rear-left-wheel": 0,
                "rear-right-wheel": 0,
                "brake-fl": 1,
                "brake-fr": 0,
                "brake-rl": 0,
                "brake-rr": 0
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

        Object.entries(savedParts).forEach(([type, count]) => {
            if (!this.inventory.hasOwnProperty(type))
                return;

            this.inventory[type] = Math.max(
                0,
                this.initialInventory[type] - count
            );

            for (let i = 0; i < count; i++) {
                this.installed.push({
                    id: crypto.randomUUID(),
                    type,
                    installed: true
                });
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