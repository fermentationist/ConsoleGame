import {primaryFont, textColor, fontSize, pStyle} from "./prefs.js";
import ConsoleGame from "./game.js";

// Create new game object and set its prototype to ConsoleGame.
const game = {};
Object.setPrototypeOf(game, ConsoleGame);
// Wait for page to load, and display greeting.
window.onload = () => {
    // console.clear();
    game.intro();
};
// for debugging - remove later
window.game = ConsoleGame;
export default game;