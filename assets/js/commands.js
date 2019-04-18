// IIFE returns commands and related aliases, with the functions they will be bound to
var ALIASES;
const Commands = (game) => {
	// Command functions

	// Reload window (and game)
	const _quit = () => {
		location.reload();
		return "reloading...";
	}

	// Change player's location on the map, given a direction
	const _move = (direction) => {
		let newPosition = {
			x: game.state.position.x,
			y: game.state.position.y,
			z: game.state.position.z
		}
		switch (direction){
			case "north":
				newPosition.y = newPosition.y - 1;
				break;
			case "south":
				newPosition.y = newPosition.y + 1;
				break;
			case "east":
				newPosition.x = newPosition.x + 1;
				break;
			case "west":
				newPosition.x = newPosition.x - 1;
				break;
			case "up":
				newPosition.z = newPosition.z + 1;
				break;
			case "down":
				newPosition.z = newPosition.z - 1;
				break;
		}
		// Exit function if movement in given direction is not possible
		if (maps[newPosition.z][newPosition.y][newPosition.x] === "*"){
			return console.p("You can't go that direction");
		}
		// If movement in direction is possible, update player position
		console.p(`You walk ${direction}...`);
		game.state.position = {
			x: newPosition.x,
			y: newPosition.y,
			z: newPosition.z,
		}
		return game.describeSurroundings();
	}

	// Describe environment and movement options in current location
	const _look = (command) => {
		return game.describeSurroundings();
	}
 
	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.                               
	const _act_upon = (command) => {
		game.state.objectMode = true;
		game.state.pendingAction = command;
		return console.p(`What is it you would like to ${command}?`);
	}

	// change to console.info
	const _pref = (whichPref) => {
		game.state.prefMode = true;
		game.state.pendingAction = whichPref;

		const pStyle = `font-size:120%;color:#32cd32;font-family:${primaryFont}`;
		const italic = `font-size:120%;color:#32cd32;font-style:italic;font-family:${primaryFont}`;
		const bold = `font-size:120%;color:#32cd32;font-style:bold;font-family:${primaryFont}`;
		const example = `font-size:120%;color:#7BF65E;font-weight:bold;font-family:${primaryFont}`;
		const exampleItalic = `font-size:120%;color:#7BF65E;font-style:italic;font-weight:bold;font-family:${primaryFont}`;
		console.p(`Enter value for ${whichPref}.`);
		console.inline([`Value must be entered`,` within parentheses (and quotes, if the value is a string), and immediately preceded by an underscore.`],[pStyle, italic]);
		return console.inline([`Like this:  `, `_(`, `"value"`, `)`], [bold, example, exampleItalic, example]);
	}

	const _wait = () => {
		return console.p("Time passes...");
	}

	// Displays items in the player's inventory.
	const _inventory = (command) => {

		let items = [], itemsPlusArticles = [];

		game.state.inventory.map((item) => {
			items.push(item.name)
			const itemWithArticle = item.article ? `${item.article} ${item.name}` :  item.name;
			itemsPlusArticles.push(itemWithArticle);
		});

		let segments =  `You are carrying ${game.formatList(itemsPlusArticles)}`.split(" ");
		let pStyle = `font-size:120%;color:#32cd32;font-family:${primaryFont};`;
		let itemStyle = `font-size:120%;color:cyan;font-style:italic;font-family:${primaryFont};`;

		let styles = segments.map((word) => {
			let style = pStyle;
			items.map((thing) => {
				if (word.includes(thing)){
					style = itemStyle;
				}
			});
			return style;
		});

		segments = segments.map((word, i) => {
			return i === segments.length - 1 ? `${word}.` : `${word} `;
		});
		return console.inline(segments, styles);
	}

	// Displays inventory as a table.
	const _inventoryTable = (command) => {
		const [name, description] = game.state.inventory;
		return console.table([name, description], ["name", "description"]);
}

	// Handles commands that are item names.
	const _items = (itemName) => {
		// Exit function with error message if previous command does not require an object
		if (!game.state.objectMode){
			return console.p("Invalid command");
		}
		// Exit function with error message if item is not available in player inventory or current location.
		const item = game.inEnvironment(itemName) || game.inInventory(itemName);
		if (!item){
			return console.p(`${itemName} is not available`);
		}
		const action = game.state.pendingAction;
		// invoke the item's method that corresponds to the selected action
		return item[action]();
	}

	const _save = (command) => {
		game.state.saveMode = true;
		game.state.restoreMode = false;
		game.state.pendingAction = command;
		console.log('game.state.pendingAction', game.state.pendingAction)
		const infoStyle = `font-size:100%;color:#75715E;font-family:${primaryFont};`;
		const boldInfo = infoStyle + `font-weight:bold;color:white`;
		console.info("Please choose a slot number (0 – 9) to save your game. To save to the selected slot, type an underscore, immediately followed by the slot number.");
		console.inline([`For example, type `, `_3`, ` to select slot 3.`],[infoStyle, boldInfo, infoStyle]);
	}

	const _restore = (command) => {
		let keys = Object.keys(localStorage);
		let saves = keys.filter((key) => {
			return key.indexOf("ConsoleGame.save") !== -1;
		});
		if (saves.length > 0) {
			let slotList = saves.map((save) => {
				let x = save.substring(save.length - 2);
				return x;
			})
			console.info(`saved games:\n${slotList}`);
			game.state.restoreMode = true;
			game.state.saveMode = false;
			game.state.pendingAction = command;
			const infoStyle = `font-size:100%;color:#75715E;font-family:${primaryFont};`;
			const boldInfo = infoStyle + `font-weight:bold;color:white`;
			console.info("Please choose which slot number (0 – 9) to restore from. To restore, type an underscore, immediately followed by the slot number.");
			return console.inline([`For example, type `, `_3`, ` to select slot 3.`],[infoStyle, boldInfo, infoStyle]);
		}
		return console.info("No saved games found.");
	}

	const _save_slot = (slotNumber) => {
		if (game.state.saveMode){
			console.invalid(`Save to slot ${slotNumber} failed.`);
			return game.state.saveMode = false;
		} else if (game.state.restoreMode){
			console.invalid(`Restore from slot ${slotNumber} failed.`);
			return game.state.restoreMode = false;
		}
		return console.p(`Game saved to slot ${slotNumber}`);
	}

	const _poof = () => {
		const body = document.querySelector("body");
		body.parentNode.removeChild(body);
		return console.papyracy(">poof<");
	}

	const _start = () => {
		game.start();
	}

	const _help = () => {
		// Greeting to be displayed at the beginning of the game
		const baseStyle = "font-family:helvetica;color:thistle;font-size:110%";
		const codeStyle = "color:#29E616;font-size:115%;";
		const text_1 = [
			"Due to the limitations of the browser console as a medium, the commands you may enter can only be one-word long, with no spaces. \nHowever, two-word commands may be constructed on two separate lines. For example, if you wanted to examine the glove, you would first type ",
			"examine ",
			"to which the game would respond ",
			"What is it you would like to examine? ",
			"Then you would type the object of your intended action, ",
			"glove",
			", to complete the command."
		];
		console.codeInline(text_1, baseStyle, codeStyle)
		const text_2 = [
			"Alternately, you may enter both words on the same line, provided they are separated with a semicolon and no spaces, i.e ",
			"examine;glove"
		]
		console.codeInline(text_2, baseStyle, codeStyle);
		console.log("is game?", game.state.turn);
		console.codeInline(game.introOptions(game.state.turn));
	}

	const _commands = () => {
		console.log("commands...\n");
		// console.log(aliases);
		const commands = aliases.map(alias => {
			return alias[1];
		});
		const commandTable = {};
		commands.forEach(commandString => {
			const splitString = commandString.split(",");
			const [commandName, aliases] = [splitString.shift(), splitString.join(", ")];
			commandTable[commandName] = aliases;
		});
		console.table(commandTable);
	}

	const cases = (...wordArgs) => {
		let lc, cases;
		const casesArray = wordArgs.map((word) =>{
			lc = word.toLowerCase();
			cases = [lc, `${lc.charAt(0).toUpperCase()}${lc.slice(1)}`, lc.toUpperCase()];
			return word.length ? cases: "";
		});
		return casesArray.join(",");
	}

	const aliasString = (word, thesaurus = null, optionalString = "") => {
		// thesaurus will be added to params
		let variations = [];
		if (thesaurus){
			const synonyms = thesaurus[word] || [];
			variations = synonyms.filter((synonym) => {
				if (synonym.indexOf(" ") === -1){
					return cases(synonym);
				}
			});
		}
		return `${cases(word)},${variations.join()}${optionalString ? "," +optionalString : ""}`;
	}



	// console.log(aliasString("take", thesaurus));

	// Command aliases
	const aliases = [
		// Start
		[_start, cases("start")],
		// Move
		[_move, cases("north") + ",n,N"],
		[_move, cases("south") + ",s,S"],
		[_move, cases("east") + ",e,E"],
		[_move, cases("west") + ",w,W"],
		[_move, cases("up") + ",u,U"],
		[_move, cases("down") + ",d,D"],

		// Actions
		[_wait, cases("wait") + ",z,Z"],
		[_look, cases("look", "see", "observe") + ",l,L"],
		[_inventory, cases("inventory") + ",i,I"],
		[_act_upon, aliasString("use", thesaurus)],
		[_act_upon, aliasString("take", thesaurus)],
		[_act_upon, aliasString("read", thesaurus)],
		[_act_upon, aliasString("examine", thesaurus, "x,X")],
		[_act_upon, aliasString("drink", thesaurus)],
		[_act_upon, aliasString("drop", thesaurus)],
		[_act_upon, aliasString("pull", thesaurus)],
		[_act_upon, aliasString("spray", thesaurus)],
		[_act_upon, aliasString("contemplate", thesaurus)],
		[_act_upon, cases("hide")],

		// Objects
		[_items, cases("grue_repellant", "repellant")],
		[_items, cases("key")],
		[_items, aliasString("note", thesaurus)],
		[_items, cases("no_tea")],
		[_items, cases("chain")],
		[_items, aliasString("glove", thesaurus)],
		[_items, cases("catalogue", "catalog")],



		// Misc
		[_inventoryTable, cases("inventoryTable", "invTable", "invt")],
		[_help, cases("help") + ",h,H"],
		[_commands, cases("commands") + ",c,C"],

		// [_all, cases("all")],
		[_save, cases("save")],
		[_save_slot, "_0,save0,Save0,SAVE0"],
		[_save_slot, "_1,save1,Save1,SAVE1"],
		[_save_slot, "_2,save2,Save2,SAVE2"],
		[_save_slot, "_3,save3,Save3,SAVE3"],
		[_save_slot, "_4,save4,Save4,SAVE4"],
		[_save_slot, "_5,save5,Save5,SAVE5"],
		[_save_slot, "_6,save6,Save6,SAVE6"],
		[_save_slot, "_7,save7,Save7,SAVE7"],
		[_save_slot, "_8,save8,Save8,SAVE8"],
		[_save_slot, "_9,save9,Save9,SAVE9"],
		[_restore, cases("restore", "load")],
		[_pref, cases("font")],
		[_pref, cases("color")],
		[_poof, cases("poof")],
		[_quit, cases("quit")],
		[_quit, cases("restart")]
	];
	ALIASES = aliases;
	return aliases;
};//)();
