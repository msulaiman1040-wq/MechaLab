class SnapPointManager {

    constructor() {

        this.points = {};

    }

    register(name, object) {

        this.points[name] = object;

    }

    get(name) {

        return this.points[name];

    }

    /*
    ===================================================
    Returns the EXACT mesh that should receive the part.
    ===================================================
    */
    getAvailableMesh(partType) {

        const candidates = [];

        Object.values(this.points).forEach(mesh => {

            if (!mesh) return;

            if (mesh.userData.partId !== partType) return;

            if (mesh.visible) return;

            candidates.push(mesh);

        });

        return candidates[0] || null;

    }

    /*
    ===================================================
    Marks a mesh installed.
    ===================================================
    */
    occupy(mesh) {

        if (!mesh) return;

        mesh.visible = true;

    }

    /*
    ===================================================
    Frees a mesh.
    ===================================================
    */
    release(mesh) {

        if (!mesh) return;

        mesh.visible = false;

    }

}

export default new SnapPointManager();