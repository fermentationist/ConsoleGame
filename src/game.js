import {primaryFont} from "./prefs.js";
import maps from "./maps.js";
import mapKeyModule from "./mapkey.js";
import itemModule from "./items.js";
import commandsList from "./commands.js";
import customConsole from "./console_styles.js";
import {randomDogName} from "./dogNames.js"

let dogName = randomDogName();
// consoleGame.state object stores player position, inventory, number of turns, history of player actions, and some methods to update the object's values.
//todo: rewrite with generators?
const ConsoleGame = {
	maps: [...maps],
	key: {...mapKeyModule(this)},
	timeLimit: 300,
	// weightLimit: 20,
	state: {
		objectMode : false,
		saveMode: false,
		restoreMode: false,
		prefMode: false,
		confirmMode: false,
		solveMode: false,
		abortMode: false,
		verbose: false,
		inventory: [],
		history: [],
		score: 0,
		maxScore: 100,
		turn: null,
		pendingAction: null,
		gameOver: false,
		startPosition: {
			z: 3,
			y: 13,
			x: 7
		},
		position: {
			z: 3,
			y: 13,
			x: 7
		},
		dogName,
		get currentCellCode (){ 
			return ConsoleGame.maps[this.position.z][this.position.y][this.position.x]
		},
		get currentMapCell () {
			return ConsoleGame.mapKey[this.currentCellCode]
		},
		get env (){
			return this.currentMapCell.env;
		},
		get combinedEnv () {
			return Object.values(this.env).flat();
		},
	},
	get mapKey (){
		return this.key;
	},
	set mapKey (value) {
		this.key = value;
	},
	get lightSources() {
		return Object.values(this.items).filter(it => it.proto === "_matchbook" || it.name === "matchbook");
	},
	exemptCommands: ["help", "start", "commands", "inventory", "inventorytable", "look", "font", "color", "size", "save", "restore", "resume", "verbose", "_save_slot", "yes", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9"],
	   
	  //=========================================\\
	turnDemon: function (commandName, interpreterFunction) {
    // This function runs at the start of each turn\\
		if (this.state.gameOver) {
			return console.codeInline(["[Game over. Please type ", "start ", "to begin a new game.]"]);
		}
		if (window.CONSOLE_GAME_DEBUG) {
			window.debugLog.push({userInput: commandName});
		}
		try {
			let dontCountTurn = this.exemptCommands.includes(commandName);
			if (dontCountTurn) {// execute exempt commands without incrementing turn counter or timers, and without recording in history
				interpreterFunction(commandName);// execute the command and exit function
				return this.state.verbose ? this.describeSurroundings(): null;
			}

			interpreterFunction(commandName);// execute the command
			this.addToHistory(commandName);// record command in history

			if (!this.state.objectMode && !this.state.abortMode) {// only increment turn and timers if not in objectMode (prevents two-word commands from taking up two turns), and if not in abortMode (prevent a failed movement attempt, i.e. trying to move 'up' when you are only able to move 'east' or 'west', from consuming a turn)
				this.timers();
				this.state.turn++;
			}

			this.state.abortMode = false;// reset abortMode
			if (this.state.verbose) {
				this.describeSurroundings();
			}
			return;
		}
		catch (err){
			// recognized command word used incorrectly
			return console.p(`That's not going to work. Please try something else.`);
		}
	},
	
	addToHistory: function (commandName){// Method adds executed command to history and increments turn counter.
		this.state.history.push(commandName);
		window.localStorage.setItem("ConsoleGame.history", this.state.history);
	},

	replayHistory: function (commandList){// Used to load saved games
		this.state.restoreMode = false;
		this.initializeNewGame();
		console.groupCollapsed("Game loading...");// This conveniently hides all of the console output that is generated when the history is replayed, by nesting it in a group that will be displayed collapsed by default
		commandList.split(",").map((command) =>{// replay each command in order
			(Function(`${command}`))();// execute the command
		});
		return console.groupEnd("Game loaded.");// text displayed in place of collapsed group
	},
	
	addToInventory: function (itemArray){// add one of more items to player inventory
		itemArray.map((item) => {
			if (item instanceof String){// accepts a string argument for a single item
				return this.state.inventory.push(this.items[`_${item}`]);
			}
			return this.state.inventory.push(item);// accepts an array for multiple items
		});
	},

	removeFromInventory: function (item){// remove item from player inventory
		this.state.inventory.splice(this.state.inventory.indexOf(item), 1);
	},

	resetGame: function (){// reset game state and delete game data stored in localStorage
		this.state.objectMode = false;
		this.state.saveMode = false;
		this.state.restoreMode = false;
		this.state.prefMode = false;
		this.state.confirmMode = false;
		this.state.solveMode = false;
		this.state.abortMode = false;
		this.state.verbose = false;
		this.state.inventory = [];
		this.state.history = [];
		this.state.turn = 0;
		this.state.score = 0;
		this.state.gameOver = false;
		this.state.pendingAction = null;
		this.state.position = this.state.startPosition;
		dogName = randomDogName();
		this.state.dogName = dogName; 
		window.localStorage.removeItem("ConsoleGame.history");
		return;
	},
	
	formatList: function (itemArray, disjunction = false){// Utility function formats a given list of terms (directions) as a string, separating them with commas, and a conjunction ("and"), or a disjunction ("or"), before the final term.
		const length = itemArray.length;
		const conjunction = disjunction ? "or" : "and";
		if (length === 0) {
			return "nothing";
		}
		if (length === 1) {
			return itemArray[0];
		} 
		if (length === 2) {
			return `${itemArray[0]} ${conjunction} ${itemArray[1]}`;
		}
		return `${itemArray[0]}, ${this.formatList(itemArray.slice(1), disjunction)}`
	},

	cases: function (...wordArgs) {// utility function accepts one or multiple string arguments, and returns [all lowercase], [Capitalized first letter], and [ALL CAPS] variations
		let lc, cases;
		const casesArray = wordArgs.map((word) =>{
			lc = word.toLowerCase();
			cases = [lc, `${lc.charAt(0).toUpperCase()}${lc.slice(1)}`, lc.toUpperCase()];
			return word.length ? cases: "";
		});
		return casesArray.join(",");// output is a single string, with variations separated by commas
	},
	
	possibleMoves: function (z, y, x){// Returns an array of directions (as strings) that player can move in from present location.
		const n = (maps[z][y - 1] !== undefined && maps[z][y - 1][x] !== "*") ? "north" : false;// will equal the string "north" if it is possible to move one cell north, otherwise false
		const s = (maps[z][y + 1] !== undefined && maps[z][y + 1][x] !== "*") ? "south" : false;
		const e = (maps[z][y][x + 1] !== undefined && maps[z][y][x + 1] !== "*") ? "east" : false;
		const w = (maps[z][y][x - 1] !== undefined && maps[z][y][x - 1] !== "*") ? "west" : false;
		const u = (maps[z + 1] !== undefined && maps[z + 1][y][x] !== "*") ? "up" : false;
		const d = (maps[z - 1] !== undefined && maps[z - 1][y][x] !== "*") ? "down" : false;
		let options = [n, s, e, w, u, d];
		let result = options.filter(dir => dir);
		return result;
	},

	movementOptions: function (){// Applies this.formatList() utility function to the result of possibleMoves() function to return a formatted string listing the possible directions of player movement.
		return this.formatList(this.possibleMoves(this.state.position.z, this.state.position.y, this.state.position.x), true);
	},

	describeSurroundings: function (){// function puts together various parts of game description, and outputs it as a single string
		const description = this.state.currentMapCell.description;
		const itemStr = this.itemsInEnvironment() ? `You see ${this.itemsInEnvironment()} here.` : "";
		const nestedItemStr = this.nestedItemString(); 
		const moveOptions = `You can go ${this.movementOptions()}.`;
		console.header(this.currentHeader());
		return console.p(description + "\n" + moveOptions + "\n" + itemStr + "\n" + nestedItemStr);
	},

	currentHeader: function (columnWidth = 80){
		const roomName = this.state.currentMapCell.name;
		const turn = `Turn : ${this.state.turn}`;
		const gapSize = columnWidth - roomName.length - turn.length;
		const gap = " ".repeat(gapSize);
		return `\n${roomName}${gap}${turn}\n`;
	},

	inInventory: function (itemName){
		if (itemName === "all") {
			return this.items._all;
		}
		const invIndex = this.state.inventory.map((item) => item.name).indexOf(itemName);
		const objectFromInventory = invIndex !== -1 && this.state.inventory[invIndex];
		return objectFromInventory;
	},

	inEnvironment: function (itemName){
		if (itemName === "all") {
			return this.items._all;
		}
		const whichEnv = this.fromWhichEnv(itemName);
		const objectFromEnvironment = whichEnv ?  this.state.env[whichEnv].filter(item => item.name === itemName)[0] : false;
		return objectFromEnvironment;
	},

	fromWhichEnv: function (itemName) {
		const itemsInEnvironment = this.state.combinedEnv.map(item => item.name);
		if (!itemsInEnvironment.includes(itemName)){            
			return false;
		}
		const environments = Object.entries(this.state.env).map(entry => {
			const names = entry[1].length ? entry[1].map(item => item.name) : [];
			return [entry[0], names]
		});
		const theEnv = environments.filter(env => env[1].includes(itemName));
		return theEnv.length > 0 ? theEnv[0][0] : "containedEnv";
	},

	// returns a list of items available in the environment, as a formatted string
	itemsInEnvironment: function () {
		const env = this.state.currentMapCell.hideSecrets ? this.state.env.visibleEnv : this.state.env.visibleEnv.concat(this.state.env.hiddenEnv);
		const listedItems = env.filter(item => item.listed);
		return listedItems.length && this.formatList(listedItems.map((item) => `${item.article} ${item.name}`));
	},

	// returns a list of items available in the environment that are nested inside other objects, as a formatted string
	nestedItemString: function () {
		const openContainers = this.state.currentMapCell.openContainers;
        
		const containedItems = openContainers.map(obj => {

			const name = `${obj.article} ${obj.name}`;// the name of the container
			const objectNames = obj.contents.map(item => `${item.article} ${item.name}`);// array of names of the objects inside the container (with articles)
			return [name, this.formatList(objectNames)];
		});
        
		const containedString = containedItems.map(container => {
			return `There is ${container[0]}, containing ${container[1]}.`
		});
		return containedString.join("\n");
	},

	displayItem: function (galleryItem = {title: "untitled", artist: "unknown", info: null, source: "", dimensions: null}) {
		const contentDiv = document.getElementById("console-game-content");
		contentDiv.innerHTML = "";
		contentDiv.setAttribute("style", "width:100vw;background-color:#D1D1D1;padding-top:75%;position:relative;display:flex;flex-direction:column;justify-content:center;align-content:center;")
		const iFrame = document.createElement("iframe")
		iFrame.src = galleryItem.source;
		
		iFrame.autoplay = true;
		iFrame.setAttribute("style", "width:50vw;height:37.5vw;background-color:gray;top:0;position:sticky;position:absolute;msrgin-left:auto;");
		const p = document.createElement("p");
		// p.setAttribute("style", "text-align:center;");
		const title = document.createElement("h2");
		title.setAttribute("style", "color:black;");
		const artist = title.cloneNode(true);
		title.innerHTML = `Title: ${galleryItem.title}`;
		artist.innerHTML = `Artist: ${galleryItem.artist}`;
		p.appendChild(title);
		p.appendChild(artist);
		contentDiv.appendChild(iFrame);
		contentDiv.appendChild(p);
		if (galleryItem.info) {
			const info = document.createElement("p");
			info.innerHTML = galleryItem.info;
			info.setAttribute("style", "color:black;font-style:italic;font-size:1em;padding-bottom:2em;");
			contentDiv.appendChild(info);
		}
		// window.scrollTo(0, 10000);
	},

	timers: function () {
		//add any timer logic here
		if (this.state.turn === 2 && ! this.items._door.locked) {
			console.p("You hear a short metallic scraping sound, ending in a click. It sounds like the front door being locked from the outside.\n");

			this.items._door.closed = true;
			this.items._door.locked = true;
			this.mapKey[this.items._door.lockedTarget].locked = true;
			this.mapKey[this.items._door.closedTarget].closed = true;
		}
		if (this.state.turn >= this.timeLimit && ! this.state.gameOver) {
			return this.dead("You don't feel so well. It never occurs to you, as you crumple to the ground, losing consciousness for the final time, that you have been poisoned by an odorless, invisible, yet highly toxic gas.");
		}
		this.lightSources.forEach(source => source.decrementCounter());
		if (this.inEnvironment("grue")) {
			this.items._grue.lurk();
		}
	},
	dead: function (text) {
		console.p(text);
		console.p("You have died. Of course, being dead, you are unaware of this unfortunate turn of events. In fact, you are no longer aware of anything at all.");
		window.localStorage.removeItem("ConsoleGame.history");
		this.state.gameOver = true;
		console.codeInline(["[Game over. Please type ", "start ", "to begin a new game.]"]);
	},
	captured: function () {
		console.p("As you step out onto the front porch, you struggle to see in the bright midday sun, your eyes having adjusted to the dimly lit interior of the house. You hear a surprised voice say, \"Hey! How did you get out here?!\" You spin around to see the source of the voice, but something blunt and heavy has other plans for you and your still aching skull. You descend back into the darkness of sleep.");
		this.state.position = this.state.startPosition;
		this.state.turn += 3;
		for (let i = 0; i < 3; i++) {
			window.wait;
		}
		this.items._door.closed = true;
		this.items._door.locked = true;
		this.mapKey[this.items._door.lockedTarget].locked = true;
		this.mapKey[this.items._door.closedTarget].closed = true;
		console.p("Groggily, you lift yourself from the floor, your hands probing the fresh bump on the back of your head.");
	},
	winner: function (text) {
		if (text) {
			console.p(text);
		}
		console.win("You win!! Congratulations and thanks for playing!");
		window.score;
		window.localStorage.removeItem("ConsoleGame.history");
		this.state.gameOver = true;
		console.codeInline(["[Game over. Please type ", "start ", "to begin a new game.]"]);
	},
	_restore: function (command) {
		let keys = Object.keys(localStorage);
		let saves = keys.filter((key) => {
			return key.indexOf("ConsoleGame.save") !== -1;
		});
		if (saves.length > 0) {
			let slotList = saves.map((save) => {
				let x = save.substring(save.length - 2);
				return x;
			})
			console.codeInline(["saved games:\n", slotList]);
			this.state.restoreMode = true;
			this.state.saveMode = false;
			this.state.pendingAction = command;
			const infoStyle = `font-size:100%;color:#75715E;font-family:${primaryFont};`;
			const boldInfo = infoStyle + `font-weight:bold;color:white`;
			console.info("Please choose which slot number (0 – 9) to restore from. To restore, type an underscore, ", "_ ", "immediately followed by the slot number.");
			return console.codeInline([`For example, type `, `_3`, ` to select slot 3.`]);
		}
		return console.invalid("No saved games found.");
	},

	_restoreGame: function (slotName){
		this.state.restoreMode = false;
		let saveData = localStorage.getItem(`ConsoleGame.save.${slotName}`);
		this.resetGame();
		this.replayHistory(saveData);
		return this.describeSurroundings();
	},

	_save: function (command)  {
		this.state.saveMode = true;
		this.state.restoreMode = false;
		this.state.pendingAction = command;
		const infoStyle = `font-size:100%;color:#75715E;font-family:${primaryFont};`;
		const boldInfo = infoStyle + `font-weight:bold;color:white`;
		console.info("Please choose a slot number (_0 through _9) to save your game. To save to the selected slot, type an underscore, immediately followed by the slot number.");
		console.codeInline([`For example, type `, `_3`, ` to select slot 3.`]);
	},

	_save_slot: function (slotNumber)  {
		if (this.state.saveMode){
			try {
				return this._saveGame(slotNumber);
			}
			catch (err) {
				console.invalid(`Save to slot ${slotNumber} failed.`);
				return console.trace(err);
			}
		} else if (this.state.restoreMode){
			
			try {
				this._restoreGame(slotNumber);
				return this.state.restoreMode = false;
			} 
			catch (err) {
				console.invalid(`Restore from slot ${slotNumber} failed.`);
				return console.trace(err);
			}
		} else {
			console.invalid("Operation failed.");
		}
	},

	_saveGame: function (slot) {
		const slotName = `ConsoleGame.save.${slot}`;
		if (localStorage.getItem(slotName) && !this.state.confirmMode) {
			// this.state.confirmMode = true;
			// return console.invalid("That save slot is already in use. Type \"yes\" to overwrite it or enter a different save slot.")
			console.invalid("That save slot is already in use.");
			console.codeInline([`type `, `yes `, `to overwrite slot ${slot} with current game data.` ]);
			this.state.confirmMode = true;
			this.confirmationCallback = () => this._saveGame(slot);
			return;
		}
		this.state.saveMode = false;
		this.state.confirmMode = false;
		try {
			localStorage.setItem(slotName, this.state.history);
			console.info(`Game saved to slot ${slot}.`);
			this.describeSurroundings();
		}
		catch (err) {
			return console.invalid(`Save to slot ${slot} failed.`)
		}
	},

	// Reload window (and game)
	_quit: function () {
		this.resetGame();
		// location.reload();
		return "reloading...";
	},


	// Applies bindCommandToFunction() to an array of all of the commands to be created.
	initCommands: function (commandsArray){
		commandsArray.map(commandEntry => {
			let [interpreterFunction, aliases] = commandEntry;
			this.bindCommandToFunction(interpreterFunction, aliases);
		});
	},

	// This function creates a global variable with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the variable. This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
	// Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his console adventure here: https://rawgit.com/secretGeek/console-adventure/master/console.html
	// It creates a new, one-word command in the interpreter. It takes in the function that will be invoked when the command is entered, and a comma-separated string of command aliases (synonyms). The primary command will be named after the first name in the string of aliases.
	bindCommandToFunction: function (interpreterFunction, commandAliases, daemon=this.turnDemon){
		const aliasArray = commandAliases.split(",");
		const commandName = aliasArray[0];
		const interpretCommand = daemon ? daemon.bind(this, commandName, interpreterFunction): interpreterFunction.bind(this, commandName);
		try {
			aliasArray.map(alias => {
				// The following (commented-out) line was causing a bug
				// Object.defineProperty(globalThis, alias.trim(), {get: interpretCommand});
				Object.defineProperty(globalThis, alias.trim(), {
					get () {
						interpretCommand();
					}
				});
			});
		} catch (err) {
			// fail silently
		}
	},
	
	bindInitialCommands: function () {
		const initialCommands = [
			[this._start, this.cases("start", "begin")],
			[this._resume, this.cases("resume")],
			[this._help, this.cases("help") + ",h,H,ayuda"],
			[this._restore, this.cases("restore", "load")],
			[this._quit, this.cases("quit", "restart")],
			[this._save, this.cases("save")],
			[this._save_slot, "_0"],
			[this._save_slot, "_1"],
			[this._save_slot, "_2"],
			[this._save_slot, "_3"],
			[this._save_slot, "_4"],
			[this._save_slot, "_5"],
			[this._save_slot, "_6"],
			[this._save_slot, "_7"],
			[this._save_slot, "_8"],
			[this._save_slot, "_9"],
		]
		initialCommands.map(command => {
			const [interpreterFunction, aliases] = command;
			this.bindCommandToFunction(interpreterFunction, aliases, null);
		});
	},
	setPreference: function (value){
		console.info(`value for ${this.state.pendingAction} will be set to ${value}`);
		localStorage.setItem(`ConsoleGame.prefs.${this.state.pendingAction}`, value);
		localStorage.setItem("ConsoleGame.prefMode", "true");
		location.reload();
	},
	solveCode: function (value){
		this.state.solveMode = false;
		const puzzles = this.state.combinedEnv.filter(item => item.solution);
		if (puzzles.length < 1) {
			return;
		}
		const solved = puzzles.filter(puzzle => puzzle.solution === value);
		if (solved.length === 0){
			puzzles.forEach(unsolved => unsolved.incorrectGuess());
			return;
		}
		solved.forEach(pzl => pzl.correctGuess());
		return;
	},

	unfinishedGame: function () {
		return window.localStorage.getItem("ConsoleGame.history");
	},
	intro: function (){
		// Greeting to be displayed at the beginning of the game
		const intro_1 = "\nWelcome!\nAs a fan of old Infocom™ interactive fiction games, I thought it would be fun to hide a text adventure in the browser's JavaScript console. Try it out by typing in the console below. Have fun!\n";
		console.title("consoleGame");
		console.custom("by Dennis Hodges\ncopyright 2019", "font-size:100%;color:lightgray;padding:0 1em;");
		console.intro(intro_1);
		console.codeInline(this.introOptions());
	},

	introOptions: function (){
		const existingGame= [
			"[ It looks like you have an unsaved game in progress from a previous session. If you would like to continue, type ",
			"resume",
			". If you would like to load a saved game, type ",
			"restore",
			". To begin a new game, please type ",
			"start",
			". ]"
		];
		const commonOptions = [
			"[ Please type ",
			"help ",
			"for instructions, ",
			// "commands ",
			// "for a list of available commands, ",
			"restore ",
			"to load a saved game, or ",
		];
		const options = [
			...commonOptions,
			"resume ",
			"to resume the game. ]"
		];
		const initialOptions = [
			...commonOptions,
			"start ",
			"to start the game. ]"
		];
		if (this.state.turn === null) {
			return this.unfinishedGame() ? existingGame : initialOptions;
		}
		return options;
	}, 
	preface: function () {
		console.p("You slowly open your eyes. Your eyelids aren't halfway open before the throbbing pain in your head asserts itself. The last thing you can remember is taking your dog for a walk. Your current surroundings look entirely unfamiliar.");
	},
	stockDungeon: function (subEnvName){
		Object.keys(this.mapKey).map((key) => {
			let roomEnv = this.mapKey[key][subEnvName];
			let newEnv = [];
			if (roomEnv.length){
				roomEnv.forEach((item) => {
					let itemObj = typeof item === "string" ? this.items[`_${item}`] : item;
					if (itemObj) {
						newEnv.push(itemObj);
						return;
					}
					console.log(`Cannot stock ${item}. No such item.`);
				});
			}
			this.mapKey[key][subEnvName] = newEnv;
			return newEnv;
		});
	},

	initializeNewGame: function () {
		this.resetGame();
		this.state.dogName = dogName;
		this.items = {...new itemModule(this)};
		this.mapKey = {...new mapKeyModule(this)};
		this.commands = [...new commandsList(this)];
		this.initCommands(this.commands);
		this.stockDungeon("hiddenEnv");
		this.stockDungeon("visibleEnv");
		this.items._glove.contents.push(this.items._matchbook);
		this.items._safe.contents.push(this.items._key, this.items._scroll);
		this.items._drawer.contents.push(this.items._film);
		this.items._nightstand_drawer.contents.push(this.items._old_key);
		this.items._wardrobe.contents.push(this.items._grue_repellant);
		this.items._dresser_drawer.contents.push(this.items._booklet);
		this.addToInventory([this.items._no_tea]);
	},

	_start: function () {
		if (this.state.turn < 1 || this.state.gameOver){
			this.initializeNewGame();
		}
		this.preface();
		return this.describeSurroundings();
	},

	_resume: function () {
		const unfinishedGame = this.unfinishedGame();
		this.state.prefMode = false;
		if (unfinishedGame) {
			this.replayHistory(unfinishedGame);
			this.describeSurroundings();
			return;
		}
		if (this.state.turn) {
			this.describeSurroundings();
			return;
		}
		this._start();
	},

	_help: function () {
		// Greeting to be displayed at the beginning of the game
		const baseStyle = `font-family:${primaryFont};color:pink;font-size:105%;line-height:1.5;`;
		const italicCodeStyle = "font-family:courier;color:#29E616;font-size:115%;font-style:italic;line-height:2;";
		const codeStyle = "font-family:courier;color:#29E616;font-size:115%;line-height:1.5;";
		const text = ["Valid commands are one word long, with no spaces. Compound commands consist of at most two commands, separated by a carriage return or a semicolon. For example:\n", "get\n", "What would you like to take?\n", "lamp\n", "You pick up the lamp.\n","or,\n", "get;lamp\n", "What would you like to take?\nYou pick up the lamp."];
		const styles = [baseStyle, codeStyle, italicCodeStyle, codeStyle, italicCodeStyle, baseStyle, codeStyle, italicCodeStyle];
		console.inline(text, styles);
		const text_2 = ["Typing ", "inventory ", "or ", "i ", "will display a list of any items the player is carrying. \nTyping ", "look ", "or ", "l ", "will give you a description of your current environs in the game. \nCommands with prepositions are not presently supported, and ", "look ", "can only be used to \"look around\", and not to \"look at\" something. Please instead use ", "examine ", "or its shortcut ", "x ", "to investigate an item's properties. \nThe player may move in the cardinal directions– ", "north", ", ", "south", ", ", "east", " and ", "west ", "as well as ", "up ", "and ", "down. ", "Simply type the direction you want to move. These may be abbreviated as ", "n", ", ", "s", ", ", "e", ", ", "w", ", ", "u ", "and ", "d ", ", respectively."];
		console.codeInline(text_2, baseStyle, codeStyle);
		const text_3 = ["You may save your game progress (it will be saved to localStorage) by typing ", "save", ". You will then be asked to select a save slot, ", "_0 ", "through ", "_9 ", "(remember, user input can't begin with a number). Typing ", "help ", "will display the in-game help text."];
	
		console.codeInline(text_3, baseStyle, codeStyle);
		console.codeInline(this.introOptions(this.state.turn));
	},
	toggleVerbosity: function () {
		if (this.state.verbose) {
			this.state.verbose = false;
			console.p("Verbose mode off.");
			return;
		}
		this.state.verbose = true;
		console.p("Maximum verbosity.");
	},
	_commands: function () {
		const commands = this.commands.map(cmd => {
			const [fn, aliases] = cmd;
			return aliases;
		});
		const commandTable = {};
		commands.forEach(commandString => {
			const splitString = commandString.split(",");
			const [commandName, aliases] = [splitString.shift(), splitString.join(", ")];
			commandTable[commandName] = aliases;
		});
		console.table(commandTable);
	},
	setValue: function (value) {
		return this.state.solveMode ? this.solveCode(value) : this.state.prefMode ? this.setPreference(value) : console.invalid("setValue _() called out of context.");
	}
}

export default ConsoleGame;

export const init = () => {
	// this function enables user to set preferences
	window._ = ConsoleGame.setValue.bind(ConsoleGame);
	// enable "start" and other essential commands contained in ConsoleGame, but not imported commands
	ConsoleGame.bindInitialCommands();
}