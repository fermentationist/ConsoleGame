const mapKey = game => {
	// Prototype definition for a single cell on the map grid (usually a room)
	const MapCell = {
		name: "Nowhere", // room name to be displayed by game.currentHeader() 
		locked: false, 
		lockText: "", // text to be displayed when player attempts to enter the locked area (but is prevented)
		unlockText: "", // text to be displayed when area becomes unlocked
		hiddenSecrets: false, // used to toggle room description and whether player has access to hiddenEnv
		get hideSecrets () {
			const cond2 = this.visibleEnv.includes(game.items._lantern) || this.hiddenEnv.includes(game.items._lantern) || game.inInventory("lantern");
			const cond3 = this.visibleEnv.includes(game.items._matchbook) || game.inInventory("matchbook");
			const cond2b = game.items._lantern.fireCount > 0;
			const cond3b = game.items._matchbook.fireCount > 0;
			if ( (cond2 && cond2b)||(cond3 && cond3b) ) {
				return false;
			}
			return this.hiddenSecrets;//game.state.fireCount > 0 ? false : this.hiddenSecrets;
			
		},
		set hideSecrets (trueOrFalse){
			this.hiddenSecrets = trueOrFalse;
		},
		description: "You find yourself in a non-descript, unremarkable, non-place. Nothing is happening, nor is anything of interest likely to happen here in the future.", // the default text displayed when player enters or "looks" at room
		smell: "Your nose is unable to detect anything unusual, beyond the smell of age and decay that permeates the entirety of the decrepit building.", // text displayed in response to smell command
		sound: "The silence is broken only by the faint sound of the wind outside, and the occasional creak of sagging floorboards underfoot.", // text displayed in response to listen command
		hiddenEnv: [], // items in area that are not described and cannot be interacted with unless hideSecrets = false
		visibleEnv: [], // items described at the end of game.describeSurroundings() text by default
		get env (){ // accessor property returns an array containing the names (as strngs) of the items in present environment
			return {
				visibleEnv: this.visibleEnv,
				containedEnv: this.containedEnv,
				hiddenEnv: this.hideSecrets ? [] : this.hiddenEnv
			}
		},

		// returns any items in the environment that contain other items and are open, as an array of the item objects
		get openContainers () {
			const itemsInEnv = this.hideSecrets ? this.visibleEnv : this.visibleEnv.concat(this.hiddenEnv);
			const itemsWithContainers = itemsInEnv.filter(item => item.contents && item.contents.length > 0);
			const openContainerItems = itemsWithContainers.filter(containerItem => {
				return containerItem.closed === false;
			});
			return openContainerItems;
		},

		// returns the items available in the environment that are nested inside other objects
		get containedEnv () {
			const containedItems = this.openContainers.length > 0 ? this.openContainers.map(item => {
				return item.contents;
			}) : [];
			return containedItems.flat();
		},

		removeFromEnv: function (item) {
			const envName = game.fromWhichEnv(item.name);
			if (envName === "containedEnv") {
				return this.removeFromContainer(item);
			}
			const thisEnv = this[game.fromWhichEnv(item.name)];
			const indexOfItem = thisEnv.map(i => i.name).indexOf(item.name)
			const newEnv = thisEnv.splice(indexOfItem, 1);
			// const newEnv =  this.env.filter(it => it.name !== item.name);
			return this[game.fromWhichEnv(item.name)] = newEnv;
		},
		removeFromContainer: function (item) {
			const [container] =  this.openContainers.filter(thing => thing.contents.includes(item));
			const filteredContainer = container.contents.filter(thingy => {
				return thingy !== item
			});
			const visibleOrHidden = game.fromWhichEnv(container.name)
			const containerIndex = this[visibleOrHidden].map(thang => thang.name).indexOf(container.name);
			return this[visibleOrHidden][containerIndex].contents = filteredContainer;
		},
		addToEnv: function (itemName) { 
			const itemObj = game.items[`_${itemName}`];
			return this.visibleEnv.push(itemObj);

		}
	}
	const mapkey = {
		"0": {
			locked: true,
			lockText: "An attempt has been made to board up this door. Reaching between the unevenly spaced boards, you try the doorknob and discover that it is also locked."
		},

		"A": {
			name: "Freedom!",
			locked: true,
			closed: true,
			get lockText () {
				return `The formidable wooden front door will not open. It looks as old as the rest of the building, and like the wood panelled walls of the entrance hall, it is dark with countless layers of murky varnish. It is ${this.locked ? "locked" : "unlocked"}.`;
				
			},
			get description () {
				if (game.state.turn < 3) {
					game.captured();
					return "";
				}
				return game.winner("\nYou have escaped!\n");
			},
		},

		"a": {
			name: "Freedom!",
			locked: true,
			closed: true,
			get lockText () {
				return `The kitchen door will not open. It is ${this.locked ? "locked" : "unlocked"}.`;
				
			},
			get description () {
				if (game.state.turn < 3) {
					game.captured();
					return "";
				}
				return game.winner("\nYou have escaped!\n");
			},
		},

		"B": {
			name: "Basement",
			description: "A single dim bulb, dangling on a cord from the low, unfinished ceiling, is barely enough to illuminate the room. The floors appear to be composed of compressed earth, left unfinished since the space was initially excavated more than a century ago.  ",
			smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces.",
			get sound () {
				return `You can hear a dog barking. The sound is emanating from the room north of you. It is loud enough now for you to recognize it as ${game.state.dogName}'s bark!`;
			}
		},

		"C": {
			name: "Dark room",
			hiddenSecrets: true,
			get des1 () {
				return `As you walk into the dark room, it feels as if the increasingly uneven floor is sloping downward, though you can see nothing. \nIt is pitch black. You are likely to be eaten by a grue. \nSomewhere in the dark, you can hear ${game.state.dogName} barking excitedly!`;
			},
			get des2 () {
				return `By the flickering light of the flame, you can see that the floor becomes rougher and more irregular, sloping down toward the north.`;
			},
			smell: "It smells strongly of old, damp dungeon – a mix of dirt and mildew with perhaps a hint of grue feces.",
			get description () {
				return this.hideSecrets ? this.des1 : this.des2;
			},
			hiddenEnv: ["lantern", "basement_door"],
			visibleEnv: ["grue"]
		},

		"D": {
			name: "Bathroom",
			description: "The bathroom is tiled with hundreds of tiny, white, hexagonal tiles. It features the usual bathroom amenities, like a sink, a tub and a commode.",
			visibleEnv: ["sink", "bathtub", "toilet"]
		},
		"E": {
			name: "Guest Room",
			description: "",
			visibleEnv: ["old_key", "bed", "dresser"]
		},
		"F": {
			name: "Sitting room",
			description: "A small sitting room adjoins the master bedroom. It contains a cushioned armchair and a small sofa, both facing a coffee table.",
			visibleEnv: ["chair", "sofa", "coffee_table", "photo"]
			
		},
		"G": {
			name: "Master bedroom",
			get description () {
				return `The master bedroom is spacious though sparsely furnished, containing only a bedframe, a wardrobe and a nightstand`;
			},
			visibleEnv: ["bed", "nightstand", "wardrobe"]
		},
		"H": {
			name: "Master bathroom",
			description: "The bathroom adjoining the bedroom has all of the expected fixtures, though they are corroded and covered in filth. ",
			visibleEnv: ["toilet", "sink", "bathtub"]
		},
		"I": {
			name: "Cell",
			description: "It is a dark and scary cell.",
			locked: true,
			closed: true,
			smell: "It smells like dog waste.",
			get lockText () {
				return `An ominous-looking, rusted steel door blocks your path. It is ${this.locked ? "locked" : "unlocked"}.`;
			},
			visibleEnv: ["dog"],

		},
		"J": {
			name: "Parlor",
			get description () { 
				return `This room looks like it was used to screen films and recordings. There is a tall white pedestal${game.inEnvironment("projector") ? ", supporting a squarish plastic Super 8 projector," : ""} in the center of the room. `
			},
			visibleEnv: ["projector", "screen", "pedestal", "chair", "phonograph"],
		},
		"^": {
			name: "Second floor hallway, north",
			description: "You are at the top of a wide wooden staircase, on the second floor of the old house.",
			visibleEnv: []
		},

		"-": {
			name: "Second floor hallway, south",
			description: "It looks like there are a couple of rooms on either side of the broad hallway, and a small broom closet at the south end.",
			visibleEnv: []
		},

		"+": {
			name: "Study",
			visibleDescription: "The walls of the dark, wood-panelled study are lined with bookshelves, containing countless dusty tomes. Behind an imposing walnut desk is a tall-backed desk chair.",
			smell: "The pleasantly musty smell of old books emanates from the bookshelves that line the wall.",
			hideSecrets: true,
			visibleEnv: ["desk", "painting", "chair", "bookshelves", "books", "drawer", "booklet"],
			hiddenEnv: ["safe"],
			hiddenDescription: "In space where a painting formerly hung there is a small alcove housing a wall safe.",
			get description (){
				if (this.hideSecrets) {
					return this.visibleDescription + "\n" + "On the wall behind the chair hangs an ornately framed painting.";
				}
				return this.visibleDescription + "\n" + "\n" + this.hiddenDescription;
			}
		},

		"#": {
			name: "Staircase landing",
			description: "You are on the landing of a worn oak staircase connecting the first and second floors of the old abandoned house.",
			visibleEnv: ["booklet", /*"card", "survey"*/]
		},

		"%": {
			name: "Entrance hall, south",
			description: "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the north end of the hall is a wide oak staircase that connects the first and second floors of the old house.",
			visibleEnv: ["door", "note"]
		},

		"=": {
			name: "Entrance hall, north",
			description: "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the rear of the hall is a wide oak staircase that connects the first and second floors of the old house.",
			visibleEnv: []
		},

		"@": {
			name: "Stone staircase, top",
			description: "You are at the top of a stone staircase that leads down to the basement. A faint cold draft greets you from below.",
			smell: "A vaguely unfresh scent wafts up from the basement.",
			visibleEnv: ["collar"],
			sound: "You do not hear anything."
		},
		
		"(": {
			name: "Stone staircase, landing",
			description: "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
			smell: "As you descend, the smell of mildew and earth becomes noticeable.",
			sound: "For a moment, you are certain you can hear what sounds like muffled barking, but when you stop moving and strain to hear it again, the sound has stopped."
		},

		")": {
			name: "Stone staircase, bottom",
			description: "You are standing on a stone staircase leading upwards to the first floor.",
			smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces.",
			sound: "You can definitely hear the sound of distant, muffled barking. It is coming from the east!"
		},

		"$": {
			name: "Broom closet",
			hiddenSecrets: true,
			hiddenEnv: ["glove"],
			visibleEnv: ["chain"],
			des1: "The small closet is dark, although you can see a small chain hanging in front of you.",
			get des2 (){
				const hidden = this.hiddenEnv;
				const text = "The inside of this small broom closet is devoid of brooms, or much of anything else, for that matter";
				const plural = hidden.length > 1 ? "y" : "ies";
				return text + (hidden.length ? `, with the exception of ${game.formatList(hidden.map(item => `${item.article} ${item.name}`))} which occup${plural} a dusty corner.`: ".");
			},
			get description (){
				return this.hideSecrets ? this.des1 : this.des2;
			}
		},
		"X": {
			name: "Dining room",
			visibleEnv: ["chair", "table"],
			description: "A long cherry dining table runs the length of this formal dining room."
		},
		"Z": {
			name: "Kitchen",
			visibleEnv: ["maps", "backdoor"],
			description: "It is quite large for a residential kitchen. While only a few of the original appliances remain, gritty outlines on the walls and floor suggest it was once well appointed. Now it is an echoing tile cavern.",
			smell: "It smells like a dusty abandoned building. And chicken soup."
		},
	}

	// every cell defined in mapkey will inherit from MapCell
	Object.keys(mapkey).forEach((cell) => {
		Object.setPrototypeOf(mapkey[cell], MapCell);
	});

	return mapkey;
};

export default mapKey;