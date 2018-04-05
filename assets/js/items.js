
// ===========//Items//===========
const Items = (function (){
	const Item = {
		name : "Item",
		used : false,
		weight : 1,
		description: `There is nothing particularly interesting about this ${this.name}.`,
		takeable: true,
		take: function (){
			if(this.takeable){
				gameState.addToInventory([this]);
				return console.p(`You pick up the ${this.name}`);
			} else {
				return console.p("You can't take that.");
			}
		},
		drop: function (){
			if (gameState.inventory.includes(this)){
				gameState.removeFromInventory(this);
				const location = maps[gameState.position.z][gameState.position.y][gameState.position.x];
				mapKey[location].env.push(this);
				return console.p(`${this.name} dropped.`);
			} else {
				return console.p("You don't have that.");
			}
		}
	}

	const items = {

		_grueRepellant: {
			name : "grue repellant",
			used : false,
			defective : Math.random() < 0.03,
			weight : 3,
			description: "A 12oz can of premium grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting.",
			takeable: true
		},

		_chain: {
			name : "chain",
			used : false,
			weight : 0,
			description: "It is an old-timey key that appears to be made of tarnished brass",
			takeable: false
		},

		_key: {
			name : "key",
			used : false,
			weight : 1,
			description: "It is an old-timey key that appears to be made of tarnished brass",
			takeable: true
		},

		_glove: {
			name : "glove",
			used : false,
			weight : 1,
			description: "The glove is a well-worn gray leather work glove. There is nothing otherwise remarkable about it.",
			take: function (){
				console.p("When you pick up the glove, a small key falls out, onto the closet floor.");
				mapKey["$"].env2.push(_key);
				gameState.addToInventory(this);
			},
			takeable: true
		},

		_note: {
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
		},

		_tea: {
			name: "no tea",
			used: false,
			weight: 0,
			description: "You do not have any tea.",
			drink: function (){
				console.p("You cannot very well drink no tea, can you?");
			},
			takeable: false
		}
	}
	
	Object.keys(items).map((itemInstance) => {
		Object.setPrototypeOf(items[itemInstance], Item);
	});

	return items;
})();

gameState.addToInventory([Items._grueRepellant, Items._key, Items._note, Items._tea]);

