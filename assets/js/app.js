console.clear();
const greeting = "\n\nWelcome, thanks for playing along...\n\n"

const gameState = {
	objectMode : false,
	inventory : [],
	history : [],
	position : {
		x: 0,
		y: 0,
		z: 0
	},
	turn : 0,
	pendingAction : null
}

// To be called at successful completion of command
const addToHistory = (commandName) => {
	if (gameState.objectMode){
		gameState.history.push(`${gameState.history.pop()} commandName`);
		gameState.objectMode = false;
	} else {
		gameState.history.push(commandName);
		turn ++;
	}
}

const rooms = {
	"3,3,3": {
		env: []
	}
}



// ===========//Items//===========
let grueRepellant = {
	name : "grue repellant",
	used : false,
	defective : Math.random() < 0.03,
	weight : 3,
	description: "A 12oz can of premium grue repellant. This is the good stuff. Grues genuinely find it to be off-putting."
}

let key = {
	name : "key",
	used : false,
	weight : 1,
	description: "It is an old-timey key that appears to be made of tarnished brass"
}

let note = {
	name : "note",
	used : false,
	weight : 1,
	text: "Dear John,\n   It's not you, it's the incredibly low, low prices at Frünch Connexion...",
	description: "A filthy note you picked up from the floor of a restroom. It is slightly damp."
}

gameState.inventory.push(grueRepellant);
gameState.inventory.push(key);
gameState.inventory.push(note);
rooms["3,3,3"].env.push(key);

const _repellant = (command) => {
	console.log("_repellant() called");
}



// ===============================



const _move = (direction) => {
	switch (direction){
		case "north":
			gameState.position.x = gameState.position.x + 1;
			break;
		case "south":
			gameState.position.x = gameState.position.x - 1;
			break;
		case "east":
			gameState.position.y = gameState.position.y + 1;
			break;
		case "west":
			gameState.position.y = gameState.position.y - 1;
			break;
		case "up":
			gameState.position.z = gameState.position.z + 1;
			break;
		case "down":
			gameState.position.z = gameState.position.z - 1;
			break;
	}
	console.p(`moving ${direction}...`);
	return gameState.position;
}

const _look = (command) => console.p(`Description of anything ${command}able in the vicinity...`);

const _use = (command) => {
	console.p(`What would you like to use?`);
	gameState.objectMode = true;
}

const _take = (command) => {
	console.p(`What is it that you'd like to ${command}?`);
	gameState.objectMode = true;
}

const _READ = (object) => {
	if (Object.keys(object).includes("text")){
		console.p(`The text on ${object.name} says: ${object.text}.`);
	} else {
		console.p(`There is no text to read on the ${object.name}`)
	}
	gameState.objectMode = false;
	gameState.pendingAction = null;
}

const _read = (command) => {
	console.p(`What is it that you'd like to ${command}?`);
	gameState.objectMode = true;
	gameState.pendingAction = _READ;
}

const _inventory = (command) => console.note(gameState.inventory.map((item) => `\n${item.name}`));

const _inventoryTable = (command) => console.table(gameState.inventory);

const _objects = (command) => {
	if (!gameState.objectMode){
		return console.p("Invalid command");
	}
	console.p(`_objects(${command}) called.`)
	if (!isAvailable(command)){
		return console.warning("That object is unavailable. Try again.");
	}
	const action = gameState.history[gameState.history.length - 1];

	return console.note(`Now we need to invoke ${action} on ${command}`)
}

const _poof = () => {
	$("body").empty().css("background-color", "black");
	return console.papyracy(">poof<");
}

const _oops = () => {
	location.reload();
	return "reloading...";
}

const isAvailable = (objectName) => {
	const loc = `${gameState.position.x},${gameState.position.y},${gameState.position.z}`
	const inv = (gameState.inventory.map((item) => item.name)).includes(objectName);
	const env = (rooms[loc].env).includes(objectName);
	return inv || env;
}

//this function causes 
const createCommandAliases = (command, aliases) => {
	aliases.split(",").map(alias => {
		Object.defineProperty(window, alias.trim(), {get: command});
	});
}

const initCompoundAliases = (command, aliases) => {
	aliases.split(",").map(alias => {
		Object.defineProperty(window, `/^${alias.trim()}\s.*/`, {get: command});
	})
}

const initCommands = (commandsArray) => {
	let interpreterFunction, aliases;
	commandsArray.map((commandlog) => {
		[interpreterFunction, aliases] = commandlog;
		addCommandToInterpret(interpreterFunction, aliases);
	});
}



// This function creates a new, one-word command in the interpreter. 
// It takes in the function that will be invoked (with the command as its 
// argument) when the command is entered, and a comma-separated string of 
// command aliases (synonyms). 
// The command will be named after the first name in the string of aliases, 
// converted to lowercase.
const addCommandToInterpret = (interpreterFunction, commandAliases) => {
	const aliasArray = commandAliases.split(",");
	const commandName = aliasArray[0].toLowerCase();
	const interpretCmd = interpreterFunction.bind(null, commandName);
	aliasArray.map(alias => {
		Object.defineProperty(window, alias.trim(), {get: interpretCmd});
	});
}




// console.warning("initializing commands...\n\n");
// console.table(commands);

const commands = [
	// Move
	[_move, "north,North,NORTH,n,N"],
	[_move, "south,South,SOUTH,s,S"],
	[_move, "east,East,EAST,e,E"],
	[_move, "west,West,WEST,w,W"],
	[_move, "up,Up,UP,u,U"],
	[_move, "down,Down,DOWN,d,D"],

	// Actions
	[_look, "look,Look,LOOK,l,L"],
	[_inventory, "inventory,Inventory,INVENTORY,i,I"],
	[_use, "use,Use,USE"],
	[_take, "take,Take,TAKE,t,T"],
	[_read, "read,Read,READ"],

	// Objects
	[_objects, "repellant,Repellant,REPELLANT,grue_repellant,Grue_repellant,Grue_Repellant,GRUE_REPELLANT"],
	[_objects, "key,Key,KEY"],
	[_objects, "note,Note,NOTE"],


	// Misc
	[_inventoryTable, "inventoryTable,invTable"],
	[_poof, "poof,Poof,POOF"],
	[_oops, "oops,Oops,OOPS"]
];

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

// console.log('grueRepellant.defective', grueRepellant.defective);
