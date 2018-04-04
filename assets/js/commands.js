const commands = (() => {
	// Command functions
	const _exit = () => {
		_oops();
	}

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
		console.log(newPosition);
		if (maps[newPosition.z][newPosition.y][newPosition.x] === "*"){
			return console.p("You can't go that direction");
		}
		console.p(`You walk ${direction}...`);
		gameState.position = {
			x: newPosition.x,
			y: newPosition.y,
			z: newPosition.z,
		}
		console.p(_look());
		return maps[gameState.position.z][gameState.position.y][gameState.position.x];
	}

	const _look = (command) => {
		console.p(`You can go ${movementOptions()}`);
		return maps[gameState.position.z][gameState.position.y][gameState.position.x];
	}

	const _act_upon = (command) => {
		console.p(`What is it you would like to ${command}?`);
		gameState.objectMode = true;
		gameState.pendingAction = command;
	}

	const _inventory = (command) => console.note(gameState.inventory.map((item) => `\n${item.name}`));

	const _inventoryTable = (command) => console.table(gameState.inventory);

	const _objects = (command) => {
		if (!gameState.objectMode){
			return console.p("Invalid command");
		}
		if (!isAvailable(command)){
			return console.warning("That object is unavailable. Try again.");
		}
		const action = gameState.pendingAction;
		return eval(`_${command}.${action}()`);
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

