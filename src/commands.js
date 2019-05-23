import {pStyle, textColor, primaryFont, fontSize} from "./prefs.js";
import thesaurus from "./thesaurus.js";
import maps from "./maps.js";
import itemModule from "./items.js";

var ALIASES;

// Command functions
const Commands = game => {

	// destructure admin methods from game object
	const { _start,
		_help,
		_commands,
		_restore,
		_save,
		_save_slot,
		_quit,
		_resume,
		mapKey,
		cases} = game;
	// Change player's location on the map, given a direction
	const _movePlayer = (direction) => {
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
			default:
				break;
		}
		const newCell = maps[newPosition.z][newPosition.y][newPosition.x];
		// Exit function if movement in given direction is not possible due to map boundary
		if (newCell === "*"){
			console.p("You can't go that direction");
			return;
		}
		// Display message and exit function if path to next space is blocked by a locked or closed door or analagous item
		if (game.mapKey[newCell].locked || game.mapKey[newCell].closed){
			console.p("The way is blocked.");
			console.p(game.mapKey[newCell].lockText && (game.mapKey[newCell].locked || game.mapKey[newCell].closed) ? game.mapKey[newCell].lockText : "");
			return;
		}
		// If movement in direction is possible, update player position
		console.p(`You walk ${direction}...`);
		game.state.position = {
			x: newPosition.x,
			y: newPosition.y,
			z: newPosition.z,
		}
		// End by describing new environment after move
		return game.describeSurroundings();
	}

	// Describe environment and movement options in current location
	const _look = command => {
		return game.describeSurroundings();
	}
 
	const _smell = command => {
		const currentCell = game.state.currentCell;
		console.p(game.mapKey[currentCell].smell);
		return;
	}

	const _listen = command => {
		const currentCell = game.state.currentCell;
		console.p(game.mapKey[currentCell].sound);
		return;
	}
	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.                               
	const _act_upon = command => {
		game.state.objectMode = true;
		game.state.pendingAction = command;
		console.p(`What would you like to ${command}?`);
	}

	// todo: move to game.js
	const _pref = (whichPref) => {
		game.state.prefMode = true;
		game.state.pendingAction = whichPref;
		console.codeInline([`To set the value of ${whichPref}, you must type an underscore `, `_`, `, followed by the value enclosed in backticks `,`\``,`.`]);
		console.codeInline([`For example: `, `_\`value\``]);
	}

	const _wait = () => {
		console.p("Time passes...");
	}

	const _go = () => {
		console.p("Which direction do you want to go?");
	}

	// Displays items in the player's inventory.
	const _inventory = command => {

		let items = [], itemsPlusArticles = [];
		// const itemsPlusArticles = game.state.inventory.map(item => item.article ? `${item.article} ${item.name}` :  item.name);
		game.state.inventory.forEach(item => {
			items.push(item.name);
			const itemWithArticle = item.article ? `${item.article} ${item.name}` :  item.name;
			itemsPlusArticles.push(itemWithArticle);
		});
		
		let segments =  `You are carrying ${game.formatList(itemsPlusArticles)}`.split(" ");
		// console.log("TCL: segments", segments)
		let itemStyle = `font-size:120%;color:cyan;font-style:italic;`;

		let styles = segments.map((word) => {
			let style = pStyle;
			items.map((thing) => {
				if (word.includes(thing)){
					style = itemStyle;
				}
			});
			return style;
		});

		segments = segments.map((word, i) => {
			return i === segments.length - 1 ? `${word}.` : `${word} `;
		});
		return console.inline(segments, styles);
	}

	// Displays inventory as a table.
	const _inventoryTable = command => {
		const table =game.state.inventory.map(item => {
			const {name, description} = item;
			return {name, description};
		})
		return console.table(table, ["name", "description"]);
}

	// Handles commands that are item names.
	const _items = (itemName) => {
		// Exit function with error message if previous command does not require an object
		if (!game.state.objectMode){
			return console.invalid("Invalid command");
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

		
	const _yes = () => {
		if (! game.state.confirmMode) {
			console.p("nope.");
			return;
		}
		if (game.confirmationCallback){
			return game.confirmationCallback();
		}
	}

	const _poof = () => {
		const body = document.querySelector("body");
		body.parentNode.removeChild(body);
		return console.papyracy(">poof<");
	}

	// const _papyracy = () => {
	// 	const font = primaryFont;
	// 	const color = textColor;
	// 	return function papyracy () {
	// 		primaryFont = primaryFont === "Papyrus" ? "";
	// 		textColor = "chartreuse";
	// 	}
	// }

	const aliasString = (word, thesaurus = null, optionalString = "") => {
		// thesaurus will be added to params
		let variations = [];
		if (thesaurus){
			const synonyms = thesaurus[word] || [];
			variations = synonyms.filter((synonym) => {
				if (synonym.indexOf(" ") === -1){
					return cases(synonym);
				}
			});
		}
		return `${cases(word)},${variations.join()}${optionalString ? "," +optionalString : ""}`;
	}
	// Command aliases
	const commandAliases = [
		// Start
		[_start, cases("start", "begin", "commence")],
		[_resume, cases("resume")],
		// Move
		[_movePlayer, cases("north") + ",n,N"],
		[_movePlayer, cases("south") + ",s,S"],
		[_movePlayer, cases("east") + ",e,E"],
		[_movePlayer, cases("west") + ",w,W"],
		[_movePlayer, cases("up") + ",u,U"],
		[_movePlayer, cases("down") + ",d,D"],

		// Actions
		[_go, aliasString("go", thesaurus)],
		[_wait, aliasString("wait", thesaurus) + ",z,Z,zzz,ZZZ,Zzz"],
		[_look, cases("look", "see", "observe") + ",l,L"],
		[_smell, aliasString("smell", thesaurus)],
		[_listen, aliasString("listen", thesaurus)],
		[_inventory, aliasString("inventory", thesaurus) + ",i,I"],
		[_act_upon, aliasString("use", thesaurus)],
		[_act_upon, aliasString("take", thesaurus)],
		[_act_upon, aliasString("read", thesaurus)],
		[_act_upon, aliasString("examine", thesaurus) + ",x,X"],
		[_act_upon, aliasString("drink", thesaurus)],
		[_act_upon, aliasString("drop", thesaurus)],
		[_act_upon, aliasString("move", thesaurus)],
		[_act_upon, aliasString("pull", thesaurus)],
		[_act_upon, aliasString("spray", thesaurus)],
		[_act_upon, aliasString("contemplate", thesaurus)],
		[_act_upon, aliasString("unlock", thesaurus)],
		[_act_upon, aliasString("open", thesaurus)],
		[_act_upon, aliasString("close", thesaurus)],
		[_act_upon, aliasString("lock", thesaurus)],
		[_act_upon, aliasString("turn", thesaurus)],
		[_act_upon, cases("hide")],

		// // Objects
		// [_items, cases("grue_repellant", "repellant")],
		// [_items, cases("key")],
		// [_items, aliasString("note", thesaurus)],
		// [_items, cases("no_tea")],
		// [_items, cases("chain")],
		// [_items, aliasString("glove", thesaurus)],
		// [_items, cases("catalogue", "catalog")],
		// [_items, cases("all")],



		// Misc
		[_inventoryTable, cases("inventoryTable", "invTable", "invt")],
		[_help, cases("help") + ",h,H"],
		[_commands, cases("commands") + ",c,C"],

		// [_all, cases("all")],
		[_save, cases("save")],
		[_save_slot, "_0"],
		[_save_slot, "_1"],
		[_save_slot, "_2"],
		[_save_slot, "_3"],
		[_save_slot, "_4"],
		[_save_slot, "_5"],
		[_save_slot, "_6"],
		[_save_slot, "_7"],
		[_save_slot, "_8"],
		[_save_slot, "_9"],
		[_restore, cases("restore", "load")],
		[_pref, cases("font")],
		[_pref, cases("color")],
		[_pref, cases("size")],
		[_poof, cases("poof")],
		[_quit, cases("quit")],
		[_quit, cases("restart")],
		[_yes, cases("yes") + ",y,Y"],
	];
	const itemNames = Object.keys(game.items).map(item => item.slice(1));
	const itemAliases = itemNames.map(item => [_items, aliasString(item, thesaurus)])
	const aliases = commandAliases.concat(itemAliases);

	// ALIASES = aliases;
	return aliases;
};//)();

export default Commands;