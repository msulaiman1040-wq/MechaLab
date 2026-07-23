import * as THREE from "three";

class RaycasterManager {

    constructor() {

        this.camera = null;
        this.scene = null;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

    }

    setCamera(camera) {

        this.camera = camera;

    }

    setScene(scene) {

        this.scene = scene;

    }

    cast(clientX, clientY, wantedPart = null) {

        if (!this.camera || !this.scene)
            return null;

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(
            this.mouse,
            this.camera
        );

        const hits = this.raycaster.intersectObjects(
            this.scene.children,
            true
        );

        if (!hits.length)
            return null;

        // If no filtering requested
        if (!wantedPart)
            return hits[0].object;

        // ONLY return the correct part type
        for (const hit of hits) {

            if (
                hit.object.userData &&
                hit.object.userData.partId === wantedPart
            ) {

                return hit.object;

            }

        }

        return null;

    }

}

export default new RaycasterManager();