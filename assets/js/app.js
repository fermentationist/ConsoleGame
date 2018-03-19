console.clear();
const greeting = "\n\nWelcome, thanks for finding us. Type a command to play.\n\n"

let queryMode = false;
let history = [];
let position = {
	x: 0,
	y: 0,
	z: 0
}
const logCommand = (commandName, interpretCmd) => {
	history.push(commandName);
	return interpretCmd.apply();
}

const run = () => {
	queryMode = true;
	console.info(`How fast to move? [slow, fast]`);
}

const _north = (speed = "quickly") => {
	if (queryMode){
		return "Command not understood. Enter a different term to complete query, or type [exit] to exit query."
	}
	console.info(`moving North, ${speed}`);
	return true;
}

const _south = (speed = "quickly") => console.log(`moving South, ${speed}`);

const _east = (speed = "quickly") => console.log(`moving East, ${speed}`);

const _west = (speed = "quickly") => console.log(`moving West, ${speed}`);

const _up = (speed = "quickly") => console.log(`moving Up, ${speed}`);

const _move = (direction) => {
	switch (direction){
		case "north":
			position.x = position.x + 1;
			break;
		case "south":
			position.x = position.x - 1;
			break;
		case "east":
			position.y = position.y + 1;
			break;
		case "west":
			position.y = position.y - 1;
			break;
		case "up":
			position.z = position.z + 1;
			break;
		case "down":
			position.z = position.z - 1;
			break;
	}
	return position;
}
// Object.defineProperty(window, "e", {get: east});

const X = () => {
	console.info("X() called.");
	$("body").css("background-color", "black");
	return true;
}

function poof (){
	return (function(){
		$("body").empty().css("background-color", "black");
		return ">poof<";});
}

const oops = () => {
	location.reload();
	return "reloading...";
}

const interpret = (command) => {
	const cmdFuncPrefix = "_"
	// console.log("interpreting:", command);
	return eval(`${cmdFuncPrefix}${command}`)();
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
	commandsArray.map((commandInfo) => {
		[interpreterFunction, aliases] = commandInfo;
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

const commands = [
	[_move, "north,North,NORTH,n,N"],
	[_move, "south,South,SOUTH,s,S"],
	[_move, "east,East,EAST,e,E"],
	[_move, "west,West,WEST,w,W"],
	[_move, "up,Up,UP,u,U"],
	[_move, "down,Down,DOWN,d,D"]
];

// console.warning("initializing commands...\n\n");
// console.table(commands);
initCommands(commands);

// const customLog = (message, size = "inherit", color = "inherit", weight = "inherit", style = "inherit", font = "inherit", logType = "log") => {
// 	console[logType](`%c${message}`, `font-size:${size};color:${color};font-weight:${weight};font-family:${font}`);
// }

// const logH1 = (message) => {
// 	return customLog(message, "200%", "pink", "bold", "normal", "arial", "info");
// }

// const logNote = (message) => {
// 	return customLog(message, "75%", "gray", "inherit" , "italic", "Lucida Console", "info");
// }


console.h1(greeting);

console.note("p.s. this, also...");