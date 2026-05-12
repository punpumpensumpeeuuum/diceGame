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
