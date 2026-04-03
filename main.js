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

function createDiceFaceTexture(number) {
	const canvas = document.createElement('canvas');
	const size = 256;
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = 'red';
	ctx.fillRect(0, 0, size, size);

	const dotPositions = {
	1: [[0.5, 0.5]],
	2: [[0.25, 0.25], [0.75, 0.75]],
	3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
	4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
	5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
	6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]],
	};

	ctx.fillStyle = 'white';
	for (const [x, y] of dotPositions[number]) {
		ctx.beginPath();
		ctx.arc(x * size, y * size, size * 0.08, 0, Math.PI * 2);
		ctx.fill();
	}
	return new THREE.CanvasTexture(canvas);
}

const textures = [
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(1) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(2) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(3) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(4) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(5) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(6) }),
];

const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x0000ff});
const dice = new THREE.Mesh(geometry, textures);
scene.add(dice);

const res = document.createElement('numb');
res.innerText = '';

let rolling = false;

function displayNumber(number) {
	res.innerText = number;
	document.body.appendChild(res);
	console.log(number);
}

function animate() {
	requestAnimationFrame(animate);
	if (rolling) {
		dice.rotation.x += 0.3;
		dice.rotation.y += 0.3;
	}
	renderer.render(scene, camera);
}
animate();

const faceRotations = {
	1: { x: 0, y: -Math.PI / 2, },
	2: { x: 0, y: Math.PI / 2, },
	3: { x: Math.PI / 2, y: 0, },
	4: { x: -Math.PI / 2, y: 0, },
	5: { x: 0, y: 0, },
	6: { x: 0, y: Math.PI, },
};

const randomNumber = () => {
	return Math.floor(Math.random() * 6) + 1;
}

const rollbutton = document.createElement('rollbutton');
rollbutton.innerText = 'Roll';
rollbutton.addEventListener('click', () => {
	rolling = true;
	rollbutton.style.display = 'none';
	const result = randomNumber();
	const target = faceRotations[result];
	setTimeout(() => {
		rolling = false;
		dice.rotation.x = target.x;
		dice.rotation.y = target.y;
		rollbutton.style.display = 'block';
		displayNumber(result);
	}, 500);
});
document.body.appendChild(rollbutton);