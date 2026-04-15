import * as THREE from 'three';

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

export class Dice {
	constructor(scene, x = 0, y = 0, z = 0) {
		this.scene = scene;
		this.result = null;
		this.rolly = null;
		this.rolling = false;
		this.locked = false;
		this.numrolls = 2;

		const geometry = new THREE.BoxGeometry();
		const materials = [1,2,3,4,5,6].map(n => 
			new THREE.MeshBasicMaterial({ map: setDiceFaceTexture(n) })
		);
		this.mesh = new THREE.Mesh(geometry, materials);
		this.mesh.position.set(x,y,z);
		scene.add(this.mesh);
		this.randomizeFace();
	}

	roll(onDone) {
		this.numrolls--;
		if (this.locked) {
			if (onDone) onDone(this.result);
			return ;
		}
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

	onClick() {
		if (this.rolling) return ;
		this.locked = !this.locked;
		this.mesh.material.forEach(m => {
			m.color.set(this.locked ? 0x888888 : 0xffffff);
		});
	}

	randomizeFace() {
		this.rolling = true;
		this.update();
		this.result = Math.floor(Math.random() * 6) + 1;
		this.rolly = ((Math.floor(Math.random() * 6) + 1) * 100) + ((Math.floor(Math.random() * 6) + 1) * 100);
		const target = faceRotations[this.result];
		setTimeout(() => {
			this.rolling = false;
			this.mesh.rotation.x = target.x;
			this.mesh.rotation.y = target.y;
		}, this.rolly);
	}
}