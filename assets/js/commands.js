const commands = (() => {
	// Command functions
	const _exit = () => {
		_oops();
	}

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

	// const _use = (command) => {
	// 	console.p(`What would you like to use?`);
	// 	gameState.objectMode = true;
	// 	gameState.pendingAction = "use";
	// }

	// const _drop = (command) => {
	// 	console.p("What would you like to drop?")
	// }

	// const _examine = (command) => {
	// 	console.p(`What would you like to examine?`);
	// 	gameState.objectMode = true;
	// 	gameState.pendingAction = "examine";
	// }

	// const _take = (command) => {
	// 	console.p(`What is it that you'd like to ${command}?`);
	// 	gameState.objectMode = true;
	// }

	const _act_upon = (command) => {
		console.p(`What is it you would like to ${command}?`);
		gameState.objectMode = true;
		gameState.pendingAction = command;
	}

	// const _read = (command) => {
	// 	if (gameState.objectMode){
	// 		return console.p("Invalid command. Please try again.")
	// 	}
	// 	console.p(`What is it that you'd like to ${command}?`);
	// 	gameState.objectMode = true;
	// 	gameState.pendingAction = "read";
	// }

	const _inventory = (command) => console.note(gameState.inventory.map((item) => `\n${item.name}`));

	const _inventoryTable = (command) => console.table(gameState.inventory);

	const _objects = (command) => {
		if (!gameState.objectMode){
			return console.p("Invalid command");
		}
		// console.p(`_objects(${command}) called.`)
		if (!isAvailable(command)){
			return console.warning("That object is unavailable. Try again.");
		}
		const action = gameState.pendingAction;
		return eval(`_${command}.${action}()`);

		//return console.note(`Now we need to invoke ${action} on ${command}`)
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

