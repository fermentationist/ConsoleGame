// IIFE returns commands and related aliases, with the functions they will be bound to
const commands = (() => {
	// Command functions

	// Reload window (and game)
	const _exit = () => {
		location.reload();
		return "reloading...";
	}

	// Change player's location on the map, given a direction
	const _move = (direction) => {
		let newPosition = {
			x: gameState.position.x,
			y: gameState.position.y,
			z: gameState.position.z
		}
		switch (direction){
			case "north":
				newPosition.y = newPosition.y - 1;
				break;
			case "south":
				newPosition.y = newPosition.y + 1;
				break;
			case "east":
				newPosition.x = newPosition.x + 1;
				break;
			case "west":
				newPosition.x = newPosition.x - 1;
				break;
			case "up":
				newPosition.z = newPosition.z + 1;
				break;
			case "down":
				newPosition.z = newPosition.z - 1;
				break;
		}
		// Exit function if movement in given direction is not possible
		if (maps[newPosition.z][newPosition.y][newPosition.x] === "*"){
			return console.p("You can't go that direction");
		}
		// If movement in direction is possible, update player position
		console.p(`You walk ${direction}...`);
		gameState.position = {
			x: newPosition.x,
			y: newPosition.y,
			z: newPosition.z,
		}
		console.p(_look());
		return maps[gameState.position.z][gameState.position.y][gameState.position.x];
	}

	// Describe environment and movement options in current location
	const _look = (command) => {
		console.p(`You can go ${movementOptions()}`);
		return maps[gameState.position.z][gameState.position.y][gameState.position.x];
	}

	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.
	const _act_upon = (command) => {
		console.p(`What is it you would like to ${command}?`);
		gameState.objectMode = true;
		gameState.pendingAction = command;
	}

	// Displays items in the player's inventory.
	const _inventory = (command) => console.note(gameState.inventory.map((item) => `\n${item.name}`));

	// Displays inventory as a table.
	const _inventoryTable = (command) => console.table(gameState.inventory);

	// Handles commands that are object names.
	const _objects = (object) => {
		// Exit function with error message if previous command does not require an object
		if (!gameState.objectMode){
			return console.p("Invalid command");
		}
		// Exit function with error message if object is not available in player inventory or current location.
		if (!isAvailable(command)){
			return console.warning("That object is unavailable. Try again.");
		}
		const action = gameState.pendingAction;
		// invoke the object's method that corresponds to the selected action
		return eval(`_${object}.${action}()`);
	}

	const _poof = () => {
		$("body").empty().css("background-color", "black");
		return console.papyracy(">poof<");
	}

	// Checks if object is available to be acted on, (i.e. if it is present in player's inventory or current location) and returns boolean.
	const isAvailable = (objectName) => {
		const loc = `${gameState.position.x},${gameState.position.y},${gameState.position.z}`
		const inv = (gameState.inventory.map((item) => item.name)).includes(objectName);
		const env = (gameState.env).includes(objectName);
		console.log('inv || env', inv || env);
		return inv || env;
		
	}


	// Command aliases
	const aliases = [
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
		[_act_upon, "use,Use,USE"],
		[_act_upon, "take,Take,TAKE,t,T"],
		[_act_upon, "read,Read,READ"],
		[_act_upon, "examine,Examine,EXAMINE"],
		[_act_upon, "drink,Drink,DRINK"],

		// Objects
		[_objects, "repellant,Repellant,REPELLANT,grue_repellant,Grue_repellant,Grue_Repellant,GRUE_REPELLANT"],
		[_objects, "key,Key,KEY"],
		[_objects, "note,Note,NOTE"],
		[_objects, "tea,Tea,TEA,no_tea,No_tea,No_Tea,NO_TEA"],

		// Misc
		[_inventoryTable, "inventoryTable,invTable"],
		[_poof, "poof,Poof,POOF"],
		[_oops, "oops,Oops,OOPS"],
		[_exit, "exit,EXIT,Exit,x,X"],
		[_exit, "restart,RESTART,Restart"]
	];

	return aliases;
})();

