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
		displayItem,
		cases} = game;
	const toggleVerbosity = game.toggleVerbosity.bind(game);
	// Change player's location on the map, given a direction
	const _movePlayer = (direction) => {
		game.objectMode = false;
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
			game.state.abortMode = true;// don't count failed move as a turn; don't increment timers
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
		console.p(game.state.currentMapCell.smell);
		return;
	}

	const _listen = command => {
		console.p(game.state.currentMapCell.sound);
		return;
	}
	// Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.                               
	const _act_upon = command => {
		game.state.objectMode = true;
		game.state.pendingAction = command;
		console.p(`What would you like to ${command}?`);
	}

	// _none function is bound to commands that should do nothing at all
	const _none = () => {}// do nothing

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
		if (!game.state.objectMode && itemName !== "maps"){
			console.invalid("Invalid command");
			return;
		}
		// Exit function with error message if item is not available in player inventory or current location.
		const item = game.inEnvironment(itemName) || game.inInventory(itemName);
		if (!item){
			game.state.objectMode = false;
			console.invalid(`${itemName} is not available.`);
			return;
		}
		const action = game.state.pendingAction;
		// invoke the item's method that corresponds to the selected action
		return item[action]();
	}

	const _yell = () => {
		console.scream("Aaaarrgh!!!!");
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
	// 	// game.state.pendingAction = "font"
	// 	game.state.prefMode = true;
	// 	// game.setPreference("papyrus");
	// 	localStorage.setItem("ConsoleGame.prefs.font", "papyrus");
	// 	localStorage.setItem("ConsoleGame.prefMode", "true");
	// 	// game.state.prefMode = false;
	// 	location.reload();
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

	// Commands and their aliases
	const commandAliases = [
		
		// Move
		[_movePlayer, cases("north") + ",n,N"],
		[_movePlayer, cases("south") + ",s,S"],
		[_movePlayer, cases("east") + ",e,E"],
		[_movePlayer, cases("west") + ",w,W"],
		[_movePlayer, cases("up") + ",u,U"],
		[_movePlayer, cases("down") + ",d,D"],

		// Direct Actions
		[_go, aliasString("go", thesaurus)],
		[_inventory, aliasString("inventory", thesaurus) + ",i,I"],
		[_listen, aliasString("listen", thesaurus)],
		[_look, aliasString("look", thesaurus) + ",l,L"],
		[_smell, aliasString("smell", thesaurus)],
		[_wait, aliasString("wait", thesaurus) + ",z,Z,zzz,ZZZ,Zzz"],
		[_yell, aliasString("yell", thesaurus)],

		// Item methods
		[_act_upon, aliasString("burn", thesaurus)],
		[_act_upon, aliasString("climb", thesaurus)],
		[_act_upon, aliasString("close", thesaurus)],
		[_act_upon, aliasString("contemplate", thesaurus)],
		[_act_upon, aliasString("drink", thesaurus)],
		[_act_upon, aliasString("drop", thesaurus)],
		[_act_upon, aliasString("eat", thesaurus)],
		[_act_upon, aliasString("examine", thesaurus) + ",x,X"],
		[_act_upon, aliasString("extinguish", thesaurus)],
		[_act_upon, aliasString("flush", thesaurus)],
		// [_act_upon, aliasString("hide", thesaurus)],
		[_act_upon, aliasString("light", thesaurus)],
		[_act_upon, aliasString("lock", thesaurus)],
		[_act_upon, aliasString("move", thesaurus)],
		[_act_upon, aliasString("open", thesaurus)],
		[_act_upon, aliasString("play", thesaurus)],
		[_act_upon, aliasString("project", thesaurus)],
		[_act_upon, aliasString("pull", thesaurus)],
		[_act_upon, aliasString("read", thesaurus)],
		[_act_upon, aliasString("rezrov", thesaurus)],
		[_act_upon, aliasString("spray", thesaurus)],
		[_act_upon, aliasString("take", thesaurus)],
		[_act_upon, aliasString("turn", thesaurus)],
		[_act_upon, aliasString("unlock", thesaurus)],
		[_act_upon, aliasString("use", thesaurus)],
		
		// Misc
		[_commands, cases("commands") + ",c,C"],
		[_help, cases("help") + ",h,H"],
		[_inventoryTable, cases("inventoryTable", "invTable", "invt")],
		// [_papyracy, cases("papyracy")],
		[toggleVerbosity, cases("verbose")],
		[_yes, cases("yes") + ",y,Y"],

		// Start/QUIT
		[_start, cases("start", "begin", "commence")],
		[_resume, cases("resume", "proceed")],
		[_quit, cases("quit", "restart")],
		[_quit, cases("restart")],

		// Save/Restore
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

		// Prefs 
		[_pref, cases("font")],
		[_pref, cases("color")],
		[_pref, cases("size")],
		[_poof, cases("poof")],

		// this command exists as a kludgy fix for a bug that happens if console is in "eager evaluation" mode. Starting to type "glove" auto-evaluates to "globalThis", which for some reason calls _act_upon("close"). This same goes for the keyword "this". This command tricks auto-evaluation because it prioritizes suggestions alphabetically.
		[_none, cases("globaa")],
		[_none, cases("thia")],
		
		
		
		

	];
	const itemNames = Object.keys(game.items).map(item => item.slice(1));
	const itemAliases = itemNames.map(item => [_items, aliasString(item, thesaurus)])
	const aliases = commandAliases.concat(itemAliases);

	// ALIASES = aliases;
	return aliases;
};

export default Commands;