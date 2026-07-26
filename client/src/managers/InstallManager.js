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
            "exhaust-pipe": 0,
            
            // Unique Seats
            "left-seat": 0,
            "right-seat": 0,
            "rear-seat": 0,

            // Unique Fenders
            "left-fender": 0,
            "right-fender": 0,

            // Unique Wheels / Tires
            "front-left-wheel": 0,
            "front-right-wheel": 0,
            "rear-right-wheel": 0,
            "rear-left-wheel": 0,

            // Unique Brakes & Calipers
            "brake-fl": 0,
            "brake-fr": 0,
            "brake-rr": 0,
            "brake-rl": 0
        };

        this.installed = { ...this.initialState };
        this.listeners = [];
        this.resetListeners = []; 
    }

    // Load a saved state
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