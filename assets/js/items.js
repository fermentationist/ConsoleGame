
// ===========//Items//===========
const _grueRepellant = {
	name : "grue repellant",
	used : false,
	defective : Math.random() < 0.03,
	weight : 3,
	description: "A 12oz can of premium grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting."
}

const _key = {
	name : "key",
	used : false,
	weight : 1,
	description: "It is an old-timey key that appears to be made of tarnished brass"
}

const _note = {
	name : "note",
	used : false,
	weight : 1,
	text: "Dear John,\n   It's not you, it's the incredibly low, low prices at Apple Cabin...",
	description: "A filthy note you picked up from the floor of a restroom. Congratulations, it is still slightly damp.",
	read: function (){
		console.p(`The note reads: ${this.text}`);
		gameState.objectMode = false;
		gameState.addToHistory("read note");
	},
	examine: function (){
		console.p(this.description);
		gameState.objectMode = false;
		gameState.addToHistory("examine note");
	}
}

const _tea = {
	name: "no tea",
	used: false,
	weight: 0,
	description: "You do not have any tea.",
	drink: function (){
		console.p("You cannot very well drink no tea, can you?");
	}
}

gameState.addToInventory([_grueRepellant, _key, _note, _tea]);


