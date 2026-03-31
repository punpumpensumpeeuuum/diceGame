import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('game-canvas')
});
renderer.getSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
const dice = new THREE.Mesh(geometry, material);
scene.add(dice);

function animate() {
	requestAnimationFrame(animate);
	dice.rotation.x += 0.01;
	dice.rotation.y += 0.01;
	renderer.render(scene, camera);
}

animate();