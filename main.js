import * as THREE from 'three';
import { Dice } from './dice.js';
import { Deck } from './deck.js';
import { AllCards } from './deck.js';
import { Player } from './player.js';

const player = new Player();

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

class Game {
	constructor() {
		this.turn = 1;
	}

	nextturn() {
		this.turn++;
		console.log(`turn > ${this.turn}`);
		resetrolls();
	}
}

const game = new Game();

const typeOMana = {
	'blue': 1,
	'green': 2,
	'orange': 3,
	'purple': 4,
	'red': 5,
	'yellow': 6,
};

const diceList = [
	new Dice(scene, 4, -3, 0),
	new Dice(scene, 2, -3, 0),
	new Dice(scene, 0, -3, 0),
	new Dice(scene, -2, -3, 0),
	new Dice(scene, -4, -3, 0),
];

const handSize = 5;
const spacing = 4;
const hand = Array.from({ length: handSize }, (_, i) => {
	const x = (i - (handSize - 1) / 2) * spacing;
	return new Deck(scene, x, -8, 0);
});

hand.forEach(card => {
	const randomc = AllCards[Math.floor(Math.random() * AllCards.length)];
	card.assignvals(randomc);	
});

function resetrolls() {
	diceList.forEach(d => {
		d.numrolls = 2;
		d.locked = false;
		d.mesh.material.forEach(m => m.color.set(0xffffff));
		d.randomizeFace();
	});
	endturn = false;
	updateRollDisplay();
	rollbutton.style.display = 'flex';
}

function animate() {
	requestAnimationFrame(animate);
	diceList.forEach(d => d.update());
	hand.forEach(c => c.update(player.castSpell(typeOMana[c.color], c.cost)));
	renderer.render(scene, camera);
}
animate();

const ttt = document.createElement('Turn');
ttt.innerText = `Turn: ${game.turn}`;
document.body.appendChild(ttt);

function displaynum(number) {
	ttt.innerText = `Turn: ${number}`;
}

function updateRollDisplay() {
	const rolls = diceList[0].numrolls;
	if (rolls === 0) {
		rollbutton.style.display = 'none';
		return ;
	}
	rollbutton.innerText = `${rolls} Roll`;
	rollbutton.style.display = 'flex';
}

const nextturnbutton = document.createElement('nextturnbutton');
nextturnbutton.innerText = 'Next turn';
let endturn = false;
nextturnbutton.addEventListener('click', () => {
	if (!endturn) return ;
	game.nextturn();
	hand.forEach(card => {
		const randomc = AllCards[Math.floor(Math.random() * AllCards.length)];
		card.assignvals(randomc);
	});
	updateRollDisplay();
	displaynum(game.turn);
	endturn = false;
});
document.body.appendChild(nextturnbutton);

const rollbutton = document.createElement('rollbutton');
rollbutton.addEventListener('click', () => {
	if (diceList[0].numrolls === 0) {
		return ;
	}
	player.resetMana();
	rollbutton.style.display = 'none';
	endturn = false;
	let results = [];
	diceList.forEach(d => {
		d.roll((result) => {
			results.push(result);
			player.mana[result] += 1;
			if (results.length === diceList.length) {
				updateRollDisplay();
				endturn = true;
			}
		})
	});
});
document.body.appendChild(rollbutton);
updateRollDisplay();

const deckbutton = document.createElement('deckbutton');
deckbutton.innerText = 'Deck';




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	hand.forEach(c => {
		const hits = raycaster.intersectObject(c.mesh);
		c.hovered = hits.length > 0;
	});
});

window.addEventListener('click', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	diceList.forEach(d => {
		const hits = raycaster.intersectObject(d.mesh);
		if (hits.length > 0) {
			d.onClick();
		}
	});
	// hand.forEach(c => {
	// 	const hits = raycaster.intersectObject(c.mesh);
	// 	if (hits.length > 0) {
	// 		c.onClick();
	// 	}
	// });
});

// fazer um deck
// descobrir como fazer as cartas serem random
// probs fazer tipo 10 cartas de cada tipo idk
// cada cor tem 8 cartas, e ha 12 cartas cinzentas