// consoleGame.state object stores player position, inventory, number of turns, history of player actions, and some methods to update the object's values.

let consoleGame = {
	state: {
		objectMode : false,
		saveMode: false,
		inventory : [],
		history : [],
		turn : 0,
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

	// Method adds executed command to history and increments turn counter.
	addToHistory: function (commandName){
		if (false){//this.objectMode){
			this.state.history.push(`${this.state.history.pop()} ${commandName}`);
		} else {
			this.state.history.push(commandName);
		}
	},

	replayHistory: function (){
		console.groupCollapsed("Game loaded.");
		this.state.history.map((command) =>{
			return eval(command);
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
		this.state.inventory.splice(this.inventory.indexOf(item), 1);
	},

	resetGame: function (){
		this.state.objectMode = false;
		this.state.saveMode = false,
		this.state.inventory = [],
		this.state.history = [],
		this.state.turn = 0,
		this.state.pendingAction = null,
		this.state.position = {
				x: 4,
				y: 2,
				z: 3
			}
		return console.p("Resetting consoleGame.state...");
	},

	// Utility function formats a given list of terms (directions) as a string, separating them with commas, and a conjunction ("and"), or a disjunction ("or"), before the final term.
	formatList: function (itemArray, disjunction = false){
		console.log('itemArray', itemArray)
		const length = itemArray.length;
		const conjunction = disjunction ? "or" : "and";
		if (length === 1) {
			return itemArray[0];
		} 
		if (length === 2) {
			console.italic("", " length === 2 !", "");
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
		console.descriptionTitle(name, turn);
		return console.p(description + "\n" + moveOptions + "\n" + items);
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

	saveGame: function (saveSlotName){
		console.p("Saving...");
		this.state.saveMode = false;
		const saveName = `slot${saveSlotName.slice(4)}`;
		localStorage.setItem(`ConsoleGame.${saveName}`, this.state.history);
	},

	loadGame: function (loadSlotName){
		const loadedHistory = null;
		return loadedHistory;
	},

	turnDemon: function (commandName, interpreterFunction) {
		try {
			if (this.state.saveMode){
				return this.saveGame(commandName);
			}
			this.addToHistory(commandName);
			this.state.turn ++;
			console.p(`Turn: ${this.state.turn}`);
			
			return interpreterFunction(commandName);
		}
		catch (err){
			return console.invalid(`${err}. <q></q>Please try again.`);
		}
	},

	// Applies bindCommandToFunction() to an array of all of the commands to be created.
	initCommands: function (commandsArray){
		let interpreterFunction, aliases;
		commandsArray.map((commandlog) => {
			[interpreterFunction, aliases] = commandlog;
			this.bindCommandToFunction(interpreterFunction, aliases);
		});
	},

	// This function is what makes this console game possible. It creates a global variable with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the variable(s). This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
	// Thank you to secretGeek for this clever solution. I found it here: https://github.com/secretGeek/console-adventure. You can play his or her console adventure here: https://rawgit.com/secretGeek/console-adventure/master/console.html
	// It creates a new, one-word command in the interpreter. It takes in the function that will be invoked when the command is entered, and a comma-separated string of command aliases (synonyms). The primary command will be named after the first name in the string of aliases, converted to lowercase.
	bindCommandToFunction: function (interpreterFunction, commandAliases){
		const aliasArray = commandAliases.split(",");
		const commandName = aliasArray[0].toLowerCase();
		const interpretCommand = this.turnDemon.bind(this, commandName, interpreterFunction);
		// const interpretCmd = interpreterFunction.bind(null, interpreterDemon);
		// const interpretWithDemon = interpretCmd.bind(null, turnDemon);
		aliasArray.map(alias => {
			Object.defineProperty(window, alias.trim(), {get: interpretCommand});
		});
	}
}

// Commands(consoleGame);
// Creating commands from array returned by commands.js...
consoleGame.initCommands(Commands(consoleGame));

// Greeting to be displayed at the beginning of the game
const greeting = "\n\nWelcome, thanks for playing!\n\n"

// Wait for page to load, and display greeting.
setTimeout(() => {
	// console.clear();
	console.h1(greeting);
	console.note("Type a command to play.\n\n");
	consoleGame.describeSurroundings();
	}, 500);

