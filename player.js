import * as THREE from 'three';

export class Player {
	constructor() {
		this.health = 50;
		this.mana = {
			blue: 0,
			green: 0,
			orange: 0,
			purple: 0,
			red: 0,
			yellow: 0,
		};
	}

	resetMana() {
		for (let i = 0; i <= 5; i++)
			this.mana[i] = 0;
	}

	castSpell(color, amount) {
		if (this.mana[color] >= amount)
			return true;
		return false;
	}
}
