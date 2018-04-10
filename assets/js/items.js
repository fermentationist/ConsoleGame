
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
			gameState.objectMode = false;
			return console.p(this.description);
				
		},
		read: function (){
			gameState.objectMode = false;
			if (this.text){
				return console.p(`The text on the ${this.name} reads: \n${this.text}`);
			}
			return console.p(`There is nothing to read.`);
		},
		use: function (){
			gameState.objectMode = false;
			return console.p(`Try as you might, you cannot manage to use the ${this.name}`);
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
				return mapKey[key][subEnvName] = newEnv;
			});
		},

		_book: {
			name: "book",
			weight: 2,
			article: "a",
			description: "This dusty, leatherbound tome"
		},

		_grue_repellant: {
			name : "grue_repellant",
			defective : 1,//Math.random() < 0.03,
			weight : 3,
			article: "some",
			description: "A 12oz can of premium aerosol grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting.",
			use: function () {
				gameState.objectMode = false;
				if (!inInventory(this.name)){
					return inEnvironment(this.name) ? console.p("You will need to pick it up first.") : console.p("You don't see that here.");
				} else if (this.used){
					return console.p("Sorry, but it has already been used.");
				} else if (this.defective) {
					this.used = true;
					return console.p("Nothing happens. This must be one of the Math.random() < 0.03 of grue_repellant cans that were programmed to be, I mean, that were accidentally manufactured defectively. Repeated attempts to coax repellant from the aerosol canister prove equally fruitless.");
				} else {
					this.used = true;
					return console.p("A cloud of repellant hisses from the canister, temporarily obscuring your surroundings. By the time it clears, your head begins to throb, and you feel a dull, leaden taste coating your tongue. The edges of your eyes and nostrils feel sunburnt, and you there is also a burning sensation to accompany an unsteady buzzing in your ears. Although you are not a grue, you find it to be more than somewhat off-putting.");
				}
			},
			spray: function () {
				return this.use();
			}
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
				gameState.objectMode = false;
				let dark = mapKey[gameState.currentCell].hideSecrets;
				dark ? console.p("An overhead lightbulb flickers on, faintly illuminating the room.") : console.p("The lightbulb is extinguished.");
				mapKey[gameState.currentCell].hideSecrets = !dark;
				return describeSurroundings();
			},
			use: function (){
				return this.pull();
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
					console.p(`As you examine the glove, a ${hiddenItem.name} falls out, onto the floor.`);
					return mapKey[gameState.currentCell].addToEnv(hiddenItem.name);
				} 
				return this.description;
			}
		},

		_note: {
			name : "note",
			text: "Dear John,\n   It's not you, it's the incredibly low, low prices at Apple Cabin...",
			description: "A filthy note you picked up from the floor of a restroom. Congratulations, it is still slightly damp. Despite its disquieting moistness, the text is still legible."
		},

		_no_tea: {
			name: "no_tea",
			weight: 0,
			description: "You do not have any tea.",
			methodCallcount: 0,
			no_teaMethod: function (message){
					this.methodCallcount ++;
					console.log('this.methodCallcount', this.methodCallcount);
					gameState.objectMode = false;
					// return console.p(`${message} ${this.methodCallcount > 1 ? "Perhaps you should contemplate that for a moment..." : ""}`);
					if (this.methodCallcount > 1){
						console.italic("Perhaps you should take a moment to ", "contemplate", " that.")	
					}
			},
			drink: function (){
				return this.no_teaMethod("How do you intend to drink no tea?");
			},
			drop: function (){
				return this.no_teaMethod("You can't very well drop tea that you don't have.");
			},
			take: function (){
				return this.no_teaMethod("No tea isn't the sort of thing you can take.");
			},
			examine: function (){
				return this.no_teaMethod(this.description);
			},
			use: function (){
				return this.no_teaMethod("Unsurprisingly, using the no tea has no effect.");
			},
			contemplate: function (){
				if (this.methodCallcount > 2){
					console.p("Having thoroughly contemplated the existential ramifications of no tea, you suddenly find that your being transcends all time and space. You are the spoon, so to speak.");
					return console.h1("You fucking win, you winner, you!");
				}
				return console.p("Let's not resort to that just yet!");
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

