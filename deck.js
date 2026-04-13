import * as THREE from 'three';
import { BlueCards } from './cards/bluecards.js';
import { GreenCards } from './cards/greencards.js';
import { OrangeCards } from './cards/orangecard.js';
import { PurpleCards } from './cards/purplecards.js';
import { RedCards } from './cards/redcards.js';
import { YellowCards } from './cards/yellowcards.js';
// import { PairCards } from './cards/paircards.js';
// import { TripletCards } from './cards/triplecards.js';
// import { QuadrupletCards } from './cards/quadrupletcards.js';

export const AllCards = [
	...BlueCards,
	...GreenCards,
	...OrangeCards,
	...PurpleCards,
	...RedCards,
	...YellowCards,
];

export class Deck {
	constructor(scene, x = 0, y = 0, z = 0) {
		this.scene = scene;
		this.name = null;
		this.cost = null;
		this.damage = null;
		this.target = null;
		this.color = null;

		const geometry = new THREE.PlaneGeometry(3, 4.5);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: 2 });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(x,y,z);
		scene.add(this.mesh);
	}

	assignvals(thecard) {
		this.name = thecard.name;
		this.color = thecard.color;
		this.cost = thecard.cost;
		this.damage = thecard.damage;
		const texture = createCardTexture(this);
		this.mesh.material.map = texture;
		this.mesh.material.needsUpdate = true;
	}
}

function createCardTexture(data) {
	const canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 384;
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, 256, 384);
	ctx.fillStyle = data.color;
	ctx.font = '24px Arial';
	ctx.fillText(data.name, 20, 40);
	ctx.fillText(`Cost: ${data.cost}`, 20, 80);
	ctx.fillText(`Damage: ${data.damage}`, 20, 120);
	return new THREE.CanvasTexture(canvas);
}

// fazer a textura do dado transparente
// o custo ]e o numeor de vezes q aparece 
