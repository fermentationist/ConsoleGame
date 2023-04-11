import { GameType } from "./Game";
import { primaryFont } from "./utils/prefs";
// This object contains most of the text that is displayed to the user. Each key is a string to be is referenced by a game method. Each value is either a string, an array of strings, or a function that returns a string. The function is passed the game object as an argument, so that it can access the current state of the game, and the log methods.

  const descriptions = {

  preface: "You slowly open your eyes. Your eyelids aren't halfway open before the throbbing pain in your head asserts itself. The last thing you can remember is taking your dog for a walk. Your current surroundings look entirely unfamiliar.",

  intro: (game: GameType) => {
    const intro_1 = "\nWelcome!\nAs a fan of old Infocom™ interactive fiction games, I thought it would be fun to hide a text adventure in the browser's JavaScript console. Try it out by typing in the console below. Have fun!\n";
		game.log.title("consoleGame");
		game.log.custom("by Dennis Hodges\ncopyright 2019-2023", "font-size:100%;color:lightgray;padding:0 1em;");
		game.log.intro(intro_1);
		game.log.codeInline((descriptions as Record<string, any>).introOptions(game));
  },

  introOptions: (game: GameType) => {
		const existingGame= [
			"[ It looks like you have an unsaved game in progress from a previous session. If you would like to continue, type ",
			"resume",
			". If you would like to load a saved game, type ",
			"restore",
			". To begin a new game, please type ",
			"start",
			". ]"
		];
		const initialOptions = [
			"[ Please type ",
			"help ",
			"for instructions, ",
			"restore ",
			"to load a saved game, or ",
			"start ",
			"to begin a new game. ]"
		];
		return game.unfinishedGame() ? existingGame : initialOptions;
	},

  captured: ["As you step out onto the front porch, you struggle to see in the bright midday sun, your eyes having adjusted to the dimly lit interior of the house. You hear a surprised voice say, \"Hey! How did you get out here?!\" You spin around to see the source of the voice, but something blunt and heavy has other plans for you and your still aching skull. You descend back into the darkness of sleep.", "Groggily, you lift yourself from the floor, your hands probing the fresh bump on the back of your head."],

  winner: (game, additionalText) => {
    if (additionalText) {
      game.log.win(additionalText);
    }
    game.log.win("You win!! Congratulations and thanks for playing!")
  },

  gameOver: (game) => game.log.codeInline(["[Game over. Please type ", "start ", "to begin a new game.]"]),

  dead: "You have died. Of course, being dead, you are unaware of this unfortunate turn of events.",

  help: (game) => {
		// Greeting to be displayed at the beginning of the game
		const baseStyle = `font-family:${primaryFont};color:pink;font-size:105%;line-height:1.5;`;
		const italicCodeStyle = "font-family:courier;color:#29E616;font-size:115%;font-style:italic;line-height:2;";
		const codeStyle = "font-family:courier;color:#29E616;font-size:115%;line-height:1.5;";
		const text = ["Valid commands are one word long, with no spaces. Compound commands consist of at most two commands, separated by a carriage return or a semicolon. For example:\n", "get\n", "What would you like to take?\n", "lamp\n", "You pick up the lamp.\n","or,\n", "get;lamp\n", "What would you like to take?\nYou pick up the lamp."];
		const styles = [baseStyle, codeStyle, italicCodeStyle, codeStyle, italicCodeStyle, baseStyle, codeStyle, italicCodeStyle];
		game.log.inline(text, styles);
		const text_2 = ["Typing ", "inventory ", "or ", "i ", "will display a list of any items the player is carrying. \nTyping ", "look ", "or ", "l ", "will give you a description of your current environs in the game. \nCommands with prepositions are not presently supported, and ", "look ", "can only be used to \"look around\", and not to \"look at\" something. Please instead use ", "examine ", "or its shortcut ", "x ", "to investigate an item's properties. \nThe player may move in the cardinal directions– ", "north", ", ", "south", ", ", "east", " and ", "west ", "as well as ", "up ", "and ", "down. ", "Simply type the direction you want to move. These may be abbreviated as ", "n", ", ", "s", ", ", "e", ", ", "w", ", ", "u ", "and ", "d ", ", respectively."];
		game.log.codeInline(text_2, baseStyle, codeStyle);
		const text_3 = ["You may save your game progress (it will be saved to localStorage) by typing ", "save", ". You will then be asked to select a save slot, ", "_0 ", "through ", "_9 ", "(remember, user input can't begin with a number). Typing ", "help ", "will display the in-game help text."];
	
		game.log.codeInline(text_3, baseStyle, codeStyle);
		game.log.codeInline((descriptions as any).introOptions(game));
	},

  restore: (game, slotList) => {
    game.log.codeInline(["saved games:\n", slotList]);
    game.log.codeInline(["Please choose which slot number (0 through 9) to restore from. To restore, type an underscore, ", "_ ", "immediately followed by the slot number."]);
    const exampleSlot = slotList[0] || "_0";
		game.log.codeInline([`For example, type `, exampleSlot, ` to select slot ${exampleSlot.slice(1)}.`]);
  },

  save: (game) => {
    game.log.codeInline(["Please choose a slot number (0 through 9) to save your game. To save to the selected slot, type an underscore, ", "_", " immediately followed by the slot number."]);
		game.log.codeInline([`For example, type `, `_3`, ` to select slot 3.`]);
  },

  doorLock: "You hear a short metallic scraping sound, ending in a click. It sounds like the front door being locked from the outside.",

} as Record<string, string | string[] | ((gameContext: GameType, value?: any) => void) | ((gameContext: GameType, value?: any) => string)>


export default descriptions;