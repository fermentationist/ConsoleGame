import {primaryFont} from "./prefs.js";
import maps from "./maps.js";
import mapKeyModule from "./mapkey.js";
import itemModule from "./items.js";
import commandsList from "./commands.js";
import customConsole from "./console_styles.js";
import spells from "./spells.js";

// consoleGame.state object stores player position, inventory, number of turns, history of player actions, and some methods to update the object's values.
//todo: rewrite with generators?
const ConsoleGame = {
	maps: [...maps],
	key: {...mapKeyModule(this)},
	timeLimit: 100,
	// weightLimit: 20,
	state: {
		objectMode : false,
		saveMode: false,
		restoreMode: false,
		prefMode: false,
		confirmMode: false,
		solveMode: false,
		fireCount: 0,
		inventory: [],
		history: [],
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
		get currentCell (){ 
			return ConsoleGame.maps[this.position.z][this.position.y][this.position.x]
		},
		get env (){
			return ConsoleGame.mapKey[this.currentCell].env;
		},
		
	},
	get mapKey (){
		return this.key;
	},
	set mapKey (value) {
		this.key = value;
	},
	immuneCommands: ["help", "start", "commands", "inventory", "inventorytable", "look", "font", "color", "size", "save", "restore", "resume", "_save_slot", "yes", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9"],
	//===========================================\\
	turnDemon: function (commandName, interpreterFunction) {
	// This function runs at the start of each turn\\
		this.timers();
		if (this.state.gameOver) {
			console.log(commandName)
			return console.codeInline(["[Game over. Please type ", "start ", "to begin a new game.]"]);
		}
		try {
			let dontCountTurn = this.immuneCommands.includes(commandName);
			if (!dontCountTurn) {
				this.addToHistory(commandName);
				if (!this.state.objectMode) {
					this.state.turn++;
				}
			}
			interpreterFunction(commandName);
            
			// if (this.state.solveMode === true && commandName !== "safe") {
			// 	this.state.solveMode = false;
			// 	commandName !== "rezrov" ? console.digi("INCORRECT PASSCODE"): null;
			// 	return;
			// }
			return;
		}
		catch (err){
			console.invalid(err)
			return console.p(`That's not going to work. Please try something else.`);
		}
	},
	
	addToHistory: function (commandName){
	// Method adds executed command to history and increments turn counter.
		this.state.history.push(commandName);
		window.localStorage.setItem("ConsoleGame.history", this.state.history);
	},

	replayHistory: function (commandList){
		this.state.restoreMode = false;
		this.initializeNewGame();
		console.groupCollapsed("Game loading...");
		commandList.split(",").map((command) =>{
			(Function(`${command}`))();
		});
		return console.groupEnd("Game loaded.");
	},
	
	addToInventory: function (itemArray){
	// Method adds item to player inventory
		itemArray.map((item) => {
			if (item instanceof String){
				return this.state.inventory.push(this.items[`_${item}`]);
			}
			return this.state.inventory.push(item);
		});
	},

	removeFromInventory: function (item){
		this.state.inventory.splice(this.state.inventory.indexOf(item), 1);
	},

	resetGame: function (){
		this.state.objectMode = false;
		this.state.saveMode = false;
		this.state.restoreMode = false;
		this.state.prefMode = false;
		this.state.confirmMode = false;
		this.state.solveMode = false;
		this.state.inventory = [];
		this.state.history = [];
		this.state.turn = 0;
		this.state.gameOver = false;
		this.state.pendingAction = null;
		this.state.position = this.state.startPosition;
		window.localStorage.removeItem("ConsoleGame.history");
		return;
	},
	// // Utility function formats a given list of terms (directions) as a string, separating them with commas, and a conjunction ("and"), or a disjunction ("or"), before the final term.
	formatList: function (itemArray, disjunction = false){
		const length = itemArray.length;
		const conjunction = disjunction ? "or" : "and";
		if (length === 0) {
			return "nowhere";
		}
		if (length === 1) {
			return itemArray[0];
		} 
		if (length === 2) {
			return `${itemArray[0]} ${conjunction} ${itemArray[1]}`;
			// return itemArray[0] + conjunction + itemArray[1];
		}
		return `${itemArray[0]}, ${this.formatList(itemArray.slice(1), disjunction)}`
	},

	cases: function (...wordArgs) {
		let lc, cases;
		const casesArray = wordArgs.map((word) =>{
			lc = word.toLowerCase();
			cases = [lc, `${lc.charAt(0).toUpperCase()}${lc.slice(1)}`, lc.toUpperCase()];
			return word.length ? cases: "";
		});
		return casesArray.join(",");
	},
	// Returns an array of directions (as strings) that player can move in from present location.
	possibleMoves: function (z, y, x){
		const n = ["north", maps[z][y - 1] !== undefined && maps[z][y - 1][x] !== "*"];
		const s = ["south", maps[z][y + 1] !== undefined && maps[z][y + 1][x] !== "*"];
		const e = ["east", maps[z][y][x + 1] !== undefined && maps[z][y][x + 1] !== "*"];
		const w = ["west", maps[z][y][x - 1] !== undefined && maps[z][y][x - 1] !== "*"];
		const u = ["up", maps[z + 1] !== undefined && maps[z + 1][y][x] !== "*"];
		const d = ["down", maps[z - 1] !== undefined && maps[z - 1][y][x] !== "*"];
		let options = [n, s, e, w, u, d];
		let result = options.filter(elt => elt[1]).map(dir => dir[0]);
		return result;
	},

	// Applies this.formatList() utility function to the result of possibleMoves() function to return a formatted string listing the possible directions of player movement.
	movementOptions: function (){
		return this.formatList(this.possibleMoves(this.state.position.z, this.state.position.y, this.state.position.x), true);
	},

	describeSurroundings: function (){
		const name = this.mapKey[this.state.currentCell].name;
		const turn = this.state.turn;
		const description = this.mapKey[this.state.currentCell].description;
		const itemStr = this.itemsInEnvironment() ? `You see ${this.itemsInEnvironment()} here.` : "";
		const moveOptions = `You can go ${this.movementOptions()}.`;
		console.header(this.currentHeader());
		return console.p(description + "\n" + moveOptions + "\n" + itemStr + "\n");
	},

	currentHeader: function (columnWidth = 80){
		const roomName = this.mapKey[this.state.currentCell].name;
		const turn = `Turn : ${this.state.turn}`;
		const gapSize = columnWidth - roomName.length - turn.length;
		const gap = " ".repeat(gapSize);
		return `\n${roomName}${gap}${turn}`;
	},

	inInventory: function (itemName){
		const invIndex = this.state.inventory.map((item) => item.name).indexOf(itemName);
		const objectFromInventory = invIndex !== -1 && this.state.inventory[invIndex];
		return objectFromInventory;
	},

	inEnvironment: function (itemName){
		if (itemName === "all") {
			return this.items._all;
		}
		const environment = this.mapKey[this.state.currentCell].env;
		const envIndex = environment.map((item) => item.name).indexOf(itemName);
		const objectFromEnvironment = (envIndex !== -1) && this.mapKey[`${this.state.currentCell}`].env[envIndex];
		return objectFromEnvironment;
	},

	itemsInEnvironment: function () {
		const listedItems = this.state.env.filter(item => item.listed);
		return listedItems.length && this.formatList(this.state.env.filter(item => item.listed)
			.map((item) => `${item.article} ${item.name}`));
	},

	displayItem: function (galleryItem = {title: "untitled", artist: "unknown", info: null, source: "", dimensions: null}) {
		const contentDiv = document.getElementById("console-game-content");
		contentDiv.innerHTML = "";
		contentDiv.setAttribute("style", "background-color:#D1D1D1;")
		const iFrame = document.createElement("iframe");
		iFrame.src = galleryItem.source;
		iFrame.autoplay = true;
		iFrame.setAttribute("style", "width:100vw;height:80vh;background-color:gray;top:0;position:sticky;");
		const p = document.createElement("p");
		p.setAttribute("style", "text-align:center;")
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
			info.setAttribute("style", "color:black;font-style:italic;text-align:center;font-size:1em;padding-bottom:2em;");
			contentDiv.appendChild(info);
		}
		window.scroll(0, 10000);
	},

	timers: function () {
		//add any timer logic here
		if (this.state.turn === 2 && ! this.items._door.locked) {
			console.p("You hear a short metallic scraping punctuated by a dull \"thunk\". It sounds a lot like a deadbolt sliding into place.\n");

			this.items._door.closed = true;
			this.items._door.locked = true;
			this.mapKey[this.items._door.lockedTarget].locked = true;
			this.mapKey[this.items._door.closedTarget].closed = true;
		}
		if (this.state.turn >= this.timeLimit && ! this.state.gameOver) {
			return this.dead("You don't feel so well. It never occurs to you, as you crumple to the ground, losing consciousness for the final time, that you have been poisoned by an odorless, invisible, yet highly toxic gas.");
		}
		if (this.state.fireCount -- === 0 ){
			console.p("Despite your best efforts the flame flickers out.");
		}
		// if (this.state.solveMode === true && this.pendingAction !== "safe") {
		// 	this.state.solveMode = false;
		// 	this.pendingAction !== "rezrov" ? console.digi("INCORRECT PASSCODE"): null;
		// 	return;
		// }
	},

	dead: function (text) {
		console.p(text);
		console.p("You have died. Of course, being dead, you are unaware of this unfortunate turn of events. In fact, you are no longer aware of anything at all.");
		window.localStorage.removeItem("ConsoleGame.history");
		this.state.gameOver = true;
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
		// return;
	},
	winner: function (text) {
		text ? console.p(text) : null;
		console.win("You win!! Congratulations and thanks for playing!");
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
		console.info("Please choose a slot number (_0 through _9) to save your this. To save to the selected slot, type an underscore, immediately followed by the slot number.");
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
		location.reload();
		return "reloading...";
	},


	// Applies bindCommandToFunction() to an array of all of the commands to be created.
	initCommands: function (commandsArray){
		commandsArray.map((commandLog) => {
			let [interpreterFunction, aliases] = commandLog;
			this.bindCommandToFunction(interpreterFunction, aliases);
		});
	},

	// This function creates a global variable with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the variable. This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
	// Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his console adventure here: https://rawgit.com/secretGeek/console-adventure/master/console.html
	// It creates a new, one-word command in the interpreter. It takes in the function that will be invoked when the command is entered, and a comma-separated string of command aliases (synonyms). The primary command will be named after the first name in the string of aliases.
	bindCommandToFunction: function (interpreterFunction, commandAliases, daemon=this.turnDemon){
	
		const aliasArray = commandAliases.split(",");
		const commandName = aliasArray[0];
		// if (commandName in window){
		// 	console.log(`${commandName} already defined.`);
		// }
		const interpretCommand = daemon ? daemon.bind(this, commandName, interpreterFunction): interpreterFunction.bind(this, commandName);
		// const interpretCmd = interpreterFunction.bind(null, interpreterDemon);
		// const interpretWithDemon = interpretCmd.bind(null, turnDemon);
		try {
			aliasArray.map(alias => {
				Object.defineProperty(window, alias.trim(), {get: interpretCommand});
			});
		} catch (err) {
			// fail silently
			// console.log(err);
		}
	},
	
	bindInitialCommands: function () {
		const initialCommands = [
			[this._start, this.cases("start", "begin")],
			[this._resume, this.cases("resume")],
			[this._help, this.cases("help") + ",h,H,ayuda"],
			[this._commands, this.cases("command", "commands")],
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
		const puzzles = this.state.env.filter(item => item.solution);
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
		const intro_1 = "\nWelcome!\nAs a fan of old Infocom™ interactive fiction games, I thought it would be fun to hide a text adventure in the browser's JavaScript console. This work in progress is my attempt. Try it out by typing in the console below. Have fun!\n";
		console.title("consoleGame");
		console.custom("by Dennis Hodges\ncopyright 2019", "font-size:100%;color:lightgray;padding:0 1em;");
		console.intro(intro_1);
		console.codeInline(this.introOptions());
		// console.ransom(`we have your doggo.`)
		// console.note(spells)
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
		console.p("You slowly open your eyes. Your eyelids aren't halfway open before the throbbing pain in your head asserts itself. The last thing you can remember is taking your dog for a walk after work, but you certainly don't remember being here before.");
	},
	stockDungeon: function (subEnvName){
		Object.keys(this.mapKey).map((key) => {
			let roomEnv = this.mapKey[key][subEnvName];
			let newEnv = [];
			if (roomEnv.length){
				roomEnv.map((item) => {
					let itemObj = typeof item === "string" ? this.items[`_${item}`] : item;
					itemObj ? newEnv.push(itemObj) : console.log(`Cannot stock ${item}. No such item.`);;
				});
			}
			this.mapKey[key][subEnvName] = newEnv;
			return newEnv;
		});
	},

	initializeNewGame: function () {
		this.resetGame();
		this.initCommands(this.commands);
		this.stockDungeon("hiddenEnv");
		this.stockDungeon("visibleEnv");
		this.items._glove.contents.push(this.items._matchbook);
		this.items._safe.contents.push(this.items._key);
		this.addToInventory([this.items._grue_repellant, this.items._no_tea, this.items._matchbook]);
	
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
		const codeStyle = "font-family:courier;color:#29E616;font-size:115%;line-height:1.5;";/*
		const text_0 = ["Due to the limitations of the browser console as a medium, the commands you may enter can only be one-word long, with no spaces. "];
		console.codeInline(text_0, baseStyle, null);
		const text_1 = [
			"However, two-word commands may be constructed on two separate lines. For example, if you wanted to examine the glove, you would first type ",
			"examine ",
			"to which the game would respond ",
			"What would you like to examine? ",
			"Then you would type the object of your intended action, ",
			"glove",
			", to complete the command."
		];
		console.codeInline(text_1, baseStyle, codeStyle)
		const text_2 = [
			"Alternately, you may enter both words on the same line, provided they are separated with a semicolon and no spaces, i.e ",
			"examine;glove"
		]
		console.codeInline(text_2, baseStyle, codeStyle);*/
	
		const text = ["Valid commands are one word long, with no spaces. Compound commands consist of at most two commands, separated by a carriage return or a semicolon. For example:\n", "get\n", "What would you like to take?\n", "lamp\n", "You pick up the lamp.\n","or,\n", "get;lamp\n", "What would you like to take?\nYou pick up the lamp."];
		const styles = [baseStyle, codeStyle, italicCodeStyle, codeStyle, italicCodeStyle, baseStyle, codeStyle, italicCodeStyle];
		console.inline(text, styles);

		const text_2 = ["Typing ", "inventory ", "or ", "i ", "will display a list of any items the player is carrying. \nTyping ", "look ", "or ", "l ", "will give you a description of your current environs in the game. \nCommands with prepositions are not presently supported, and ", "look ", "can only be used to \"look around\", and not to \"look at\" something. Please instead use ", "examine ", "or its shortcut ", "x ", "to investigate an item's properties. \nThe player may move in the cardinal directions– ", "north", ", ", "south", ", ", "east", " and ", "west ", "as well as ", "up ", "and ", "down. ", "Simply type the direction you want to move. These may be abbreviated as ", "n", ", ", "s", ", ", "e", ", ", "w", ", ", "u ", "and ", "d ", ", respectively."];
		
		console.codeInline(text_2, baseStyle, codeStyle);

		const text_3 = ["You may save your game progress (it will be saved to localStorage) by typing ", "save", ". You will then be asked to select a save slot, ", "_0 ", "through ", "_9 ", "(remember, user input can't begin with a number). Typing ", "help ", "will display the in-game help text."];
	
		console.codeInline(text_3, baseStyle, codeStyle);
		console.codeInline(this.introOptions(this.state.turn));
	},

	_commands: function () {
		const commands = this.commands.map(cmd => {
			const [fn, aliases] = cmd
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
}

// this function enables user to set preferences
window._ = (value) => {
	return ConsoleGame.state.solveMode ? ConsoleGame.solveCode(value) : ConsoleGame.setPreference(value);
}
// include imported items
ConsoleGame.items = itemModule(ConsoleGame);
// include imported commands
ConsoleGame.commands = [...commandsList(ConsoleGame)];
// include map key
ConsoleGame.mapKey = {...mapKeyModule(ConsoleGame)};
// enable "start" and other essential commands contained in ConsoleGame, but not imported commands
ConsoleGame.bindInitialCommands();

export default ConsoleGame;