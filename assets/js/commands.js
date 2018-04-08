// IIFE returns commands and related aliases, with the functions they will be bound to
const Commands = (() => {
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
		_look();
		return maps[gameState.position.z][gameState.position.y][gameState.position.x];
	}

	// Describe environment and movement options in current location
	const _look = (command) => {
		const description = mapKey[gameState.currentCell].description;
		const items = itemsInEnvironment() ? `You see ${itemsInEnvironment()} here.` : "";
		const moveOptions = `You can go ${movementOptions()}.`;
		return console.p(description + "\n" + moveOptions + "\n" + items);
	}

	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.
	const _act_upon = (command) => {
		console.p(`What is it you would like to ${command}?`);
		gameState.objectMode = true;
		gameState.pendingAction = command;
	}

	// Displays items in the player's inventory.
	const _inventory = (command) => {
		return console.note(gameState.inventory.map((item) => `\n${item.name}`));
	}

	// Displays inventory as a table.
	const _inventoryTable = (command) => console.table(gameState.inventory);

	// Handles commands that are item names.
	const _items = (itemName) => {
		// Exit function with error message if previous command does not require an object
		if (!gameState.objectMode){
			return console.p("Invalid command");
		}
		// Exit function with error message if item is not available in player inventory or current location.
		const item = inEnvironment(itemName) || inInventory(itemName);
		if (!item){
			return console.p(`${itemName} is not available`);
		}
		const action = gameState.pendingAction;
		console.log('item', item);
		// invoke the item's method that corresponds to the selected action
		return item[action]();
	}

	const _poof = () => {
		$("body").empty().css("background-color", "black");
		return console.papyracy(">poof<");
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
		[_act_upon, "drop,Drop,DROP"],
		[_act_upon, "pull,Pull,PULL"],

		// Objects
		[_items, "grue_repellant,repellant,Repellant,REPELLANT,Grue_repellant,Grue_Repellant,GRUE_REPELLANT"],
		[_items, "key,Key,KEY"],
		[_items, "note,Note,NOTE"],
		[_items, "no_tea,No_Tea,NO_TEA"],
		[_items, "slug,Slug,SLUG"],
		[_items, "chain,Chain,CHAIN"],
		[_items, "glove,Glove,GLOVE"],



		// Misc
		[_inventoryTable, "inventoryTable,invTable"],
		[_poof, "poof,Poof,POOF"],
		[_exit, "oops,Oops,OOPS"],
		[_exit, "exit,EXIT,Exit,x,X"],
		[_exit, "restart,RESTART,Restart"]
	];

	return aliases;
})();
