// IIFE returns commands and related aliases, with the functions they will be bound to
const Commands = (game) => {
	// Command functions

	// Reload window (and game)
	const _quit = () => {
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
		return game.describeSurroundings();
	}
 
	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.                               
	const _act_upon = (command) => {
		game.state.objectMode = true;
		game.state.pendingAction = command;
		return console.p(`What is it you would like to ${command}?`);
	}

	// change to console.info
	const _pref = (whichPref) => {
		game.state.prefMode = true;
		game.state.pendingAction = whichPref;

		const pStyle = `font-size:120%;color:#32cd32;font-family:${primaryFont}`;
		const italic = `font-size:120%;color:#32cd32;font-style:italic;font-family:${primaryFont}`;
		const bold = `font-size:120%;color:#32cd32;font-style:bold;font-family:${primaryFont}`;
		const example = `font-size:120%;color:#7BF65E;font-weight:bold;font-family:${primaryFont}`;
		const exampleItalic = `font-size:120%;color:#7BF65E;font-style:italic;font-weight:bold;font-family:${primaryFont}`;
		console.p(`Enter value for ${whichPref}.`);
		console.inline([`Value must be entered`,` within parentheses (and quotes, if the value is a string), and immediately preceded by an underscore.`],[pStyle, italic]);
		return console.inline([`Like this:  `, `_(`, `"value"`, `)`], [bold, example, exampleItalic, example]);
	}

	// Displays items in the player's inventory.
	const _inventory = (command) => {
		// let output = `You are carrying `;
		// game.state.inventory.map((item) => {
		// 	let itemWithArticle = item.article ? `${item.article} ${item.name}`;
		// 	output += itemWithArticle;
		// });
		// let formatted = this.formatList()


		let items = [];
		game.state.inventory.map((item) => {
			const itemWithArticle = item.article ? `${item.article} ${item.name}` :  item.name;
			console.log('itemWithArticle', itemWithArticle);
			items.push(itemWithArticle);
			// return item.article ? `${item.article} ${item.name}` : `${item.name}`;
		});
		let formatted =  `You are carrying ${game.formatList(items)}`.split(" ");
		console.log('formatted', formatted);
		// console.log(game.formatList(items).split(" "));
		// console.p("You are carrying:");
		// return game.state.inventory.map((item) => {
		// 	console.color("cyan", `${item.article}`, ` ${item.name}`, ",")
		// })
		// const segments = ["You are carrying"].concat(items)//game.formatList(items);
		// console.log('segments', segments);
		// console.log(["You are carrying"].concat(segments));
		const pStyle = `font-size:120%;color:#32cd32;font-family:${primaryFont}`;
		const itemStyle = `font-size:120%;color:cyan;font-style:italic;font-family:${primaryFont}`;
		console.inline(["test"],["color:cyan;"]);
		const segments = ["You are carrying"].concat(items);
		console.log('segments', segments);

		return console.inline(segments, [pStyle, itemStyle, pStyle, itemStyle, pStyle, itemStyle]);
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

	const _save = (command) => {
		game.state.saveMode = true;
		game.state.restoreMode = false;
		game.state.pendingAction = command;
		console.log('game.state.pendingAction', game.state.pendingAction)
		const infoStyle = `font-size:100%;color:#75715E;font-family:${primaryFont};`;
		const boldInfo = infoStyle + `font-weight:bold;color:white`;
		console.info("Please choose a slot number (0 – 9) to save your game. To save to the selected slot, type an underscore, immediately followed by the slot number.");
		console.inline([`For example, type `, `_3`, ` to select slot 3.`],[infoStyle, boldInfo, infoStyle]);
	}

	const _restore = (command) => {
		let keys = Object.keys(localStorage);
		let saves = keys.filter((key) => {
			return key.indexOf("ConsoleGame.save") !== -1;
		});
		if (saves.length > 0) {
			let slotList = saves.map((save) => {
				let x = save.substring(save.length - 2);
				return x;
			})
			console.info(`saved games:\n${slotList}`);
			game.state.restoreMode = true;
			game.state.saveMode = false;
			game.state.pendingAction = command;
			const infoStyle = `font-size:100%;color:#75715E;font-family:${primaryFont};`;
			const boldInfo = infoStyle + `font-weight:bold;color:white`;
			console.info("Please choose which slot number (0 – 9) to restore from. To restore, type an underscore, immediately followed by the slot number.");
			return console.inline([`For example, type `, `_3`, ` to select slot 3.`],[infoStyle, boldInfo, infoStyle]);
		}
		return console.info("No saved games found.");
	}

	const _save_slot = (slotNumber) => {
		if (game.state.saveMode){
			console.invalid(`Save to slot ${slotNumber} failed.`);
			return game.state.saveMode = false;
		} else if (game.state.restoreMode){
			console.invalid(`Restore from slot ${slotNumber} failed.`);
			return game.state.restoreMode = false;
		}
		return console.p(`Game saved to slot ${slotNumber}`);
	}

	const _poof = () => {
		$("body").empty().css("background-color", "black");
		return console.papyracy(">poof<");
	}


	const cases = (word) => {
	  let lc = word.toLowerCase();
	  let cases = [lc, `${lc.charAt(0).toUpperCase()}${lc.slice(1)}`, lc.toUpperCase()];
	  return cases;
	}

	const aliasString = (word, thesaurus, addOn) => {
		let string = `${cases(word).join(",")}${addOn}`;
		

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
		[_inventory, `${cases("inventory").join(",")},i,I`],
		[_act_upon, "use,Use,USE"],
		[_act_upon, "take,Take,TAKE,t,T,get,Get,GET"],
		[_act_upon, "read,Read,READ"],
		[_act_upon, "examine,Examine,EXAMINE,inspect,Inspect,INSPECT"],
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
		[_save_slot, "_0,save0,Save0,SAVE0"],
		[_save_slot, "_1,save1,Save1,SAVE1"],
		[_save_slot, "_2,save2,Save2,SAVE2"],
		[_save_slot, "_3,save3,Save3,SAVE3"],
		[_save_slot, "_4,save4,Save4,SAVE4"],
		[_save_slot, "_5,save5,Save5,SAVE5"],
		[_save_slot, "_6,save6,Save6,SAVE6"],
		[_save_slot, "_7,save7,Save7,SAVE7"],
		[_save_slot, "_8,save8,Save8,SAVE8"],
		[_save_slot, "_9,save9,Save9,SAVE9"],
		[_restore, "restore,Restore,RESTORE,load","Load","LOAD"],
		[_pref, "font","Font","FONT"],
		[_pref, "color","Color","COLOR"],
		[_poof, "poof,Poof,POOF"],
		[_quit, "quit,Quit,QUIT,oops,Oops,OOPS,restart,RESTART,Restart"]
	];

	return aliases;
};//)();
