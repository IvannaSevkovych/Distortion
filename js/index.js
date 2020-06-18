/* eslint-disable */


/*
 * Imports
 */
// npm
import * as THREE from 'three';
import gsap from 'gsap';
import img from '../img/alex-wong-l5Tzv1alcps-unsplash.jpg';
const OrbitControls = require('three-orbit-controls')(THREE);
const createInputEvents = require('simple-input-events');

// shaders
import fragment from './shaders/distortion_fragment.glsl';
import vertex from './shaders/distortion_vertex.glsl';

/*
 * Declarations
 */
// Constants
const mouse = new THREE.Vector2(0, 0);

// Variables
let camera; let controls; let scene; let renderer; let material; let plane;
let prevSpeed = 0;


/*
 * Functions
 */

function init() {
  const container = document.getElementById('container');
  const mouseEvent = createInputEvents(container);

  scene = new THREE.Scene();
  scene.destination = { x: 0, y: 0 };

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    container.offsetWidth / container.offsetHeight,
    0.001, 100
  );
  camera.position.set(0, 0, 1);


  controls = new OrbitControls(camera, renderer.domElement);


  material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      speed: { type: 'f', value: 0 },
      direction: { type: 'f', value: 0 },
      progress: { type: 'f', value: 0 },
      mouseTarget: { type: 'v2', value: new THREE.Vector2(0, 0) },
      texture: { type: 't', value: new THREE.TextureLoader().load(img) },
      resolution: { type: 'v4', value: new THREE.Vector4() },
    },
    wireframe: false,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
  scene.add(plane);

  resize();
  window.addEventListener('resize', resize);
  initMouseEvents(mouseEvent);
}

function initMouseEvents(event) {

  event.on('move', ({ position, event, inside, dragging }) => {
    // mousemove / touchmove
    material.uniforms.mouseTarget.value.x = position[0] / container.offsetWidth;
    material.uniforms.mouseTarget.value.y = 1 - position[1] / container.offsetHeight;
  });

  document.addEventListener("mousedown", () => {
    material.uniforms.direction.value = -1;
    gsap.to(material.uniforms.progress, {
      value: 1,
      duration: 0.5,
    })
  })

  document.addEventListener("mouseup", () => {
    material.uniforms.direction.value = 1;
    gsap.to(material.uniforms.progress, {
      value: 0,
      duration: 0.5,
    })
  })

}

function resize() {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;

  updateShaderResolution(w, h);
  camera.updateProjectionMatrix();
}

function updateShaderResolution(w, h) {

  // Adjust aspect ratio of the plane to mirror the aspect ratio of the viewport
  if (w > h) {
    plane.scale.x = w / h;
  }
  else {
    plane.scale.y = h / w;
  }

  // Adjust camera FOV so that the plane covers the whole screen
  const dist = camera.position.z;
  const height = plane.geometry.parameters.height;
  camera.fov = (180 / Math.PI) * 2 * Math.atan((height / 2) / dist);

  // Declare resolution variable
  const imageAspect = 1280 / 1920;
  let a1, a2;
  if (h / w > imageAspect) {
    a1 = (w * imageAspect) / h;
    a2 = 1;
  } else {
    a1 = 1;
    a2 = h / (w * imageAspect);
  }

  const resolution = new THREE.Vector4(w, h, a1, a2);
  material.uniforms.resolution.value = resolution;

}



let time = 0;
function animate() {
  time += 0.05;
  material.uniforms.time.value = time;

  getSpeed()
  requestAnimationFrame(animate);
  render();
}



function getSpeed() {

  let speed = Math.sqrt(
    (mouse.x - material.uniforms.mouseTarget.value.x) ** 2 +
    (mouse.y - material.uniforms.mouseTarget.value.y) ** 2
  )
  material.uniforms.speed.value += 0.1 * (speed - prevSpeed);

  prevSpeed = speed;

  mouse.x = material.uniforms.mouseTarget.value.x;
  mouse.y = material.uniforms.mouseTarget.value.y;
}

function render() {
  renderer.render(scene, camera);
}


init();
animate();

