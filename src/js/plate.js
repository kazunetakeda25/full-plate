const PlateComponent = {

    init() {
        const scene = document.querySelector('a-scene');
        this.raycaster = new THREE.Raycaster();
        this.camera = document.getElementById('camera');
        this.threeCamera = this.camera.getObject3D('camera');
        this.ground = document.getElementById('ground');
        this.cursor = document.getElementById('cursor');
        this.rayOrigin = new THREE.Vector2(0, 0);
        this.cursorLocation = new THREE.Vector3(0, 0, 0);
        this.menuItems = document.getElementsByClassName("menu-item");
        for (let i = 0; i < this.menuItems.length; i++) {
            const menuItem = this.menuItems[i];
            const menuId = menuItem.getAttribute('menu-id');
            menuItem.addEventListener('click', () => {
                this.placeMeal(menuId);
            });
        }

        if (scene.hasLoaded) {
            //this.onLoadComplete()
            console.log("scene has loaded");
        } else {
            scene.addEventListener('loaded', () => {
                //this.onLoadComplete()
                console.log("scene load complete");
            })
        }
    },

    tick() {
        this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera);
        const intersects = this.raycaster.intersectObject(this.ground.object3D, true);
        if (intersects.length > 0) {
            const [intersect] = intersects;
            this.cursorLocation = intersect.point;
        }
        this.el.object3D.position.y = 0.1;
        this.el.object3D.position.lerp(this.cursorLocation, 0.4);
        this.el.object3D.rotation.y = this.threeCamera.rotation.y;
    },

    placeMeal(id) {

        this.cursor.setAttribute('visible', true);
        this.cursor.setAttribute('src', '#reticleLoading');

        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('open');
        sidebar.classList.add('close');

        const plateSpawned = document.getElementById('plateSpawned')
        if (plateSpawned != undefined) {
            plateSpawned.remove();
        }

        const newMeal = document.createElement('a-entity');
        newMeal.setAttribute('id', 'plateSpawned');
        newMeal.setAttribute('position', this.el.object3D.position);
        newMeal.setAttribute('rotation', this.el.object3D.rotation);
        newMeal.setAttribute('scale', '0.25 0.25 0.25');
        newMeal.setAttribute('xrextras-hold-drag', '');
        newMeal.setAttribute('xrextras-two-finger-rotate', '');
        newMeal.classList.add('cantap');
        newMeal.setAttribute('gltf-model', '../resources/models/' + id + '.glb');
        newMeal.setAttribute('shadow', {
            receive: false
        });
        newMeal.setAttribute('visible', false);
        this.el.sceneEl.appendChild(newMeal);
        newMeal.addEventListener('model-loaded', () => {
            newMeal.setAttribute('animation-mixer', {
                loop: 'repeat',
                crossFadeDuration: 0.4,
                clampWhenFinished: true
            });
            newMeal.setAttribute('visible', true);
            this.cursor.setAttribute('visible', false);
            this.cursor.setAttribute('src', '#reticle');
        });
    }
}

window.closeMenu = (e) => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open');
    sidebar.classList.add('close');
}

window.toggleMenu = (e) => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.add('close');
        sidebar.classList.remove('open');
    } else {
        sidebar.classList.remove('close');
        sidebar.classList.add('open');
    }
}

export {
    PlateComponent
}
