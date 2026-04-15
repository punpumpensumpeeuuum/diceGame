import * as THREE from 'three';

export class Player {
	constructor() {
		this.health = 50;
		this.mana = {
			blue: 0,
			green: 0,
			darkorange: 0,
			purple: 0,
			red: 0,
			gold: 0,
		};
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
}
