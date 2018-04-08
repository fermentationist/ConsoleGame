
// ===========//Items//===========
const Items = (function (){
	const Item = {
		name : "Item",
		used : false,
		weight : 1,
		description: `There is nothing particularly interesting about this ${this.name}.`,
		takeable: true,
		article: "a",
		take: function (){
			gameState.objectMode = false;
			if(this.takeable && inEnvironment(this.name)){
				gameState.addToInventory([this]);
				mapKey[gameState.currentCell].removeFromEnv(this);
				return console.p(`You pick up the ${this.name}`);
			} else {
				return console.p("You can't take that.");
			}
		},
		drop: function (){
			gameState.objectMode = false;
			if (inInventory(this.name)){
				gameState.removeFromInventory(this);
				mapKey[gameState.currentCell].env.push(this);
				return console.p(`${this.name} dropped.`);
			} else {
				return console.p("You don't have that.");
			}
		},
		examine: function (){
				console.p(this.description);
				gameState.objectMode = false;
		},
		read: function (){
			gameState.objectMode = false;
			if (this.text){
				return console.p(`The text on the ${this.name} reads: \n${this.text}`);
			}
			return console.p(`There is nothing to read.`);
		}
	}

	const items = {
		stockDungeon: function (subEnvName){
			Object.keys(mapKey).map((key) => {
				let roomEnv = mapKey[key][subEnvName];
				let newEnv = [];
				if (roomEnv.length){
					roomEnv.map((item) => {
						let itemObj = typeof item === "string" ? items[`_${item}`] : item;
						itemObj ? newEnv.push(itemObj) : console.log(`Cannot stock ${item}. No such item.`);;
					});
				}
				mapKey[key][subEnvName] = newEnv;
			});
		},

		_grue_repellant: {
			name : "grue_repellant",
			defective : Math.random() < 0.03,
			weight : 3,
			article: "some",
			description: "A 12oz can of premium grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting."
		},

		_slug: {
			name: "slug"
		},

		_chain: {
			name : "chain",
			weight : 0,
			description: "The chain dangling in front of you is exactly the sort often connected to a lightbulb. Perhaps you should \"pull\" it...",
			takeable: false,
			pull: function (){
				let dark = mapKey[gameState.currentCell].hideSecrets;
				dark ? console.p("An overhead lightbulb flickers on, faintly illuminating the room.") : console.p("The lightbulb is extinguished.");
				mapKey[gameState.currentCell].hideSecrets = !dark;
				return describeSurroundings();
			}
		},

		_key: {
			name : "key",
			description: "It is an old-timey key that appears to be made of tarnished brass"
		},

		_glove: {
			name : "glove",
			description: "It is a well-worn gray leather work glove. There is nothing otherwise remarkable about it.",
			contents:[],
			examine: function (){
				gameState.objectMode = false;
				if (this.contents.length){
					const hiddenItem = this.contents.pop();
					console.p(`As you examine the glove, a ${hiddenItem.name} falls out, onto the closet floor.`);
					return mapKey[gameState.currentCell].addToEnv(hiddenItem.name);
				} 
				return this.description;
			}
		},

		_note: {
			name : "note",
			text: "Dear John,\n   It's not you, it's the incredibly low, low prices at Apple Cabin...",
			description: "A filthy note you picked up from the floor of a restroom. Congratulations, it is still slightly damp. Despite its disquieting moistness, the text is still legible.",
			examine: function (){
				console.p(this.description);
				gameState.objectMode = false;
				gameState.addToHistory("examine note");
			}
		},

		_no_tea: {
			name: "no_tea",
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

Items.stockDungeon("hiddenEnv");
Items.stockDungeon("visibleEnv");

Items._glove.contents.push(Items._key);

gameState.addToInventory([Items._grue_repellant, Items._no_tea]);

