import consoleGame from "./game.js";
import { pStyle } from "./prefs.js";
// ===========//ItemModule//===========
const itemModule = game => {
	const Item = {
		name : "Item",
		used : false,
		weight : 1,
		get description () {
			return `There is nothing particularly interesting about this ${this.name}.`
		},
		takeable: true,
		openable: false,
		closed: false,
		locked: false, 
		article: "a",
		listed: true,
		take: function (){
			game.state.objectMode = false;
			if(this.takeable && game.inEnvironment(this.name)){
				game.addToInventory([this]);
				game.mapKey[game.state.currentCell].removeFromEnv(this);
				return console.p(`You pick up the ${this.name}`);
			} else {
				return console.p("You can't take that.");
			}
		},
		drop: function (){
			game.state.objectMode = false;
			if (game.inInventory(this.name)){
				game.removeFromInventory(this);
				game.mapKey[game.state.currentCell].env.push(this);
				return console.p(`${this.name} dropped.`);
			} else {
				return console.p("You don't have that.");
			}
		},
		examine: function (){
			game.state.objectMode = false;
			return console.p(this.description);
				
		},
		open: function () {
			game.state.objectMode = false;
			if (!game.inEnvironment(this.name)) {
				console.p(`You don't see ${this.article} ${this.name} here.`);
				return;
			}
			if (!this.openable) {
				console.p("It cannot be opened.");
				return;
			}
			if (!this.closed) {
				console.p("It is already open.");
				return;
			}
			if (this.locked){
				console.p("It appears to be locked.");
				return;
			}
			console.p(`The ${this.name} is now open.`);
			this.closed = false;
			return;
		},

		close: function () {
			game.state.objectMode = false;
			if (!game.inEnvironment(this.name)) {
				console.p(`You don't see ${this.article} ${this.name} here.`);
				return;
			}
			if (!this.openable) {
				console.p("It cannot be closed.");
				return;
			}
			if (this.closed) {
				console.p("It is already closed.");
				return;
			}
			console.p(`The ${this.name} is now closed.`);
			this.closed = true;
			return;
		},

		read: function (){
			game.state.objectMode = false;
			if (!this.text){
				return console.p("There is nothing to read.");
			}
			if (!game.inInventory(this.name)){
				return console.p(`You will need to pick up the ${this.name} first.`);
			}
			console.p(`The text on the ${this.name} reads: \n`);
			return console.note(this.text);
		},

		hide: function (){
			return game.displayItem();
		},

		unlock: function () {
			game.state.objectMode = false;
			if (!this.locked){
				console.p(`The ${this.name} is not locked.`);
				return;
			}
			if (game.inInventory(this.unlockedBy)){
				this.locked= false;
				console.p(`Using the ${this.unlockedBy}, you are able to unlock the ${this.name}`);
				return;
			}
			console.p(`You do not have the means to unlock the ${this.name}.`)
			return;
		},

		use: function (){
			game.state.objectMode = false;
			return console.p(`Try as you might, you cannot manage to use the ${this.name}`);
		}
	}

	const items = {
		_all: {
			name: "all",
			_take_all: function () {
				const all = game.state.env;
				// game.state.objectMode = false;
				// if (this.takeable && game.inEnvironment(this.name)) {
				// 	game.addToInventory([this]);
				// 	game.mapKey[game.state.currentCell].removeFromEnv(this);
				// 	return console.p(`You pick up the ${this.name}`);
				// } else {
				// 	return console.p("You can't take that.");
				// }
			},
		},

		_book: {
			name: "book",
			weight: 2,
			article: "a",
			description: "A dusty, leatherbound tome"
		},

		_catalogue: {
			name: "catalogue",
			article: "a",
			description: "This booklet appears to be the exhibition catalogue for some fancy art show. ",
			read: function (){
				console.info(`[click link to read => "https://drive.google.com/file/d/0B89dfqio_IykVk9ZMV96TUJESnM/view?usp=sharing"]`)
				// window.open("https://drive.google.com/file/d/0B89dfqio_IykVk9ZMV96TUJESnM/view?usp=sharing", "_blank");//game.displayItem("assets/2008_Ministry_of_Culture.pdf", "application/pdf", "1440px", "960px");
			}
		},
		_chair: {
			name: "chair",
			takeable: false,
		},
		_desk: {
			name: "desk",
			takeable: false,
		},
		
		_books: {
			name: "books",
			takeable: false,
		},
		_paintings: {
			name: "paintings",
			takeable: false,
		},
		_door: {
			name: "door",
			article: "a",
			openable: true,
			locked: false,
			closed: true,
			takeable: false,
			listed: false,
			unlockedBy: "key",
			lockedTarget: "A",
			closedTarget: "A",
			get description () {
				return `The massive wooden door, darkened with generations of dirt and varnish, is secured with a steel deadbolt, which is ${this.locked ? "locked." : "unlocked!"}`
			},
			unlock (){
				Object.getPrototypeOf(this).unlock.call(this);
				game.mapKey[this.lockedTarget].locked = false;
				return;
			},
			open () {
				Object.getPrototypeOf(this).open.call(this);
				game.mapKey[this.closedTarget].closed = false;
				return;
			},
			close () {
				Object.getPrototypeOf(this).close.call(this);
				game.mapKey[this.closedTarget].closed = true;
				return;
			}
			
		},

		_lock: {
			name: "lock",
			// weight: 0,
			// takeable: false,
			openable: false,
			listed: false,
			// locked: true,
			// unlockedBy: "key",
			description: "The brushed steel surface of the lock is virtually unscratched, its brightness in stark contrast to the dark and grimy wood of the heavy front door. It seems certain that this deadbolt was installed very recently. It is a very sturdy-looking lock and without the key that fits its currently vacant keyhole, you will not be able to open it.",
			unlock (){
				Object.getPrototypeOf(Object.getPrototypeOf(this)).unlock.call(this);
				game.mapKey[this.lockedTarget].locked = false;
			},
			proto: "_door",

		},

		_chain: {
			name : "chain",
			weight : 0,
			description: "The thin ball chain dangling in front of you is exactly the sort often connected to a lightbulb. Perhaps you should \"pull\" it...",
			takeable: false,
			pull: function (){
				game.state.objectMode = false;
				let dark = game.mapKey[game.state.currentCell].hideSecrets;
				dark ? console.p("An overhead lightbulb flickers on, faintly illuminating the room.") : console.p("The lightbulb is extinguished.");
				game.mapKey[game.state.currentCell].hideSecrets = !dark;
				return game.describeSurroundings();
			},
			use: function (){
				return this.pull();
			}
		},

		_glove: {
			name : "glove",
			description: "It is a well-worn gray leather work glove. There is nothing otherwise remarkable about it. 🧤",
			contents:[],
			examine: function (){
				game.state.objectMode = false;
				if (this.contents.length){
					const hiddenItem = this.contents.pop();
					console.p(`${this.description}\nAs you examine the glove, a ${hiddenItem.name} falls out, onto the floor.`);
					return game.mapKey[game.state.currentCell].addToEnv(hiddenItem.name);
				} 
				return this.description;
			}
		},

		_grue_repellant: {
			name : "grue_repellant",
			defective : Math.random() < 0.03,
			weight : 3,
			article: "some",
			description: "A 12oz can of premium aerosol grue repellant. This is the good stuff. Grues genuinely find it to be somewhat off-putting.",
			use: function () {
				game.state.objectMode = false;
				if (!game.inInventory(this.name)){
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
			},
			drink: function () {
				game.dead("Drinking from an aerosol can is awkward at best, but still you manage to ravenously slather your chops with the foaming grue repellant. You try to enjoy the searing pain inflicted by this highly caustic (and highly toxic!) chemical as it dissolves the flesh of your mouth and throat, but to no avail. It is not delicious, and you are starting to realize that there are some non-trivial drawbacks to willingly ingesting poison. Oops.");
			}
		},

		_key: {
			name : "key",
			description: "It is an old-timey key that appears to be made of tarnished brass"
		},

		_matchbook: {
			name: "matchbook",
			get description () { 
				return `It is an old paper matchbook, of the type that used to be given away with packs of cigarettes, or printed with the name and telephone number of a business and used as marketing schwag. This particular specimen is a faded green and says \"Magnum Opus\" in a peculiar, squirming op-art font. ${this.closed ? "It is closed, its cardboard cover tucked in." : "The cardboard cover is open, and you can see a handwritten message on the inside. It says, \"THE OWLS ARE NOT WHAT THEY SEEM.\"" }`;
			},
			openable: true,
			closed: true,
		},

		_note: {
			name : "note",
			text: `Welcome! Congratulations! You have been chosen to participate in a research study to investigate the effects of stress response on logical reasoning skills. Should you be able to escape the testing environment before the test termination protocol commences, please take a moment to fill out the supplied survey card. And remember to have fun!`,
			description: "It is a typewritten note on folded stationery. You found it lying next to you on the floor when you regained consciousness."
		},

		_card: {
			name: "card",
			text: `Welcome! Congratulations! You have been chosen to participate in a research study to investigate the effects of stress response on logical reasoning skills. Should you be able to escape the testing environment before the test termination protocol commences, please take a moment to fill out the supplied survey card.`,
			description: "A filthy note you found on the floor of a restroom. Congratulations, it is still slightly damp. Despite its disquieting moistness, the text is still legible."
		},

		_filthy_note: {
			name: "filthy note",
			text: `Dear John,\nI'm leaving. After all of this time, I said it. But I want you to understand that it is not because of you, or something you've done (you have been a loving and loyal partner). It is I who have changed. I am leaving because I am not the person who married you so many years ago; that, and the incredibly low, low prices at Apple Cabin. Click here ==> http://liartownusa.tumblr.com/post/44189893625/apple-cabin-foods-no-2 to see why I prefer their produce for its quality and respectability.`,
			description: "A filthy note you found on the floor of a restroom. Congratulations, it is still slightly damp. Despite its disquieting moistness, the text is still legible."
		},
		_no_tea: {
			name: "no_tea",
			weight: 0,
			article: "",
			description: "You do not have any tea.",
			methodCallcount: 0,
			no_teaMethod: function (message){
					this.methodCallcount ++;
					game.state.objectMode = false;
					console.p(message);
					// return console.p(`${message} ${this.methodCallcount > 1 ? "Perhaps you should contemplate that for a moment..." : ""}`);
					if (this.methodCallcount > 1){
						console.inline(["Perhaps you should take a moment to ", "contemplate", " that."], [pStyle, pStyle + "font-style:italic;", pStyle])	
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
				if (this.methodCallcount > 1){
					console.p("Having thoroughly contemplated the existential ramifications of no tea, you suddenly find that your being transcends all time and space. You are the spoon, so to speak.");
					return console.h1("You just won, you winner, you!");
				}
				return this.no_teaMethod("Let's not resort to that just yet!");
			},
			takeable: false
		}
	}
	
	// Prototype-links each of the objects in items to either Item or other prototype, if defined
	Object.keys(items).map((itemInstance) => {
		const protoProperty = items[itemInstance].proto;
		const prototype = protoProperty ? items[protoProperty] : Item
		Object.setPrototypeOf(items[itemInstance], prototype);
	});

	return items;
};

export default itemModule;