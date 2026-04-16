import * as THREE from 'three';
import { Card } from './card.js';


export class Player {
	constructor(scene) {
		this.scene = scene;
		this.health = 50;
		this.mana = {
			blue: 0,
			green: 0,
			darkorange: 0,
			purple: 0,
			red: 0,
			gold: 0,
		};
		this.hand = [];
		this.dropzones = {
			targetLeft: { minX: -25, maxX: -10, minY: -15, maxY: 15, label: 'targetLeft' },
			targetFront: { minX: -8, maxX: 8, minY: 2, maxY: 15, label: 'targetFront' },
			targetRight: { minX: 10, maxX: 25, minY: -15, maxY: 15, label: 'targetRight' },
			targetSelf: { minX: -8, maxX: 8, minY: -15, maxY: -2, label: 'targetSelf' },
		};
		this.dropZonesGraphic = {};

		for (const one in this.dropzones) {
			const z = this.dropzones[one];
			const width = z.maxX - z.minX;
			const height = z.maxY - z.minY;

			const geometry = new THREE.PlaneGeometry(width, height);
			const material = new THREE.MeshBasicMaterial({
				side: 2,
				opacity: 0.2,
				transparent: true,
				color: 0xffffff,
			});

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = (z.minX + z.maxX) / 2;
			mesh.position.y = (z.minY + z.maxY) / 2;
			mesh.position.z = -0.1;
			mesh.visible = false;
			scene.add(mesh);
			mesh.visible = false;
			this.dropZonesGraphic[one] = mesh;
		}
	}

	resetMana() {
		for (const color in this.mana)
			this.mana[color] = 0;
	}

	addMana(color) {
		if (!this.mana[color]) this.mana[color] = 0;
		this.mana[color] += 1;
	}

	canCastSpell(color, amount) {
		if (this.mana[color] >= amount)
			return true;
		return false;
	}

	printMana() {
		console.log(this.mana);
	}

	// playingCard(c) {
	// 	if (!c.dragging) return ;
	// 	const x = c.mesh.position.x;
	// 	const y = c.mesh.position.y;
	// 	const zone = this.dropCard(x, y);

	// 	if (zone) {
	// 		c.castPlay();
	// 	} else {
	// 		c.mesh.position.x = c.originalX;
	// 		c.mesh.position.y = c.originalY;
	// 	}
	// 	c.hovered = false;
	// }

	dropCard(x, y) {
				console.log(x,y);

		for (const zone of Object.values(this.dropzones)) {
			if (x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY) {
				return zone.label;
			}
		}
		return null;
	}
}
