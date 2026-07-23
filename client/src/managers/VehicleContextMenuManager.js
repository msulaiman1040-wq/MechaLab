class VehicleContextMenuManager {

    constructor() {

        this.visible = false;

        this.x = 0;
        this.y = 0;

        this.mesh = null;

        this.listeners = [];

    }

    subscribe(cb) {

        this.listeners.push(cb);

    }

    notify() {

        this.listeners.forEach(cb => cb());

    }

    open(mesh, x, y) {

        this.visible = true;

        this.mesh = mesh;

        this.x = x;

        this.y = y;

        this.notify();

    }

    close() {

        this.visible = false;

        this.mesh = null;

        this.notify();

    }

}

export default new VehicleContextMenuManager();