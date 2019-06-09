const mapKey = game => {
	// Prototype definition for a single cell on the map grid (usually a room)
	const MapCell = {
		name: "Nowhere", // room name to be displayed by game.currentHeader() 
		locked: false, 
		lockText: "", // text to be displayed when player attempts to enter the locked area (but is prevented)
		unlockText: "", // text to be displayed when area becomes unlocked
		hiddenSecrets: false, // used to toggle room description and whether player has access to hiddenEnv
		get hideSecrets () {
			return game.state.fireCount > 0 ? false : this.hiddenSecrets;
		},
		set hideSecrets (trueOrFalse){
			this.hiddenSecrets = trueOrFalse;
		},
		description: "You find yourself in a non-descript, unremarkable, non-place. Nothing is happening, nor is anything of interest is likely to happen here in the future.", // the default text displayed when player enters or "looks" at room
		smell: "Your nose is unable to detect anything unusual, beyond the smell of mildew and rot that permeates the entirety of the decrepit building.", // text displayed in response to smell command
		sound: "The silence is broken only by the faint sound of the wind outside, and the occasional creak of sagging floorboards underfoot.", // text displayed in response to listen command
		hiddenEnv: [], // items in area that are not described and cannot be interacted with unless hideSecrets = false
		visibleEnv: [], // items described at the end of game.describeSurroundings() text by default
		get env (){ // accessor property returns an array containing the names (as strngs) of the items in present environment
			// if (this.hideSecrets) {
			// 	return this.visibleEnv;
			// }
			// // this.hiddenEnv = [];
			// // return this.visibleEnv;
			// return this.visibleEnv.concat(this.hiddenEnv);
			// eslint-disable-next-line getter-return
			return {
				visibleEnv: this.visibleEnv,
				containedEnv: this.containedEnv,
				hiddenEnv: this.hideSecrets ? [] : this.hiddenEnv
			}
		},
		// set env (newEnv){ // sets accessor property to an array (of strings) of the names of the items in present environment
		// 	return this.visibleEnv = newEnv;
		// },

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

		set containedEnv (newEnv) {

		},

		// nestedItemString: function () {
		// 	const containedItems = this.containedEnv.map(obj => {
		// 		const name = Object.keys(obj)[0];
		// 		const objectNames = obj[name].map(item => `${item.article} ${item.name}`);
		// 		return {[name]: game.formatList(objectNames)};
		// 	});
		// 	const containedString = containedItems.map(container => {
		// 		return `There is ${Object.keys(container)}, containing ${Object.values(container)}.`
		// 	});
        //     return containedString.join("\n");
		// },
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
            
			// return filteredContainer;
		},
		addToEnv: function (itemName) { 
			// const itemObj = game.items[`_${itemName}`];
			// const newEnv = this.env.concat(itemObj)
			// return this.env = newEnv;
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
			locked: false,
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

		"B": {
			name: "Basement",
			description: "A single dim bulb, dangling on a cord from the low, unfinished ceiling, is barely enough to illuminate the room. The floors appear to be composed of compressed earth, left unfinished since the space was initially excavated more than a century ago.  ",
			smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces."
		},

		"C": {
			name: "Dark room",
			hiddenSecrets: true,
			des1: "As you walk into the dark room, it feels as if the increasingly uneven floor is sloping downward, though you can see nothing. \nIt is pitch black. You are likely to be eaten by a grue.",
			get des2 () {

			},
			smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of grue feces.",
			get description () {
				return this.hideSecrets ? this.des1 : this.des2;
			},
			hiddenEnv: ["collar"],
		},

		"^": {
			name: "Second floor hallway, north",
			description: "You are at the top of a wide wooden staircase, on the second floor of the old house.",
			visibleEnv: ["projector"]
		},

		"-": {
			name: "Second floor hallway, south",
			description: "It looks like there are a couple of rooms on either side of the broad hallway, and a small broom closet at the south end.",
			visibleEnv: ["cartridge"]
		},

		"+": {
			name: "Study",
			visibleDescription: "The walls of the dark, wood-panelled study are lined with bookshelves, containing countless dusty tomes. Behind an imposing walnut desk is a tall-backed desk chair.",
			smell: "The pleasantly musty smell of old books emanates from the bookshelves that line the wall.",
			hideSecrets: true,
			visibleEnv: ["desk", "painting", "chair", "bookshelves", "books", "drawer"],
			hiddenEnv: ["safe"],
			hiddenDescription: "In space where a painting formerly hung there is a small alcove housing a wall safe.",
			get description (){
				const catalogLocation = Object.values(this.env).flat().map(x=>x.name).includes("booklet") ? "There is a booklet on the desk" : "";
				if (this.hideSecrets) {
					return this.visibleDescription + "\n" + "On the wall behind the chair hangs an ornately framed painting.";
				}
				return this.visibleDescription + "\n" + "\n" + this.hiddenDescription + "\n" + catalogLocation;
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
			visibleEnv: ["door", "note", "disc"]
		},

		"=": {
			name: "Entrance hall, north",
			description: "You are in the main entrance hall of a seemingly abandoned house. There are two doors on either side of the hall. The front door is to the south. At the rear of the hall is a wide oak staircase that connects the first and second floors of the old house.",
			visibleEnv: ["phonograph"]
		},

		"@": {
			name: "Stone staircase, top",
			description: "You are at the top of a stone staircase that leads down to the basement. A faint cold draft greets you from below.",
			smell: "A vaguely unfresh scent wafts up from the basement."
		},
		
		"(": {
			name: "Stone staircase, landing",
			description: "You are standing on a stone staircase leading to the basement. A faint cold draft greets you from below.",
			smell: "As you descend, the smell of mildew and earth becomes noticeable."
		},

		")": {
			name: "Stone staircase, bottom",
			description: "You are standing on a stone staircase leading upwards to the first floor.",
			smell: "It smells strongly of old, damp basement – a mix of dirt and mildew with perhaps a hint of rodent feces."
		},

		"$": {
			name: "Broom closet",
			hiddenSecrets: true,
			hiddenEnv: ["glove"],
			visibleEnv: ["chain"],
			// get hideSecrets () {
			// 	return game.state.fireCount > 0 ? false : this.hiddenSecrets;
			// },
			// set hideSecrets (trueOrFalse){
			// 	this.hiddenSecrets = trueOrFalse;
			// },
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
			visibleEnv: ["maps"],
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