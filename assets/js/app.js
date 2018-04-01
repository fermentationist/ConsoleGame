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
	}

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




// console.warning("initializing commands...\n\n");
// console.table(commands);

// const commands = [
// 	// Move
// 	[_move, "north,North,NORTH,n,N"],
// 	[_move, "south,South,SOUTH,s,S"],
// 	[_move, "east,East,EAST,e,E"],
// 	[_move, "west,West,WEST,w,W"],
// 	[_move, "up,Up,UP,u,U"],
// 	[_move, "down,Down,DOWN,d,D"],

// 	// Actions
// 	[_look, "look,Look,LOOK,l,L"],
// 	[_inventory, "inventory,Inventory,INVENTORY,i,I"],
// 	[_use, "use,Use,USE"],
// 	[_take, "take,Take,TAKE,t,T"],
// 	[_read, "read,Read,READ"],

// 	// Objects
// 	[_objects, "repellant,Repellant,REPELLANT,grue_repellant,Grue_repellant,Grue_Repellant,GRUE_REPELLANT"],
// 	[_objects, "key,Key,KEY"],
// 	[_objects, "note,Note,NOTE"],


// 	// Misc
// 	[_inventoryTable, "inventoryTable,invTable"],
// 	[_poof, "poof,Poof,POOF"],
// 	[_oops, "oops,Oops,OOPS"]
// ];

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

// console.log('_grueRepellant.defective', _grueRepellant.defective);
