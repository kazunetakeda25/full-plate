(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _plate = require("./plate");

// Copyright (c) 2021 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.
// Register custom A-Frame components in app.js before the scene in body.html has loaded.
AFRAME.registerComponent('plate', _plate.PlateComponent);

},{"./plate":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlateComponent = void 0;
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
      });
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
    const plateSpawned = document.getElementById('plateSpawned');

    if (plateSpawned != undefined) {
      plateSpawned.remove();
    }

    const newMeal = document.createElement('a-entity');
    newMeal.setAttribute('id', 'plateSpawned');
    newMeal.setAttribute('position', this.el.object3D.position);
    newMeal.setAttribute('rotation', this.el.object3D.rotation);

    if (id == 3) {
      newMeal.setAttribute('scale', '0.2 0.2 0.2');
    } else {
      newMeal.setAttribute('scale', '0.3 0.3 0.3');
    }

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

};
exports.PlateComponent = PlateComponent;

window.closeMenu = e => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.remove('open');
  sidebar.classList.add('close');
};

window.toggleMenu = e => {
  const sidebar = document.querySelector('.sidebar');

  if (sidebar.classList.contains('open')) {
    sidebar.classList.add('close');
    sidebar.classList.remove('open');
  } else {
    sidebar.classList.remove('close');
    sidebar.classList.add('open');
  }
};

},{}]},{},[1]);
