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
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
const dice = new THREE.Mesh(geometry, material);
scene.add(dice);

let rolling = false;

function animate() {
	requestAnimationFrame(animate);
	if (rolling) {
		dice.rotation.x += 0.1;
		dice.rotation.y += 0.1;
	}
	renderer.render(scene, camera);
}
animate();

const button = document.createElement('button');
button.innerText = 'Roll';
button.addEventListener('click', () => {
	rolling = true;
	setTimeout(() => {
		rolling = false;
	}, 1000);
});
document.body.appendChild(button);