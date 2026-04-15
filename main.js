import * as THREE from 'three';
import { Dice } from './dice.js';
import { Card } from './card.js';
import { AllCards } from './card.js';
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
		resetGame();
	}
}

const game = new Game();

const manaFromDice = {
	1: "blue",
	2: "green",
	3: "darkorange",
	4: "purple",
	5: "red",
	6: "gold"
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
	return new Card(scene, x, -8, 0);
});

hand.forEach(card => {
	card.randomCard();
});
diceList.forEach(d => {
	player.addMana(manaFromDice[d.result]);
});
updateCardDisplay();

function resetGame() {
	player.resetMana();
	diceList.forEach(d => {
		d.numrolls = 2;
		d.locked = false;
		d.mesh.material.forEach(m => m.color.set(0xffffff));
		d.randomizeFace();
		player.addMana(manaFromDice[d.result]);
	});
	hand.forEach(card => {
		card.randomCard();
	});
	endturn = false;
	updateRollDisplay();
	updateCardDisplay();
	rollbutton.style.display = 'flex';
}

function animate() {
	requestAnimationFrame(animate);
	diceList.forEach(d => d.update());
	hand.forEach(c => c.update());
	renderer.render(scene, camera);
}
animate();

const ttt = document.createElement('Turn');
ttt.innerText = `Turn: ${game.turn}`;
document.body.appendChild(ttt);

function displaynum(number) {
	ttt.innerText = `Turn: ${number}`;
}

function updateCardDisplay() {
	hand.forEach(c => {
		const cancan = player.canCastSpell(c.color, c.cost);
		c.setToPlay(cancan);
	});
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
	if (diceList.some(d => d.rolling)) return;
	game.nextturn();
	hand.forEach(card => {
		card.randomCard();
	});
	updateRollDisplay();
	updateCardDisplay();
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
			player.addMana(manaFromDice[result]);
			if (results.length === diceList.length) {
				updateRollDisplay();
				updateCardDisplay();
				player.printMana();
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
	hand.forEach(c => {
		const hits = raycaster.intersectObject(c.mesh);
		if (hits.length > 0) {
			c.castPlay();
		}
	});
});

// https://www.youtube.com/watch?v=gEZcJ3GufmE

// fazer um deck
// descobrir como fazer as cartas serem random
// probs fazer tipo 10 cartas de cada tipo idk
// cada cor tem 8 cartas, e ha 12 cartas cinzentas