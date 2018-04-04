// gameState object stores player position, inventory, number of turns, history of player actions, and some methods to update the object's values.
const gameState = {
	objectMode : false,
	inventory : [],
	history : [],
	position : {
		x: 6,
		y: 6,
		z: 3
	},
	turn : 0,
	pendingAction : null,
	env: [],

	// Method adds executed command to history and increments turn counter.
	addToHistory: function (commandName){
		if (this.objectMode){
			this.history.push(`${this.history.pop()} commandName`);
			this.objectMode = false;
		} else {
			this.history.push(commandName);
			this.turn ++;
		}
	},

	// Method adds item to player inventory
	addToInventory: function (itemArray){
		itemArray.map((item) => {
			this.inventory.push(item);
		});
	}

}

// Utility function formats a given list of terms (directions) as a string, separating them with commas, and a conjunction ("and"), or a disjunction ("or"), before the final term.
const formatList = (itemArray, disjunction = false) => {
	const length = itemArray.length;
	const conjunction = disjunction ? "or" : "and";
	if (length === 1) {
		return itemArray[0];
	} 
	if (length === 2) {
		return `${itemArray[0]} ${conjunction} ${itemArray[1]}`
	}
	return `${itemArray[0]}, ${formatList(itemArray.slice(1), disjunction)}`
}

// Returns an array of directions (as strings) that player can move in from present location.
const possibleMoves = (z, y, x) => {
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
}

// Applies formatList() utility function to the result of possibleMoves() function to return a formatted string listing the possible directions of player movement.
const movementOptions = () => {
	return formatList(possibleMoves(gameState.position.z, gameState.position.y, gameState.position.x), true);
}

// Checks if object is available to be acted on, (i.e. if it is present in player's inventory or current location) and returns boolean.
const isAvailable = (objectName) => {
	const loc = `${gameState.position.x},${gameState.position.y},${gameState.position.z}`
	const inv = (gameState.inventory.map((item) => item.name)).includes(objectName);
	const env = (gameState.env).includes(objectName);
	console.log('inv || env', inv || env);
	return inv || env;
}

// Applies bindCommandToFunction() to an array of all of the commands to be created.
const initCommands = (commandsArray) => {
	let interpreterFunction, aliases;
	commandsArray.map((commandlog) => {
		[interpreterFunction, aliases] = commandlog;
		bindCommandToFunction(interpreterFunction, aliases);
	});
}

// This function is what makes this console game possible. It creates a global variable with the command name (and one for each related alias), and binds the function to be invoked to a getter method on the variable. This is what allows functions to be invoked by the player in the console without needing to type the invocation operator "()" after the name.
// It creates a new, one-word command in the interpreter. It takes in the function that will be invoked when the command is entered, and a comma-separated string of command aliases (synonyms). The command will be named after the first name in the string of aliases, converted to lowercase.
const bindCommandToFunction = (interpreterFunction, commandAliases) => {
	const aliasArray = commandAliases.split(",");
	const commandName = aliasArray[0].toLowerCase();
	const interpretCmd = interpreterFunction.bind(null, commandName);
	aliasArray.map(alias => {
		Object.defineProperty(window, alias.trim(), {get: interpretCmd});
	});
}



// Creating commands from array returned by commands.js...
initCommands(commands);

// Greeting to be displayed at the beginning of the game
const greeting = "\n\nWelcome, thanks for playing!\n\n"

// Wait for page to load, and display greeting.
setTimeout(() => {
	console.clear();
	console.h1(greeting);
	console.note("Type a command to play.");
	}, 500);

