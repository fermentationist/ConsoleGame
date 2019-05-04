import {primaryFont, textColor, fontSize, pStyle} from "./prefs.js";
import game from "./game.js";

// Wait for page to load, and display greeting.
window.onload = () => {
    // console.clear();
    const prefMode = localStorage.getItem("ConsoleGame.prefMode");
    // used 
    if (prefMode) {
        localStorage.removeItem("ConsoleGame.prefMode");
        return game._resume();
    }
    return game.intro();
};
// for debugging - remove later
// window.game = ConsoleGame;
export default game;