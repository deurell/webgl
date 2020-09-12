import * as THREE from '../node_modules/three/build/three.module.js';

const MAX_POINTS = 1024 * 4;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const render = function(time) {
    requestAnimationFrame(render);

    if (points_drawn >= MAX_POINTS) {
        points_drawn = 0;
    }

    if (points_drawn % 1 == 0) {
        const height = 4;
        const geometry = new THREE.BoxGeometry(0.2, 0.2, height);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.copy(points[points_drawn].clone().applyMatrix4(line.matrixWorld));
        cube.lookAt(new THREE.Vector3(0, 0, 0));
        cubes.push(cube);
        scene.add(cube);

        if (cubes.length > 120) {
            scene.remove(cubes[0]);
            cubes.shift();
        }
    }

    for (let i = 0; i < cubes.length; i++) {
        const pos = cubes[i].position;
        cubes[i].position.copy(pos.multiplyScalar(1.04));
        const col = cubes[i].material.color;
        cubes[i].material.color.copy(cubes[i].material.color.multiplyScalar(0.97));
    }

    line.geometry.setDrawRange(0, points_drawn);
    points_drawn += 2;

    line.rotation.x += 0.015;
    line.rotation.y += -0.021;
    camera.position.z = 200 + 100 * Math.sin(clock.getElapsedTime() * 1);
    renderer.render(scene, camera);
};

let cubes = [];
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 200);
camera.lookAt(0, 0, 0);

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const material = new THREE.LineBasicMaterial({ color: 0xffffff });
const points = [];
let points_drawn = 0;

const radius = 20;
let xa = 0;
let ya = 0;
let dist = 0.22;

for (let i = 0; i < MAX_POINTS; i++) {
    const scale = 0.12;
    const x = radius * Math.sin(ya) * Math.cos(xa);
    const y = radius * Math.sin(ya) * Math.sin(xa);
    const z = radius * Math.cos(ya);
    const point = new THREE.Vector3(x, y, z);
    points.push(point);
    let res = Math.random();
    if (res < 0.1) {
        xa += dist * scale;
    } else if (res < 0.5) {
        xa -= dist * scale;
    } else if (res < 0.65) {
        ya += dist * scale;
    } else {
        ya -= dist * scale;
    }
}

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);

render();