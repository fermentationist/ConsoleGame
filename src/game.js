import {primaryFont} from "./prefs.js";
import maps from "./maps.js";
import mapKeyModule from "./mapkey.js";
import itemModule from "./items.js";
import commandsList from "./commands.js";
import customConsole from "./console_styles.js";

// consoleGame.state object stores player position, inventory, number of turns, history of player actions, and some methods to update the object's values.
//todo: rewrite with generators?
const ConsoleGame = {
	maps: [...maps],
	key: {...mapKeyModule(this)},
	state: {
		objectMode : false,
		saveMode: false,
		restoreMode: false,
		prefMode: false,
		confirmMode: false,
		inventory: [],
		history: [],
		turn: null,
		pendingAction: null,
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
		
		try {
			let dontCountTurn = this.immuneCommands.includes(commandName);
			if (!dontCountTurn) {
				this.addToHistory(commandName);
				if (!this.state.objectMode) {
					this.state.turn++;
				}
			}
			return interpreterFunction(commandName);
		}
		catch (err){
			return console.invalid(`${err}. Please try again.`);
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
		this.state.inventory = [];
		this.state.history = [];
		this.state.turn = 0;
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
		// console.p("\n\n");// console.clear();
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
		const environment = this.mapKey[this.state.currentCell].env;
		const envIndex = environment.map((item) => item.name).indexOf(itemName);
		const objectFromEnvironment = (envIndex !== -1) && this.mapKey[`${this.state.currentCell}`].env[envIndex];
		return objectFromEnvironment;
	},

	itemsInEnvironment: function () {
		return this.state.env.length && this.formatList(this.state.env.map((item) => `${item.article} ${item.name}`));
	},

	displayItem: function (filename, type, width, height) {
		let contentDiv = document.getElementById("console-game-content");
		if (! filename){
			return contentDiv.innerHTML = "";
		}
		let objElement = document.createElement("object");
		objElement.setAttribute("data", filename);
		objElement.setAttribute("type", type);
		objElement.setAttribute("width", width || "600px");
		objElement.setAttribute("height", height || "300px");
		contentDiv.innerHTML = ""
		return contentDiv.append(objElement);
	},

	dead: function (text) {
		console.p(text);
		console.p("You have died. Of course, being dead, you are unaware of this unfortunate truth. In fact, you are no longer aware of anything at all.");
		window.localStorage.removeItem("ConsoleGame.history");
		setTimeout(() => location.reload(), 2000);
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

	// This function is what makes this console game possible. It creates a global variable with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the variable(s). This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
	// Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his or her console adventure here: https://rawgit.com/secretGeek/console-adventure/master/console.html
	// It creates a new, one-word command in the interpreter. It takes in the function that will be invoked when the command is entered, and a comma-separated string of command aliases (synonyms). The primary command will be named after the first name in the string of aliases.
	bindCommandToFunction: function (interpreterFunction, commandAliases, middleware=this.turnDemon){
	
		const aliasArray = commandAliases.split(",");
		const commandName = aliasArray[0];
		if (commandName in window){
			return;// console.tiny(`${commandName} already defined.`);
		}
		const interpretCommand = middleware ? middleware.bind(this, commandName, interpreterFunction): interpreterFunction.bind(this, commandName);
		// const interpretCmd = interpreterFunction.bind(null, interpreterDemon);
		// const interpretWithDemon = interpretCmd.bind(null, turnDemon);
		try {
			aliasArray.map(alias => {
				Object.defineProperty(window, alias.trim(), {get: interpretCommand});
			});
		} catch (err) {
			console.trace(err);
		}
	},
	
	bindInitialCommands: function () {
		const initialCommands = [
			[this._start, this.cases("start", "begin", "commence")],
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

	unfinishedGame: function () {
		return window.localStorage.getItem("ConsoleGame.history");
	},

	intro: function (){
		// Greeting to be displayed at the beginning of the game
		const intro_1 = "\nWelcome!\nAs a fan of old Infocom interactive fiction games, I thought it would be fun to hide a text adventure in the browser's JavaScript console. This demonstration of the concept is as yet incomplete, but you may try it out by typing in the console below.\n";
		console.intro(intro_1);
		console.codeInline(this.introOptions());
	},

	introOptions: function (){
		const existingGame= [
			"[ It looks like you have an unsaved game in progress from a previous session. If you would like to continue, type ",
			"resume",
			". If you like to load a saved game, type ",
			"restore",
			". To begin a new game, please type ",
			"start",
			". ]"
		];
		const commonOptions = [
			"[ Please type ",
			"help ",
			"for instructions, ",
			"commands ",
			"for a list of available commands, ",
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
		this.items._glove.contents.push(this.items._key);
		this.addToInventory([this.items._grue_repellant, this.items._no_tea]);
	
	},

	_start: function () {
		if (this.state.turn < 1){
			this.initializeNewGame();
		}
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
		const baseStyle = `font-family:${primaryFont};color:thistle;font-size:110%;line-spacing:1.5;`;
		const codeStyle = "color:#29E616;font-size:125%;";
		const text_0 = ["Due to the limitations of the browser console as a medium, the commands you may enter can only be one-word long, with no spaces. "];
		console.codeInline(text_0, baseStyle, null);
		const text_1 = [
			"However, two-word commands may be constructed on two separate lines. For example, if you wanted to examine the glove, you would first type ",
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
	return ConsoleGame.setPreference(value);
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