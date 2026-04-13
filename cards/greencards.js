function windDamage(min, max) {
	return Math.floor(Math.random() * max) + min 
}

export const GreenCards = [
	{ id: 1, name: 'Gust', cost: 1, damage: windDamage(2,4), color: 'green'}
	
]