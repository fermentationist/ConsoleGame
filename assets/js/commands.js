// IIFE returns commands and related aliases, with the functions they will be bound to
const Commands = (game) => {
	// Command functions

	// Reload window (and game)
	const _exit = () => {
		location.reload();
		return "reloading...";
	}

	// Change player's location on the map, given a direction
	const _move = (direction) => {
		let newPosition = {
			x: game.state.position.x,
			y: game.state.position.y,
			z: game.state.position.z
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
		game.state.position = {
			x: newPosition.x,
			y: newPosition.y,
			z: newPosition.z,
		}
		return game.describeSurroundings();
	}

	// Describe environment and movement options in current location
	const _look = (command) => {
		// const name = mapKey[game.state.currentCell].name;
		// const description = mapKey[game.state.currentCell].description;
		// const items = game.itemsInEnvironment() ? `You see ${game.itemsInEnvironment()} here.` : "";
		// const moveOptions = `You can go ${game.movementOptions()}.`;
		// console.title(name);
		// return console.p(description + "\n" + moveOptions + "\n" + items);
		return game.describeSurroundings();
	}

	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.
	const _act_upon = (command) => {
		game.state.objectMode = true;
		game.state.pendingAction = command;
		return console.p(`What is it you would like to ${command}?`);
	}

	// Displays items in the player's inventory.
	const _inventory = (command) => {
		let items = [];
		game.state.inventory.map((item) => {
			const arr = item.article ? [item.article, item.name] : ["", item.name]
			console.log('arr', arr);
			items.push(arr);
			// return item.article ? `${item.article} ${item.name}` : `${item.name}`;
		});
		console.log('items', items);
		// console.log(game.formatList(items).split(" "));
		// console.p("You are carrying:");
		// return game.state.inventory.map((item) => {
		// 	console.color("cyan", `${item.article}`, ` ${item.name}`, ",")
		// })
		const segments = game.formatList(items);
		console.log('segments', segments);
		// console.log(["You are carrying"].concat(segments));
		return console.inline(["You are carrying"].concat(segments), ["color:inherit", "color:inherit", "color:cyan", "color:inherit", "color:cyan"]);
	}

	// Displays inventory as a table.
	const _inventoryTable = (command) => {
		const [name, description]= game.state.inventory;
		return console.table([name, description]);
}

	// Handles commands that are item names.
	const _items = (itemName) => {
		// Exit function with error message if previous command does not require an object
		if (!game.state.objectMode){
			return console.p("Invalid command");
		}
		// Exit function with error message if item is not available in player inventory or current location.
		const item = game.inEnvironment(itemName) || game.inInventory(itemName);
		if (!item){
			return console.p(`${itemName} is not available`);
		}
		const action = game.state.pendingAction;
		// invoke the item's method that corresponds to the selected action
		return item[action]();
	}

	const _save = () => {
		game.state.saveMode = true;
		return console.p("To save your game, please type \"save\", immediately followed by a number, 0 through 9. For example: \"save8\", or \"save3\"...");
	}

	const _load = () => {
		console.log(Object.keys(localStorage));
	}

	const _save_slot = (slotNumber) => {
		return game.state.saveMode ? console.p(`Game saved to slot ${slotNumber}`) : saveGame(slotNumber);
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
		[game.describeSurroundings, "look,Look,LOOK,l,L"],
		[_inventory, "inventory,Inventory,INVENTORY,i,I"],
		[_act_upon, "use,Use,USE"],
		[_act_upon, "take,Take,TAKE,t,T,get,Get,GET"],
		[_act_upon, "read,Read,READ"],
		[_act_upon, "examine,Examine,EXAMINE"],
		[_act_upon, "drink,Drink,DRINK"],
		[_act_upon, "drop,Drop,DROP"],
		[_act_upon, "pull,Pull,PULL"],
		[_act_upon, "spray,Spray,SPRAY"],
		[_act_upon, "contemplate,Contemplate,CONTEMPLATE,ponder,Ponder,PONDER"],

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
		// [_all, "all,All,ALL"],
		[_save, "save","Save","SAVE"],
		[_save_slot, "save0,Save0,SAVE0"],
		[_save_slot, "save1,Save1,SAVE1"],
		[_save_slot, "save2,Save2,SAVE2"],
		[_save_slot, "save3,Save3,SAVE3"],
		[_save_slot, "save4,Save4,SAVE4"],
		[_save_slot, "save5,Save5,SAVE5"],
		[_save_slot, "save6,Save6,SAVE6"],
		[_save_slot, "save7,Save7,SAVE7"],
		[_save_slot, "save8,Save8,SAVE8"],
		[_save_slot, "save9,Save9,SAVE9"],
		[_load, "load","Load","LOAD"],
		[_poof, "poof,Poof,POOF"],
		[_exit, "oops,Oops,OOPS"],
		[_exit, "exit,EXIT,Exit,x,X"],
		[_exit, "restart,RESTART,Restart"]
	];

	return aliases;
};//)();
