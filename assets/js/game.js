console.clear();
const greeting = "\n\nWelcome, thanks for playing!\n\n"

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

	addToHistory: function (commandName){
		if (this.objectMode){
			this.history.push(`${this.history.pop()} commandName`);
			this.objectMode = false;
		} else {
			this.history.push(commandName);
			this.turn ++;
		}
	},

	addToInventory: function (itemArray){
		itemArray.map((item) => {
			this.inventory.push(item);
		});
	},

}

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

const movementOptions = () => {
	return formatList(possibleMoves(gameState.position.z, gameState.position.y, gameState.position.x), true);
}

const isAvailable = (objectName) => {
	const loc = `${gameState.position.x},${gameState.position.y},${gameState.position.z}`
	const inv = (gameState.inventory.map((item) => item.name)).includes(objectName);
	const env = (gameState.env).includes(objectName);
	console.log('inv || env', inv || env);
	return inv || env;
	
}

//this function causes 
const createCommandAliases = (command, aliases) => {
	aliases.split(",").map(alias => {
		Object.defineProperty(window, alias.trim(), {get: command});
	});
}


const initCommands = (commandsArray) => {
	let interpreterFunction, aliases;
	commandsArray.map((commandlog) => {
		[interpreterFunction, aliases] = commandlog;
		bindCommandToFunction(interpreterFunction, aliases);
	});
}



// This function creates a new, one-word command in the interpreter. 
// It takes in the function that will be invoked (with the command as its 
// argument) when the command is entered, and a comma-separated string of 
// command aliases (synonyms). 
// The command will be named after the first name in the string of aliases, 
// converted to lowercase.
const bindCommandToFunction = (interpreterFunction, commandAliases) => {
	const aliasArray = commandAliases.split(",");
	const commandName = aliasArray[0].toLowerCase();
	const interpretCmd = interpreterFunction.bind(null, commandName);
	aliasArray.map(alias => {
		Object.defineProperty(window, alias.trim(), {get: interpretCmd});
	});
}


const commandList = commands.map((command) => {
	let aliasArray = command[1].split(",")
	let name = aliasArray.shift().trim().toLowerCase();
	return {
		name,
		aliases: aliasArray.join(", ")
	}
});


initCommands(commands);

setTimeout(() => {
	console.clear();
	console.h1(greeting);
	console.note("Type a command to play.");
	}, 500);

