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

export class Deck {
	constructor(scene, x = 0, y = 0, z = 0) {
		this.scene = scene;
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
}
