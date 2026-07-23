//InstallManager.js
class InstallManager {
    constructor() {
        this.initialState = {
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
            "brake-disc-caliper": 0
        };

        this.installed = { ...this.initialState };
        this.listeners = [];
        this.resetListeners = []; 
    }

    // NEW: Load a saved state
    loadConfiguration(parts) {
        this.reset(); // Clear current 3D scene first
        this.installed = { ...this.initialState, ...parts };
        this.notify();
    }

    reset() {
        this.installed = { ...this.initialState };
        this.resetListeners.forEach(cb => cb());
        this.notify();
    }

subscribe(cb) {
    this.listeners.push(cb);

    return () => {
        this.listeners = this.listeners.filter(l => l !== cb);
    };
}
    onReset(cb) {
        this.resetListeners.push(cb);
    }

notify() {
    console.log("NOTIFY CHANGE", this.installed);

    this.listeners.forEach(cb => cb(this.installed));
}
    install(part) {
        if (this.installed[part] === undefined) return;
        this.installed[part]++;
        this.notify();
    }

    uninstall(part) {
        if (this.installed[part] === undefined) return;
        if (this.installed[part] > 0) this.installed[part]--;
        this.notify();
    }

    getCount(part) {
        return this.installed[part] || 0;
    }

    isInstalled(part) {
        return this.getCount(part) > 0;
    }
}

export default new InstallManager();