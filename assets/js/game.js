// consoleGame.state object stores player position, inventory, number of turns, history of player actions, and some methods to update the object's values.

const consoleGame = {
	state: {
		objectMode : false,
		saveMode: false,
		restoreMode: false,
		prefMode: false,
		confirmMode: false,
		inventory : [],
		history : [],
		turn : 1,
		pendingAction : null,
		position : {
			x: 4,
			y: 2,
			z: 3
		},
		get currentCell (){ 
			return maps[this.position.z][this.position.y][this.position.x]
		},
		get env (){
			return mapKey[this.currentCell].env;
		}
	},

		 //===========================================\\
	// This function runs at the start of each turn\\
	turnDemon: function (commandName, interpreterFunction) {
		try {
			if (this.state.saveMode){
				console.info(`Saving game to slot ${commandName}`);
				return this.saveGame(commandName);
			}
			if (this.state.restoreMode){
				console.info(`Restoring game from slot ${commandName}`);
				return this.restoreGame(commandName);
			}

			interpreterFunction(commandName);

			let dontCountTurn = this.state.saveMode || this.state.restoreMode || this.state.prefMode;
			if (!dontCountTurn) {
				this.addToHistory(commandName);
				// console.tiny(this.state.history);
				!this.state.objectMode ? this.state.turn ++ : null;
			}
			return;
		}
		catch (err){
			return console.invalid(`${err}. Please try again.`);
		}
	},

	// Method adds executed command to history and increments turn counter.
	addToHistory: function (commandName){
		if (false){
			// something
		} else {
			this.state.history.push(commandName);
		}
	},

	replayHistory: function (commandList){
		console.groupCollapsed("Game loaded.");
		commandList.split(",").map((command) =>{
			return eval(`${command}`);
		});
		return console.groupEnd();
	},

	// Method adds item to player inventory
	addToInventory: function (itemArray){
		itemArray.map((item) => {
			if (item instanceof String){
				return this.state.inventory.push(Items[`_${item}`]);
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
		this.confirmMode = false;
		this.state.inventory = [];
		this.state.history = [];
		this.state.turn = 1;
		this.state.pendingAction = null;
		this.state.position = {
				x: 4,
				y: 2,
				z: 3
			}
		return console.info("Resetting consoleGame.state...");
	},

	// Utility function formats a given list of terms (directions) as a string, separating them with commas, and a conjunction ("and"), or a disjunction ("or"), before the final term.
	formatList: function (itemArray, disjunction = false){
		const length = itemArray.length;
		const conjunction = disjunction ? "or" : "and";
		if (length === 1) {
			return itemArray[0];
		} 
		if (length === 2) {
			return `${itemArray[0]} ${conjunction} ${itemArray[1]}`;
			// return itemArray[0] + conjunction + itemArray[1];
		}
		return `${itemArray[0]}, ${this.formatList(itemArray.slice(1), disjunction)}`
	},

	// Returns an array of directions (as strings) that player can move in from present location.
	possibleMoves: function (z, y, x){
		const n = ["north", maps[z][y - 1][x] !== "*"];
		const s = ["south", maps[z][y + 1][x] !== "*"];
		const e = ["east", maps[z][y][x + 1] !== "*"];
		const w = ["west", maps[z][y][x - 1] !== "*"];
		const u = ["up", maps[z + 1][y][x] !== "*"];
		const d = ["down", maps[z - 1][y][x] !== "*"];
		let options = [n, s, e, w, u, d];
		let result = [];
		options.map((direction) => {
			direction[1] ? result.push(direction[0]):null;
		});
		return result;
	},

	// Applies this.formatList() utility function to the result of possibleMoves() function to return a formatted string listing the possible directions of player movement.
	movementOptions: function (){
		return this.formatList(this.possibleMoves(this.state.position.z, this.state.position.y, this.state.position.x), true);
	},

	describeSurroundings: function (){
		const name = mapKey[this.state.currentCell].name;
		const turn = this.state.turn;
		const description = mapKey[this.state.currentCell].description;
		const items = this.itemsInEnvironment() ? `You see ${this.itemsInEnvironment()} here.` : "";
		const moveOptions = `You can go ${this.movementOptions()}.`;
		console.p("\n\n");// console.clear();
		console.header(this.currentHeader());
		return console.p(description + "\n" + moveOptions + "\n" + items + "\n");
	},

	currentHeader: function (columnWidth = 80){
		const roomName = mapKey[this.state.currentCell].name;
		const turn = `Turn : ${this.state.turn}`;
		const gapSize = columnWidth - roomName.length - turn.length;
		const gap = " ".repeat(gapSize);
		return `${roomName}${gap}${turn}`;
	},

	inInventory: function (itemName){
		const invIndex = this.state.inventory.map((item) => item.name).indexOf(itemName);
		const objectFromInventory = invIndex !== -1 && this.state.inventory[invIndex];
		return objectFromInventory;
	},

	inEnvironment: function (itemName){
		const environment = mapKey[this.state.currentCell].env;
		const envIndex = environment.map((item) => item.name).indexOf(itemName);
		const objectFromEnvironment = (envIndex !== -1) && mapKey[`${this.state.currentCell}`].env[envIndex];
		return objectFromEnvironment;
	},

	itemsInEnvironment: function () {
		return this.state.env.length && this.formatList(this.state.env.map((item) => `${item.article} ${item.name}`));
	},

	saveGame: function (slot){
		const slotName = `ConsoleGame.save.${slot}`;
		if (localStorage.getItem(slotName)){
			this.state.confirmMode = true;
			return console.invalid("That save slot is already in use. Type \"yes\" to overwrite it or enter a different save slot.")
		} 
		if (!localStorage.getItem(slotName)){
			this.state.saveMode = false;
			return localStorage.setItem(slotName, this.state.history);
		} 

	},

	restoreGame: function (slotName){
		this.state.restoreMode = false;
		let saveData = localStorage.getItem(`ConsoleGame.save.${slotName}`);
		this.resetGame();
		this.replayHistory(saveData);
		return this.describeSurroundings();
	},

	// Applies bindCommandToFunction() to an array of all of the commands to be created.
	initCommands: function (commandsArray){
		let interpreterFunction, aliases;
		commandsArray.map((commandLog) => {
			[interpreterFunction, aliases] = commandLog;
			this.bindCommandToFunction(interpreterFunction, aliases);
		});
	},

	// This function is what makes this console game possible. It creates a global variable with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the variable(s). This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
	// Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his or her console adventure here: https://rawgit.com/secretGeek/console-adventure/master/console.html
	// It creates a new, one-word command in the interpreter. It takes in the function that will be invoked when the command is entered, and a comma-separated string of command aliases (synonyms). The primary command will be named after the first name in the string of aliases.
	bindCommandToFunction: function (interpreterFunction, commandAliases){
		const aliasArray = commandAliases.split(",");
		const commandName = aliasArray[0];
		if (commandName in window){
			return console.invalid(`${commandName} already defined.`);
		}
		const interpretCommand = this.turnDemon.bind(this, commandName, interpreterFunction);
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

	setPreference: function (pref, value){
		return localStorage.setItem(`ConsoleGame.prefs.${pref}`, value);
	},

// preferences are forced to reload by removing and reinserting original script tag for prefs.js
	reloadScript: function (filename){
		const body = document.getElementsByTagName("body")[0];
		const tags = Array.from(document.getElementsByTagName("script"));
		tags.forEach((tag) => {
			let index = tag.src.indexOf(filename);
			if(index !== -1){
				tag.remove();
			}
		});
		const scriptTag = document.createElement("script");
		scriptTag.src = `assets/js/${filename}`;
		scriptTag.type = "text/javascript";
		body.prepend(scriptTag);
		return setTimeout(() => consoleGame.describeSurroundings(), 500);	
	}
}

const _ = (value) => {
	console.info(`value for ${consoleGame.state.pendingAction} will be set to ${value}`);
	consoleGame.state.prefMode = false;
	consoleGame.setPreference(`${consoleGame.state.pendingAction}`, value);
	return consoleGame.reloadScript("prefs.js");
}



// Commands(consoleGame);
// Creating commands from array returned by commands.js...
consoleGame.initCommands(Commands(consoleGame));

// Greeting to be displayed at the beginning of the game
const greeting = "\nWelcome\n"

// Wait for page to load, and display greeting.
setTimeout(() => {
	console.h1(greeting);
	console.info("Type a command to play.\n\n");
	consoleGame.describeSurroundings();
	}, 500);

