import * as THREE from 'three';
import { BlueCards } from './cards/bluecards.js';
// import { GreenCards } from './cards/greencards.js';
// import { OrangeCards } from './cards/orangecard.js';
// import { PurpleCards } from './cards/purplecards.js';
// import { RedCards } from './cards/redcards.js';
// import { YellowCards } from './cards/yellowcards.js';
// import { PairCards } from './cards/paircards.js';
// import { TripletCards } from './cards/triplecards.js';
// import { QuadrupletCards } from './cards/quadrupletcards.js';

export const AllCards = [
	...BlueCards,
];

export class Deck {
	constructor(scene, x = 0, y = 0, z = 0) {
		this.scene = scene;
		this.name = null;
		this.mana = null;
		this.cost = null;
		this.damage = null;
		this.target = null;

		const geometry = new THREE.PlaneGeometry(3, 4.5);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: 2 });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(x,y,z);
		scene.add(this.mesh);
	}

	assignvals(thecard) {
		console.log("aaaaaaaom" , thecard.name);
		this.name = thecard.name;
		this.mana = thecard.mana;
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
	// fazer uma funcao pa ver se o tipo de mana for x a cor ]e x se foir y ]e y you feel me?
	ctx.fillStyle = 'black';
	ctx.font = '24px Arial';
	ctx.fillText(data.name, 20, 40);
	ctx.fillText(`Cost: ${data.cost}`, 20, 80);
	ctx.fillText(`Damage: ${data.damage}`, 20, 120);

	return new THREE.CanvasTexture(canvas);
}
