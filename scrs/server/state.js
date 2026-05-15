export const manaFromDice = {
	1: "blue",
	2: "green",
	3: "darkorange",
	4: "purple",
	5: "red",
	6: "gold"
};

export class Game {
	constructor() {
		this.turn = 1;
		this.mana = {
			blue: 0,
			green: 0,
			darkorange: 0,
			purple: 0,
			red: 0,
			gold: 0,
		};
		this.diceResults = [1, 1, 1, 1, 1];
		this.lockedDice = [false, false, false, false, false];
		this.nrolls = 2
		this.endturn = false;
	}

	nextTurn() {
		this.turn++;
		this.resetMana();
		this.nrolls = 2
		this.endturn = false;
		console.log(`turn > ${this.turn}`);
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

	resetMana() {
		for (const color in this.mana)
			this.mana[color] = 0;
	}
}
