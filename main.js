import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('game-canvas')
});
renderer.setSize(window.innerWidth, window.innerHeight);

const faceRotations = {
	1: { x: 0, y: -Math.PI / 2, },
	2: { x: 0, y: Math.PI / 2, },
	3: { x: Math.PI / 2, y: 0, },
	4: { x: -Math.PI / 2, y: 0, },
	5: { x: 0, y: 0, },
	6: { x: 0, y: Math.PI, },
};

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

const textureLoader = new THREE.TextureLoader();

function setDiceFaceTexture(number) {
	return textureLoader.load(`textures/${number}.png`);
}

const textures = [
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(1) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(2) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(3) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(4) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(5) }),
	new THREE.MeshBasicMaterial({ map: createDiceFaceTexture(6) }),
];

class Dice {
	constructor(x = 0, y = 0, z = 0) {
		this.result = null;
		this.rolly = null;
		this.rolling = false;

		const geometry = new THREE.BoxGeometry();
		const materials = [1,2,3,4,5,6].map(n => 
			new THREE.MeshBasicMaterial({ map: setDiceFaceTexture(n) })
		);
		this.mesh = new THREE.Mesh(geometry, materials);
		this.mesh.position.set(x,y,z);
		scene.add(this.mesh);
	}

	roll(onDone) {
		this.rolling = true;
		this.result = Math.floor(Math.random() * 6) + 1;
		this.rolly = ((Math.floor(Math.random() * 6) + 1) * 100) + ((Math.floor(Math.random() * 6) + 1) * 100);
		const target = faceRotations[this.result];
		setTimeout(() => {
			this.rolling = false;
			this.mesh.rotation.x = target.x;
			this.mesh.rotation.y = target.y;
			if (onDone) onDone(this.result);
		}, this.rolly);
	}

	update() {
		if (this.rolling) {
			this.mesh.rotation.x += 0.3;
			this.mesh.rotation.y += 0.3;
		}
	}
}

const diceList = [
	new Dice(4, -3, 0),
	new Dice(2, -3, 0),
	new Dice(0, -3, 0),
	new Dice(-2, -3, 0),
	new Dice(-4, -3, 0),
];

const res = document.createElement('numb');
res.innerText = '';
document.body.appendChild(res);

function displayNumber(number) {
	res.innerText = number;
	console.log(number);
}

class Card {
	constructor(x = 0, y = 0, z = 0) {
		this.mana = null;
		this.cost = null;
		this.damage = null;
		this.target = null;

		const geometry = new THREE.PlaneGeometry(3, 4.5);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubeSide });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(x,y,z);
		scene.add(this.mesh);
	}
}

const handSize = 5;
const spacing = 4;
const hand = Array.from({ length: handSize }, (_, i) => {
	const x = (i - (handSize - 1) / 2) * spacing;
	return new Card(x, -8, 0);
});


function animate() {
	requestAnimationFrame(animate);
	diceList.forEach(d => d.update());
	renderer.render(scene, camera);
}
animate();

const rollbutton = document.createElement('rollbutton');
rollbutton.innerText = 'Roll';
rollbutton.addEventListener('click', () => {
	rollbutton.style.display = 'none';
	let results = [];
	diceList.forEach(d => {
		d.roll((result) => {
			results.push(result);
			if (results.length === diceList.length) {
				displayNumber(results.reduce((a, b) => a + b, 0));
				rollbutton.style.display = 'flex';
			}
		})
	});
});
document.body.appendChild(rollbutton);

const deckbutton = document.createElement('deckbutton');
deckbutton.innerText = 'Deck';

// fazer um deck
// descobrir como fazer as cartas serem random
// probs fazer tipo 10 cartas de cada tipo idk