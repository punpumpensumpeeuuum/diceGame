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
		this.hovered = false;
		this.originalX = x;
		this.originalY = y;
		this.shakeTime = 0;
		this.playable = false;

		const geometry = new THREE.PlaneGeometry(3, 4.5);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffdd, side: 2 });
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

	update() {
		if (this.hovered && this.playable) {
			this.shakeTime += 0.6;
			this.mesh.position.x = this.originalX + Math.sin(this.shakeTime) * 0.03;
			this.mesh.position.y = this.originalY + Math.cos(this.shakeTime * 1.3) * 0.03;
		} else {
			this.mesh.position.x = this.originalX;
			this.mesh.position.y = this.originalY;
		}
	}

	setToPlay(cancan) {
		this.playable = cancan;
		this.mesh.material.color.set(cancan ? 0xffffdd : 0x888888);
	}
}

function createCardTexture(data) {
	const canvas = document.createElement('canvas');
	canvas.width = 256; 
	canvas.height = 384;
	const ctx = canvas.getContext('2d');
	const layout = {
		title: 50,
		costHeight: 90,
		textTop: 344
	};
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,256,384);
	ctx.fillStyle = data.color;
	ctx.font = "bold 36px Arial";
	ctx.textAlign = "center";
	ctx.fillText(data.name, 128, layout.title);
	const texture = new THREE.CanvasTexture(canvas);
	const img = new Image();
	img.src = `textures/noback/${data.color}.png`;
	img.onload = () => {
		const size = 120;
		drawCost(ctx, data.cost, layout.costHeight, img);
		texture.needsUpdate = true;
	};
	ctx.textAlign = "left";
	ctx.fillText(`Damage: ${data.damage}`, 20, layout.textTop);
	return texture;
}

function drawCost(ctx, cost, y, img) {

	const size = 150 - (cost * 5);
	const spacing = -50;
	let	firstRow = 0;
	let secondRow = 0;
	if (cost <= 3)
		firstRow = cost;
	else if (cost === 4) {
		firstRow = 2;
		secondRow = 2;
	}
	else if (cost === 5) {
		firstRow = 3;
		secondRow = 2;
	}

	function drawRow(count, y) {
		const totalWidth = count * size + (count - 1) * spacing;
		const startX = (256 - totalWidth) / 2;

		for (let i = 0; i < count; i++) {
			const x = startX + i * (size + spacing);
			ctx.drawImage(img, x, y, size, size);
		}
	}

	drawRow(firstRow, y);

	if (secondRow > 0)
		drawRow(secondRow, y + size - 45);
}
