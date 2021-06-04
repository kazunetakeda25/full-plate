const PlateComponent = {

    init() {
        const scene = document.querySelector('a-scene');
        this.raycaster = new THREE.Raycaster()
        this.camera = document.getElementById('camera')
        this.threeCamera = this.camera.getObject3D('camera')
        this.ground = document.getElementById('ground')
        this.cursor = document.getElementById('cursor')
        this.rayOrigin = new THREE.Vector2(0, 0)
        this.cursorLocation = new THREE.Vector3(0, 0, 0)

        if (scene.hasLoaded) {
            //this.onLoadComplete()
            console.log("scene has loaded");
        } else {
            scene.addEventListener('loaded', () => {
                //this.onLoadComplete()
                console.log("scene load complete")
            })
        }
    },
    tick() {
        // Raycast from camera to 'ground'
        this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera)
        const intersects = this.raycaster.intersectObject(this.ground.object3D, true)
        if (intersects.length > 0) {
            const [intersect] = intersects
            this.cursorLocation = intersect.point
        }
        this.el.object3D.position.y = 0.1
        this.el.object3D.position.lerp(this.cursorLocation, 0.4)
        this.el.object3D.rotation.y = this.threeCamera.rotation.y
    },
}

export {
    PlateComponent
}
